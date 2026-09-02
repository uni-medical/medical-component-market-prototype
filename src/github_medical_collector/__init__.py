# LOCKED: false

"""Public interfaces for the modular GitHub medical repository collector."""

from .catalog import (
    choose_category,
    contains_keyword,
    merge_candidates,
    normalize_manual_repository,
    normalize_repository,
    relevance_evidence,
)
from .config import SearchSpec, load_json_object, load_manual_entries, load_search_specs
from .constants import CATEGORY_ORDER, MIN_STARS, SEARCH_SCOPES
from .persistence import persist_outputs
from .rendering import markdown_cell, render_category, render_readme

__all__ = [
    "CATEGORY_ORDER",
    "MIN_STARS",
    "SEARCH_SCOPES",
    "SearchSpec",
    "choose_category",
    "contains_keyword",
    "load_json_object",
    "load_manual_entries",
    "load_search_specs",
    "markdown_cell",
    "merge_candidates",
    "normalize_manual_repository",
    "normalize_repository",
    "persist_outputs",
    "relevance_evidence",
    "render_category",
    "render_readme",
]
