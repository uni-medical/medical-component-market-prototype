# LOCKED: false

"""Repository normalization, relevance filtering, classification, and merging."""

from __future__ import annotations

import re
from typing import Any

from .constants import (
    CATEGORY_KEYWORDS,
    CATEGORY_ORDER,
    CATEGORY_PRECEDENCE,
    DSH_KEYWORDS,
    GENERAL_KEYWORDS,
    MEDICAL_KEYWORDS,
    MIN_STARS,
    RECORD_SCOPES,
    SEARCH_SCOPES,
    TOOL_FOCUS_KEYWORDS,
)


# Data:
# - item: GitHub repository API object
# - category/query/scope: discovery provenance
# - first_seen_at: stable catalog admission date
# Algorithm:
# 1. Reject private, archived, fork, and sub-threshold repositories.
# 2. Map GitHub metadata to the catalog schema.
# 3. Preserve category evidence for deterministic resolution.
def normalize_repository(
    item: dict[str, Any],
    category: str,
    query: str,
    scope: str,
    first_seen_at: str,
) -> dict[str, Any] | None:
    assert category in CATEGORY_ORDER, "normalization category is unsupported"
    assert scope in RECORD_SCOPES, "normalization scope is unsupported"
    assert first_seen_at, "first_seen_at is required"
    if item.get("private") or item.get("archived") or item.get("fork"):
        return None
    stars = int(item.get("stargazers_count") or 0)
    if stars < MIN_STARS:
        return None
    full_name = str(item.get("full_name") or "").strip()
    url = str(item.get("html_url") or "").strip()
    if not full_name or not url:
        return None
    license_object = item.get("license") or {}
    license_id = license_object.get("spdx_id") or "NOASSERTION"
    topics = sorted(
        {str(topic).strip().lower() for topic in item.get("topics", []) if topic}
    )
    return {
        "category": category,
        "full_name": full_name,
        "url": url,
        "stars": stars,
        "license": str(license_id),
        "description": str(item.get("description") or "").strip(),
        "language": str(item.get("language") or "NOASSERTION"),
        "topics": topics,
        "updated_at": str(item.get("updated_at") or ""),
        "pushed_at": str(item.get("pushed_at") or ""),
        "homepage": str(item.get("homepage") or "").strip(),
        "open_issues": int(item.get("open_issues_count") or 0),
        "first_seen_at": first_seen_at,
        "source": "github-search",
        "matched_queries": [query],
        "matched_categories": [category],
        "matched_scopes": [scope],
    }


# Data:
# - text: lower-cased repository metadata
# - keyword: one relevance phrase
# Algorithm:
# 1. Use token boundaries for alphanumeric keywords.
# 2. Use literal matching for punctuation-bearing phrases.
def contains_keyword(text: str, keyword: str) -> bool:
    assert text == text.lower(), "keyword matching expects lower-cased text"
    normalized_keyword = keyword.lower()
    if re.fullmatch(r"[a-z0-9]+", normalized_keyword):
        pattern = rf"(?<![a-z0-9]){re.escape(normalized_keyword)}(?![a-z0-9])"
        return re.search(pattern, text) is not None
    return normalized_keyword in text


# Data:
# - text: lower-cased repository metadata
# Algorithm:
# 1. Accept explicit Agent Tool, function/tool-calling, or research phrases.
# 2. Otherwise require Agent and Tool terms within five intervening words.
# 3. Never treat a generic API, library, platform, or distant word co-occurrence
#    as Tool evidence.
def tool_category_hits(text: str) -> list[str]:
    assert text == text.lower(), "Tool matching expects lower-cased text"
    direct_hits = [
        keyword
        for keyword in TOOL_FOCUS_KEYWORDS
        if contains_keyword(text, keyword)
    ]
    if direct_hits:
        return sorted(set(direct_hits))
    relation_patterns = (
        r"\b(?:agent|agents|agentic)\b(?:\W+\w+){0,5}\W+\b(?:tool|tools|toolkit)\b",
        r"\b(?:tool|tools|toolkit)\b(?:\W+\w+){0,5}\W+\b(?:agent|agents|agentic)\b",
    )
    if any(re.search(pattern, text) for pattern in relation_patterns):
        return ["agent-tool relation"]
    return []


# Data:
# - text: lower-cased repository metadata
# - category: one supported catalog category
# Algorithm:
# 1. Route Tool through its focused Agent/calling rule.
# 2. Match every other category against its fixed vocabulary.
def category_keyword_hits(text: str, category: str) -> list[str]:
    assert category in CATEGORY_ORDER, "keyword category is unsupported"
    if category == "Tool":
        return tool_category_hits(text)
    return sorted(
        keyword
        for keyword in CATEGORY_KEYWORDS[category]
        if contains_keyword(text, keyword)
    )


