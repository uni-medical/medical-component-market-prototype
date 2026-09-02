# LOCKED: false

"""Purposeful logging without credential disclosure."""

from __future__ import annotations

import logging
from typing import Any


class my_logger:
    """Small adapter around the standard-library logger."""

    # Data:
    # - name: stable logger namespace
    # - verbose: whether debug messages are emitted
    # Algorithm:
    # 1. Reuse one stream handler per namespace.
    # 2. Apply a concise timestamped format.
    def __init__(self, name: str, verbose: bool = False) -> None:
        assert name.strip(), "logger name must be non-empty"
        self._logger = logging.getLogger(name)
        self._logger.setLevel(logging.DEBUG if verbose else logging.INFO)
        self._logger.propagate = False
        if not self._logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(
                logging.Formatter("%(asctime)s | %(levelname)s | %(message)s")
            )
            self._logger.addHandler(handler)

    # Data:
    # - message/args: one diagnostic event and interpolation values
    # Algorithm:
    # 1. Forward the event to the wrapped logger.
    def debug(self, message: str, *args: Any) -> None:
        self._logger.debug(message, *args)

    # Data:
    # - message/args: one state transition and interpolation values
    # Algorithm:
    # 1. Forward the event to the wrapped logger.
    def info(self, message: str, *args: Any) -> None:
        self._logger.info(message, *args)

    # Data:
    # - message/args: one recoverable anomaly and interpolation values
    # Algorithm:
    # 1. Forward the event to the wrapped logger.
    def warning(self, message: str, *args: Any) -> None:
        self._logger.warning(message, *args)

    # Data:
    # - message/args: one terminal failure and interpolation values
    # Algorithm:
    # 1. Forward the event to the wrapped logger.
    def error(self, message: str, *args: Any) -> None:
        self._logger.error(message, *args)
