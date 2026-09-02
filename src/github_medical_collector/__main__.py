# LOCKED: false

"""Executable module boundary for ``python -m github_medical_collector``."""

from __future__ import annotations

import sys

from .cli import main


# Data:
# - process arguments and configured runtime environment
# Algorithm:
# 1. Run the CLI composition root.
# 2. Convert expected boundary failures into a concise non-zero exit.
def run() -> int:
    try:
        return main()
    except (AssertionError, RuntimeError, ValueError, KeyError) as error:
        print(f"collector failed: {error}", file=sys.stderr)
        return 1


raise SystemExit(run())