# Data:
# - record: normalized GitHub metadata
# - query_category/query_scope: category and intent that discovered the repository
# Algorithm:
# 1. Extract medical, general, DSH, and category keyword evidence.
# 2. Accept DSH-specific general Plugin repositories directly.
# 3. Require scope evidence and category evidence together.
def relevance_evidence(
    record: dict[str, Any], query_category: str, query_scope: str
) -> list[str] | None:
    assert query_category in CATEGORY_ORDER, "relevance category is unsupported"
    assert query_scope in SEARCH_SCOPES, "relevance scope is unsupported"
    searchable_text = " ".join(
        [
            str(record.get("full_name", "")),
            str(record.get("description", "")),
            " ".join(record.get("topics", [])),
        ]
    ).lower()
    medical_hits = sorted(
        keyword
        for keyword in MEDICAL_KEYWORDS
        if contains_keyword(searchable_text, keyword)
    )
    general_hits = sorted(
        keyword
        for keyword in GENERAL_KEYWORDS
        if contains_keyword(searchable_text, keyword)
    )
    dsh_hits = sorted(
        keyword for keyword in DSH_KEYWORDS if contains_keyword(searchable_text, keyword)
    )
    category_hits = category_keyword_hits(searchable_text, query_category)
    if query_scope == "general" and query_category == "Plugin" and dsh_hits:
        return [
            *(f"dsh:{keyword}" for keyword in dsh_hits),
            *(f"category:{keyword}" for keyword in category_hits),
        ]
    if query_scope == "medical" and medical_hits and category_hits:
        return [
            *(f"medical:{keyword}" for keyword in medical_hits),
            *(f"category:{keyword}" for keyword in category_hits),
        ]
    if query_scope == "general" and general_hits and category_hits:
        return [
            *(f"general:{keyword}" for keyword in general_hits),
            *(f"category:{keyword}" for keyword in category_hits),
        ]
    return None


# Data:
# - record: merged repository metadata and category evidence
# Algorithm:
# 1. Limit automatic classification to categories that actually discovered the record.
# 2. Score query-category and metadata keyword evidence within that candidate set.
# 3. Honor a curated category override.
# 4. Resolve score ties with a fixed precedence order.
def choose_category(record: dict[str, Any]) -> str:
    manual_category = record.get("manual_category")
    if manual_category:
        assert manual_category in CATEGORY_ORDER, "manual category must be supported"
        return str(manual_category)
    searchable_text = " ".join(
        [
            str(record.get("full_name", "")),
            str(record.get("description", "")),
            str(record.get("language", "")),
            " ".join(record.get("topics", [])),
        ]
    ).lower()
    matched_categories = record.get("matched_categories", [])
    candidate_categories = [
        category for category in CATEGORY_ORDER if category in matched_categories
    ]
    assert candidate_categories, "classification requires discovery category evidence"
    scores = {
        category: matched_categories.count(category) * 2
        for category in candidate_categories
    }
    for category in candidate_categories:
        scores[category] += 3 * len(category_keyword_hits(searchable_text, category))
    return max(
        candidate_categories,
        key=lambda category: (
            scores[category],
            -CATEGORY_PRECEDENCE.index(category),
        ),
    )


# Data:
# - candidates: normalized records, possibly repeated across queries
# - existing_records: prior records used to preserve first-seen dates
# Algorithm:
# 1. Merge records by case-insensitive owner/repository identity.
# 2. Union discovery evidence and honor manual overrides.
# 3. Resolve one category and return stable sorted records.
def merge_candidates(
    candidates: list[dict[str, Any]],
    existing_records: list[dict[str, Any]] | None = None,
) -> list[dict[str, Any]]:
    existing_first_seen = {
        str(record["full_name"]).lower(): record.get("first_seen_at")
        for record in (existing_records or [])
        if record.get("full_name")
    }
    merged: dict[str, dict[str, Any]] = {}
    for candidate in candidates:
        identity = str(candidate["full_name"]).lower()
        if identity not in merged:
            merged[identity] = dict(candidate)
            continue
        current = merged[identity]
        current["matched_queries"] = sorted(
            set(current.get("matched_queries", []))
            | set(candidate.get("matched_queries", []))
        )
        current["matched_categories"] = sorted(
            set(current.get("matched_categories", []))
            | set(candidate.get("matched_categories", []))
        )
        current["matched_scopes"] = sorted(
            set(current.get("matched_scopes", []))
            | set(candidate.get("matched_scopes", []))
        )
        current["relevance_evidence"] = sorted(
            set(current.get("relevance_evidence", []))
            | set(candidate.get("relevance_evidence", []))
        )
        if candidate.get("source") == "manual":
            current.update(
                {
                    "source": "manual",
                    "manual_category": candidate["manual_category"],
                    "manual_note": candidate.get("manual_note", ""),
                    "description": candidate.get("description")
                    or current["description"],
                }
            )

    records: list[dict[str, Any]] = []
    for identity, record in merged.items():
        record["first_seen_at"] = (
            existing_first_seen.get(identity) or record["first_seen_at"]
        )
        record["category"] = choose_category(record)
        record.pop("matched_categories", None)
        record.pop("manual_category", None)
        record["matched_queries"] = sorted(set(record.get("matched_queries", [])))
        record["matched_scopes"] = sorted(set(record.get("matched_scopes", [])))
        record["relevance_evidence"] = sorted(
            set(record.get("relevance_evidence", []))
        )
        records.append(record)
    return sorted(
        records,
        key=lambda record: (
            CATEGORY_ORDER.index(record["category"]),
            -int(record["stars"]),
            str(record["full_name"]).lower(),
        ),
    )


# Data:
# - item: current GitHub metadata
# - manual_entry: curated category and optional text override
# - first_seen_at: stable catalog admission date
# Algorithm:
# 1. Normalize the API object.
# 2. Attach manual precedence and audit metadata.
def normalize_manual_repository(
    item: dict[str, Any], manual_entry: dict[str, Any], first_seen_at: str
) -> dict[str, Any] | None:
    record = normalize_repository(
        item,
        manual_entry["category"],
        f"manual:{manual_entry['full_name']}",
        "manual",
        first_seen_at,
    )
    if record is None:
        return None
    record["source"] = "manual"
    record["relevance_evidence"] = ["manual-curation"]
    record["manual_category"] = manual_entry["category"]
    record["manual_note"] = str(manual_entry.get("manual_note") or "")
    if manual_entry.get("description_override"):
        record["description"] = str(manual_entry["description_override"])
    return record
