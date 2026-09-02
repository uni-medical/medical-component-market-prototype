# LOCKED: false

"""Configuration data contracts and JSON loading."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .constants import CATEGORY_ORDER, MIN_STARS, SEARCH_SCOPES


@dataclass(frozen=True)
class SearchSpec:
    """One category-and-scope-bound GitHub Repository Search expression."""

    category: str
    query: str
    scope: str

    # Data:
    # - category/query/scope: configured search category, expression, and intent
    # Algorithm:
    # 1. Lock category, scope, minimum-Star, and search-surface invariants.
    def __post_init__(self) -> None:
        assert self.category in CATEGORY_ORDER, f"unsupported category: {self.category}"
        assert self.scope in SEARCH_SCOPES, f"unsupported search scope: {self.scope}"
        assert self.query.strip(), "search query must be non-empty"
        normalized_query = self.query.lower()
        assert f"stars:>={MIN_STARS}" in normalized_query, (
            "every query must apply the global minimum-Star filter"
        )
        assert "in:name,description" in normalized_query, (
            "repository search must stay within name and description"
        )
        assert "archived:false" in normalized_query, (
            "repository search must exclude archived repositories"
        )


# Data:
# - path: UTF-8 JSON file
# Algorithm:
# 1. Decode JSON.
# 2. Assert the root data contract is an object.
def load_json_object(path: Path) -> dict[str, Any]:
    assert path.is_file(), f"missing JSON file: {path}"
    payload = json.loads(path.read_text(encoding="utf-8"))
    assert isinstance(payload, dict), f"JSON root must be an object: {path}"
    return payload


# Data:
# - path: search-query configuration
# Algorithm:
# 1. Validate the declared fixed category order.
# 2. Convert unique query objects into immutable SearchSpec values.
def load_search_specs(path: Path) -> list[SearchSpec]:
    payload = load_json_object(path)
    assert tuple(payload.get("categories", [])) == CATEGORY_ORDER, (
        "configured categories must match the fixed README order"
    )
    assert payload.get("minimum_stars") == MIN_STARS, (
        "configured and enforced minimum-Star thresholds must match"
    )
    raw_queries = payload.get("queries", [])
    assert isinstance(raw_queries, list) and raw_queries, "queries must be non-empty"
    assert all(isinstance(item, dict) for item in raw_queries), (
        "each search query must be an object"
    )
    specs = [
        SearchSpec(item["category"], item["query"], item["scope"])
        for item in raw_queries
    ]
    assert len({spec.query for spec in specs}) == len(specs), "queries must be unique"
    required_pairs = {
        (category, scope) for category in CATEGORY_ORDER for scope in SEARCH_SCOPES
    }
    configured_pairs = {(spec.category, spec.scope) for spec in specs}
    assert required_pairs <= configured_pairs, (
        "every category must include medical and general search scopes"
    )
    return specs


# Data:
# - path: curated-entry configuration
# Algorithm:
# 1. Load the entries array.
# 2. Validate repository identities and fixed categories.
def load_manual_entries(path: Path) -> list[dict[str, Any]]:
    payload = load_json_object(path)
    entries = payload.get("entries", [])
    assert isinstance(entries, list), "manual entries must be a list"
    assert all(isinstance(entry, dict) for entry in entries), (
        "each manual entry must be an object"
    )
    for entry in entries:
        assert entry["full_name"].count("/") == 1, (
            "manual repository must be owner/name"
        )
        assert entry["category"] in CATEGORY_ORDER, "manual category is unsupported"
    return entries
