# LOCKED: false

"""Command-line composition root for local and CI collection runs."""

from __future__ import annotations

import argparse
import os
from datetime import datetime, timezone
from pathlib import Path

from .config import load_json_object, load_manual_entries, load_search_specs
from .github_client import GitHubClient
from .logging_utils import my_logger
from .persistence import persist_outputs
from .pipeline import collect_records


# Data:
# - argv: optional command-line argument list
# Algorithm:
# 1. Derive repository-relative default paths.
# 2. Parse path, API-bound, credential-name, and dry-run options.
def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    repository_root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--queries",
        type=Path,
        default=repository_root / "config/search_queries.json",
    )
    parser.add_argument(
        "--manual-entries",
        type=Path,
        default=repository_root / "config/manual_entries.json",
    )
    parser.add_argument(
        "--catalog",
        type=Path,
        default=repository_root / "runs/results/catalog.json",
    )
    parser.add_argument("--readme", type=Path, default=repository_root / "README.md")
    parser.add_argument("--max-results-per-query", type=int, default=25)
    parser.add_argument("--request-delay-seconds", type=float, default=None)
    parser.add_argument("--timeout-seconds", type=float, default=30.0)
    parser.add_argument("--token-env", default="GITHUB_TOKEN")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    return parser.parse_args(argv)


# Data:
# - argv: optional command-line inputs
# Algorithm:
# 1. Load configuration and prior state.
# 2. Collect and normalize GitHub metadata through composed modules.
# 3. Persist deterministic outputs unless dry-run.
def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    assert 1 <= args.max_results_per_query <= 100, "max results must be 1..100"
    assert args.timeout_seconds > 0, "timeout must be positive"
    logger = my_logger("github-medical-collector", args.verbose)
    token = os.environ.get(args.token_env)
    request_delay = args.request_delay_seconds
    if request_delay is None:
        request_delay = 2.2 if token else 6.2
    logger.info(
        "Starting collection with %s API access",
        "authenticated" if token else "public",
    )

    specs = load_search_specs(args.queries)
    manual_entries = load_manual_entries(args.manual_entries)
    previous_catalog = load_json_object(args.catalog) if args.catalog.is_file() else {}
    existing_records = previous_catalog.get("records", [])
    assert isinstance(existing_records, list), "existing catalog records must be a list"
    now = datetime.now(timezone.utc).replace(microsecond=0)
    records = collect_records(
        GitHubClient(token, args.timeout_seconds, logger),
        specs,
        manual_entries,
        existing_records,
        args.max_results_per_query,
        request_delay,
        now.date().isoformat(),
        logger,
    )
    logger.info("Collected %d unique repositories", len(records))
    if args.dry_run:
        logger.info("Dry run complete; no files written")
        return 0
    changed = persist_outputs(
        records,
        specs,
        args.catalog,
        args.readme,
        now.isoformat().replace("+00:00", "Z"),
    )
    logger.info("Outputs %s", "updated" if changed else "unchanged")
    return 0
