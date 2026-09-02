# LOCKED: false

"""Bounded GitHub REST API access."""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

from .config import SearchSpec
from .constants import GITHUB_API_ROOT, USER_AGENT
from .logging_utils import my_logger


class GitHubClient:
    """Minimal GitHub client with bounded rate-limit retries."""

    # Data:
    # - token: optional credential supplied only at runtime
    # - timeout_seconds/logger: request boundary and diagnostics
    # Algorithm:
    # 1. Store immutable request settings.
    # 2. Never log or persist the credential.
    def __init__(
        self, token: str | None, timeout_seconds: float, logger: my_logger
    ) -> None:
        assert timeout_seconds > 0, "timeout must be positive"
        self._token = token
        self._timeout_seconds = timeout_seconds
        self._logger = logger

    # Data:
    # - url: complete GitHub API URL
    # Algorithm:
    # 1. Send an authenticated GET when a token exists.
    # 2. Retry bounded rate-limit responses using official headers.
    # 3. Decode and return a JSON object.
    def _request_json(self, url: str) -> dict[str, Any]:
        assert url.startswith(GITHUB_API_ROOT), "unexpected API host"
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": USER_AGENT,
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if self._token:
            headers["Authorization"] = f"Bearer {self._token}"

        for attempt in range(3):
            request = urllib.request.Request(url, headers=headers, method="GET")
            try:
                with urllib.request.urlopen(
                    request, timeout=self._timeout_seconds
                ) as response:
                    payload = json.loads(response.read().decode("utf-8"))
                    assert isinstance(payload, dict), "GitHub response must be an object"
                    return payload
            except urllib.error.HTTPError as error:
                if error.code in (403, 429) and attempt < 2:
                    wait_seconds = self._retry_wait_seconds(error.headers)
                    self._logger.warning(
                        "GitHub API limited request; retrying in %.1f seconds",
                        wait_seconds,
                    )
                    time.sleep(wait_seconds)
                    continue
                body = error.read().decode("utf-8", errors="replace")[:500]
                raise RuntimeError(
                    f"GitHub API request failed with HTTP {error.code}: {body}"
                ) from error
            except urllib.error.URLError as error:
                raise RuntimeError(
                    f"GitHub API network failure: {error.reason}"
                ) from error
        raise AssertionError("bounded retry loop must return or raise")

    # Data:
    # - headers: GitHub rate-limit response headers
    # Algorithm:
    # 1. Prefer Retry-After, then X-RateLimit-Reset.
    # 2. Clamp one retry wait to 1..60 seconds.
    def _retry_wait_seconds(self, headers: Any) -> float:
        retry_after = headers.get("Retry-After")
        if retry_after:
            return min(max(float(retry_after), 1.0), 60.0)
        reset_at = headers.get("X-RateLimit-Reset")
        if reset_at:
            return min(max(float(reset_at) - time.time() + 1.0, 1.0), 60.0)
        return 10.0

    # Data:
    # - spec: category-bound GitHub search expression
    # - max_results: bounded result count for one page
    # Algorithm:
    # 1. URL-encode the query and deterministic sort policy.
    # 2. Return repository objects from one GitHub result page.
    def search_repositories(
        self, spec: SearchSpec, max_results: int
    ) -> list[dict[str, Any]]:
        assert 1 <= max_results <= 100, "max_results must be within GitHub limits"
        parameters = urllib.parse.urlencode(
            {
                "q": spec.query,
                "sort": "stars",
                "order": "desc",
                "per_page": max_results,
                "page": 1,
            }
        )
        payload = self._request_json(f"{GITHUB_API_ROOT}/search/repositories?{parameters}")
        items = payload.get("items", [])
        assert isinstance(items, list), "GitHub search items must be a list"
        if payload.get("incomplete_results"):
            self._logger.warning("Search returned incomplete results: %s", spec.query)
        return [item for item in items if isinstance(item, dict)]

    # Data:
    # - full_name: owner/repository identity
    # Algorithm:
    # 1. Validate the two-part repository name.
    # 2. Fetch its current public metadata.
    def get_repository(self, full_name: str) -> dict[str, Any]:
        assert full_name.count("/") == 1, "repository identity must be owner/name"
        encoded_name = urllib.parse.quote(full_name, safe="/")
        return self._request_json(f"{GITHUB_API_ROOT}/repos/{encoded_name}")
