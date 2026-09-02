# LOCKED: false

"""Idempotent catalog and README persistence."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .config import SearchSpec, load_json_object
from .constants import CATALOG_SCHEMA_VERSION, MIN_STARS
from .rendering import render_readme


# Data:
# - path: output file
# - content: deterministic UTF-8 serialization
# Algorithm:
# 1. Compare the current content.
# 2. Write only when bytes would change.
def write_if_changed(path: Path, content: str) -> bool:
    assert content, "output content must be non-empty"
    if path.is_file() and path.read_text(encoding="utf-8") == content:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


# Data:
# - records/specs: normalized catalog and search contract
# - catalog_path/readme_path: retained outputs
# - run_at: timestamp used only when semantic content changes
# Algorithm:
# 1. Compare complete semantic state except generated_at.
# 2. Preserve generated_at for no-op runs.
# 3. Serialize JSON and README deterministically.
def persist_outputs(
    records: list[dict[str, Any]],
    specs: list[SearchSpec],
    catalog_path: Path,
    readme_path: Path,
    run_at: str,
) -> bool:
    assert records, "catalog must contain at least one repository"
    assert specs, "catalog must record at least one search specification"
    assert run_at, "run timestamp must be non-empty"
    previous = load_json_object(catalog_path) if catalog_path.is_file() else {}
    semantic_payload = {
        "schema_version": CATALOG_SCHEMA_VERSION,
        "minimum_stars": MIN_STARS,
        "queries": [
            {"category": spec.category, "scope": spec.scope, "query": spec.query}
            for spec in specs
        ],
        "records": records,
    }
    previous_semantic = {
        "schema_version": previous.get("schema_version"),
        "minimum_stars": previous.get("minimum_stars"),
        "queries": previous.get("queries"),
        "records": previous.get("records"),
    }
    generated_at = (
        previous.get("generated_at")
        if semantic_payload == previous_semantic and previous.get("generated_at")
        else run_at
    )
    catalog = {
        "_locked": False,
        "schema_version": CATALOG_SCHEMA_VERSION,
        "minimum_stars": MIN_STARS,
        "generated_at": generated_at,
        "repository_count": len(records),
        "query_count": len(specs),
        "queries": semantic_payload["queries"],
        "records": records,
    }
    catalog_text = json.dumps(catalog, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    catalog_changed = write_if_changed(catalog_path, catalog_text)
    readme_changed = write_if_changed(readme_path, render_readme(catalog, specs))
    return catalog_changed or readme_changed
