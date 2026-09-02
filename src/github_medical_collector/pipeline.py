# LOCKED: false

"""Collection workflow orchestration."""

from __future__ import annotations

import time
from typing import Any

from .catalog import (
    merge_candidates,
    normalize_manual_repository,
    normalize_repository,
    relevance_evidence,
)
from .config import SearchSpec
from .github_client import GitHubClient
from .logging_utils import my_logger


# Data:
# - client: GitHub API boundary
# - specs/manual_entries: discovery and curated inputs
# - existing_records: stable first-seen history
# - max_results/delay/run_date: bounded execution policy
# Algorithm:
# 1. Execute each configured search serially and retain relevant records.
# 2. Refresh curated seeds directly.
# 3. Merge, classify, and return deterministic records.
def collect_records(
    client: GitHubClient,
    specs: list[SearchSpec],
    manual_entries: list[dict[str, Any]],
    existing_records: list[dict[str, Any]],
    max_results: int,
    delay_seconds: float,
    run_date: str,
    logger: my_logger,
) -> list[dict[str, Any]]:
    assert specs, "collection needs at least one search specification"
    assert 1 <= max_results <= 100, "max results must be within GitHub limits"
    assert delay_seconds >= 0, "request delay cannot be negative"
    assert run_date, "run date must be non-empty"
    existing_dates = {
        str(record.get("full_name", "")).lower(): str(
            record.get("first_seen_at") or run_date
        )
        for record in existing_records
    }
    candidates: list[dict[str, Any]] = []
    for index, spec in enumerate(specs):
        logger.info("Searching [%s/%s] %s", spec.category, spec.scope, spec.query)
        items = client.search_repositories(spec, max_results)
        logger.info("Search returned %d repositories", len(items))
        for item in items:
            identity = str(item.get("full_name") or "").lower()
            record = normalize_repository(
                item,
                spec.category,
                spec.query,
                spec.scope,
                existing_dates.get(identity, run_date),
            )
            if record is None:
                continue
            evidence = relevance_evidence(record, spec.category, spec.scope)
            if evidence is None:
                logger.debug("Rejected noisy search hit %s", record["full_name"])
                continue
            record["relevance_evidence"] = evidence
            candidates.append(record)
        if index < len(specs) - 1 and delay_seconds:
            time.sleep(delay_seconds)

    for manual_entry in manual_entries:
        full_name = str(manual_entry["full_name"])
        logger.info("Refreshing curated seed %s", full_name)
        item = client.get_repository(full_name)
        manual_record = normalize_manual_repository(
            item,
            manual_entry,
            existing_dates.get(full_name.lower(), run_date),
        )
        if manual_record is None:
            logger.info("Skipped curated seed below eligibility boundary: %s", full_name)
            continue
        candidates.append(manual_record)
    records = merge_candidates(candidates, existing_records)
    assert records, "collection produced no repositories"
    return records
