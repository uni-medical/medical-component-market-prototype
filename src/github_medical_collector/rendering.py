# LOCKED: false

"""Deterministic Markdown rendering for the public catalog."""

from __future__ import annotations

from typing import Any

from .config import SearchSpec
from .constants import CATEGORY_ORDER, MIN_STARS


# Data:
# - text: external repository metadata
# - max_length: maximum table-cell length
# Algorithm:
# 1. Flatten whitespace and escape Markdown delimiters.
# 2. Return an explicit missing value or a deterministic truncation.
def markdown_cell(text: Any, max_length: int = 220) -> str:
    assert max_length > 1, "Markdown cell length must allow an ellipsis"
    normalized = " ".join(str(text or "").split()).replace("|", "\\|")
    if not normalized:
        return "—"
    if len(normalized) <= max_length:
        return normalized
    return normalized[: max_length - 1].rstrip() + "…"


# Data:
# - record: one normalized repository record
# - position: stable one-based position within its category
# Algorithm:
# 1. Format core identity and GitHub facts as short vertical lines.
# 2. Keep long descriptions and topics out of horizontal tables.
def render_repository_card(record: dict[str, Any], position: int) -> list[str]:
    assert position >= 1, "repository position must be one-based"
    assert record.get("full_name") and record.get("url"), (
        "repository identity and URL are required"
    )
    topics = [
        f"`{markdown_cell(topic, 40)}`" for topic in record.get("topics", [])[:8]
    ]
    topics_text = " · ".join(topics) or "—"
    scopes = [
        f"`{markdown_cell(scope, 20)}`" for scope in record.get("matched_scopes", [])
    ]
    scopes_text = " · ".join(scopes) or "—"
    updated = str(record.get("updated_at") or "")[:10] or "—"
    return [
        "#### {position}. [{name}]({url}) · ⭐ {stars:,}".format(
            position=position,
            name=markdown_cell(record["full_name"], 100),
            url=record["url"],
            stars=int(record["stars"]),
        ),
        "",
        f"**Description:** {markdown_cell(record['description'])}",
        "",
        f"- **License:** `{markdown_cell(record['license'], 40)}`",
        f"- **Language:** `{markdown_cell(record['language'], 40)}`",
        f"- **Updated:** `{updated}`",
        f"- **Discovery scope:** {scopes_text}",
        f"- **Topics:** {topics_text}",
    ]


# Data:
# - records: one category's normalized records in stable display order
# Algorithm:
# 1. Render only the five compact facts needed for rapid comparison.
# 2. Deliberately omit description and topics to keep the table narrow.
def render_category_summary_table(records: list[dict[str, Any]]) -> list[str]:
    assert records, "category summary table requires at least one repository"
    lines = [
        "| Repository | Stars | License | Language | Updated |",
        "|---|---:|---|---|---|",
    ]
    for record in records:
        assert record.get("full_name") and record.get("url"), (
            "repository identity and URL are required"
        )
        updated = str(record.get("updated_at") or "")[:10] or "—"
        lines.append(
            "| [{name}]({url}) | {stars:,} | {license} | {language} | {updated} |".format(
                name=markdown_cell(record["full_name"], 100),
                url=record["url"],
                stars=int(record["stars"]),
                license=markdown_cell(record["license"], 40),
                language=markdown_cell(record["language"], 40),
                updated=updated,
            )
        )
    return lines


# Data:
# - records: normalized catalog records
# - category: one fixed README category
# Algorithm:
# 1. Select records in their stable input order.
# 2. Wrap the category in one GitHub-native collapsible section.
# 3. Put a narrow, description-free comparison table before detailed cards.
def render_category(records: list[dict[str, Any]], category: str) -> list[str]:
    assert category in CATEGORY_ORDER, "README category is unsupported"
    selected = [record for record in records if record["category"] == category]
    repository_label = "repository" if len(selected) == 1 else "repositories"
    lines = [
        f"## {category}",
        "",
        "<details>",
        f"<summary><strong>Browse {len(selected)} {repository_label}</strong></summary>",
        "",
    ]
    if not selected:
        lines.extend(["_No repositories collected yet._", "", "</details>", ""])
        return lines
    lines.extend([*render_category_summary_table(selected), "", "### Repository details", ""])
    for position, record in enumerate(selected, start=1):
        if position > 1:
            lines.extend(["---", ""])
        lines.extend([*render_repository_card(record, position), ""])
    lines.extend(["</details>", ""])
    return lines


# Data:
# - catalog: versioned metadata snapshot
# - specs: exact search configuration
# Algorithm:
# 1. Render purpose, navigation, statistics, and five catalog categories.
# 2. Append the executable architecture contract and contribution boundaries.
def render_readme(catalog: dict[str, Any], specs: list[SearchSpec]) -> str:
    records = catalog["records"]
    assert isinstance(records, list), "catalog records must be a list"
    counts = {
        category: sum(record["category"] == category for record in records)
        for category in CATEGORY_ORDER
    }
    lines = [
        "<!-- LOCKED: false -->",
        "",
        "# Awesome DSH Med Plugin Ecosystem",
        "",
        "Purpose: maintain a rule-based, reviewable candidate directory spanning the DeepSeek Harness (DSH) plugin ecosystem, medical AI components, and reusable general Agent infrastructure.",
        "",
        "Entries are grouped as Plugin, Skill, Tool, MCP Server, and CLI. Inclusion is neither a clinical endorsement nor proof of DSH compatibility.",
        "",
        f"Last catalog change: `{catalog['generated_at']}` · Repositories: **{len(records)}** · Minimum stars: **{MIN_STARS}**",
        "Repository lists are collapsed by category. Expand a section for a compact comparison table followed by full vertical repository details.",
        "",
        "## Contents",
        "",
        "- [Catalog summary](#catalog-summary)",
        "- [Plugin](#plugin)",
        "- [Skill](#skill)",
        "- [Tool](#tool)",
        "- [MCP Server](#mcp-server)",
        "- [CLI](#cli)",
        "- [Automation architecture](#automation-architecture)",
        "- [Safety and scope](#safety-and-scope)",
        "- [Contributing](#contributing)",
        "- [License](#license)",
        "",
        "## Catalog summary",
        "",
        "| Category | Repositories |",
        "|---|---:|",
    ]
    lines.extend(f"| {category} | {counts[category]} |" for category in CATEGORY_ORDER)
    lines.append("")
    for category in CATEGORY_ORDER:
        lines.extend(render_category(records, category))

    lines.extend(
        [
            "## Automation architecture",
            "",
            "### Core logic",
            "",
            "- **Problem definition:** repeatedly discover medical AI repositories and reusable general Agent infrastructure, then maintain one deterministic, auditable catalog.",
            "- **Primary users:** medical AI developers, researchers, and catalog maintainers.",
            "- **Success definition:** one local command produces deterministic JSON and README outputs; unchanged semantic inputs produce no diff.",
            "- **Non-goals:** clinical validation, security certification, installation, and LLM-written descriptions.",
            f"- **Key constraints:** Python standard library only, GitHub API metadata only, fixed category order, a global minimum of {MIN_STARS} stars, explicit medical/general scope evidence, and runtime-only credentials.",
            "",
            "```mermaid",
            "flowchart LR",
            "    Q[config/search_queries.json] --> C[config.py]",
            "    M[config/manual_entries.json] --> C",
            "    C --> O[pipeline.py]",
            "    O --> G[github_client.py]",
            "    G --> A[GitHub REST API]",
            "    O --> D[catalog.py]",
            "    D --> P[persistence.py]",
            "    P --> J[runs/results/catalog.json]",
            "    P --> V[rendering.py]",
            "    V --> R[README.md]",
            "```",
            "",
            "```mermaid",
            "classDiagram",
            "    class SearchSpec",
            "    class GitHubClient",
            "    class my_logger",
            "    GitHubClient --> SearchSpec : executes",
            "    GitHubClient --> my_logger : records state",
            "```",
            "",
            "### Module responsibilities",
            "",
            "| Path | Responsibility |",
            "|---|---|",
            "| `src/github_medical_collector/constants.py` | Centralize fixed categories, relevance vocabulary, and API identity |",
            "| `src/github_medical_collector/config.py` | Validate JSON configuration and construct immutable search specifications |",
            "| `src/github_medical_collector/github_client.py` | Own authenticated HTTP access, timeouts, and bounded rate-limit recovery |",
            "| `src/github_medical_collector/catalog.py` | Normalize, filter, classify, merge, and deterministically sort repositories |",
            "| `src/github_medical_collector/rendering.py` | Render catalog data without altering domain rules |",
            "| `src/github_medical_collector/persistence.py` | Compare semantic state and write only changed outputs |",
            "| `src/github_medical_collector/pipeline.py` | Orchestrate configured searches and curated refreshes |",
            "| `src/github_medical_collector/logging_utils.py` | Provide the credential-safe `my_logger` adapter |",
            "| `src/github_medical_collector/cli.py` | Parse the local/CI boundary and compose all modules |",
            "| `runs/results/catalog.json` | Retain the generated machine-readable result |",
            "",
            "Boundary invariants use `assert`. `my_logger` records meaningful network, branch, and persistence transitions without logging credentials. The GitHub token is read only from the selected environment variable.",
            "",
            "Run locally:",
            "",
            "```bash",
            "PYTHONPATH=src python3 -m github_medical_collector",
            "PYTHONPATH=src python3 -m unittest discover -s tests -v",
            "```",
            "",
            "Set `GITHUB_TOKEN` in the environment for authenticated API limits. Never commit a token. The workflow under `.github/workflows/collect-catalog.yml` supports scheduled and manual execution after the workflow exists on the default branch.",
            "",
            "### Extension rules",
            "",
            "- Add or revise discovery policy in `config/search_queries.json` and `constants.py`; do not place policy in the CLI.",
            "- Add a new external source behind its own client and compose it in `pipeline.py`.",
            "- Add presentation fields only in `rendering.py` after the catalog schema contains the underlying fact.",
            "- Add a regression test beside the module whose invariant changes.",
            "",
            "### Search queries and per-category strategy",
            "",
            "<details>",
            f"<summary><strong>Show {len(specs)} configured queries</strong></summary>",
            "",
        ]
    )
    lines.extend(
        f"{index}. **{spec.category} · {spec.scope}:** `{spec.query}`"
        for index, spec in enumerate(specs, start=1)
    )
    lines.extend(
        [
            "",
            "</details>",
            "",
            "<details>",
            "<summary><strong>How each category is searched and filtered</strong></summary>",
            "",
            f"- **Common boundary:** every query searches repository names and descriptions with `stars:>={MIN_STARS}` and reads the first 25 results sorted by stars. Normalization independently rejects repositories below {MIN_STARS} stars, plus private, archived, and fork repositories. Medical scope requires medical and category evidence; general scope requires Agent/automatic-research and category evidence.",
            "- **Plugin:** combine medical-plugin discovery with general DSH and `agent plugin` discovery. General DSH hits retain explicit DeepSeek Harness/DSH/Cordis evidence.",
            "- **Skill:** combine `medical agent skill` with general `agent skill`; both still require Skill evidence such as `agent skill`, `skills`, or `skill.md`.",
            "- **Tool:** collect only medical/general Agent tools, function-calling tools, tool-calling tools, and autonomous/deep-research agents. A generic library, workflow, platform, or API is insufficient without Agent/tool-use evidence.",
            "- **MCP Server:** combine medical MCP discovery with general Agent MCP servers; require `mcp` or `model context protocol` plus the selected scope evidence.",
            "- **CLI:** combine biomedical CLI discovery with general Agent CLI discovery. Token boundaries prevent `cli` inside `clinical` from counting.",
            f"- **Curated seeds:** refresh configured repositories directly, but apply the same {MIN_STARS}-star hard gate before any manual category or description override.",
            "- **Final resolution:** deduplicate by case-insensitive `owner/repository`, union queries, scopes, and evidence, and choose only among categories whose searches actually admitted the repository. Metadata scores and fixed precedence resolve multi-query conflicts.",
            "",
            "</details>",
            "",
            "## Safety and scope",
            "",
            "This catalog records public repository metadata. General-scope inclusion means a component may be reusable in medical systems; it is not itself evidence of medical specialization. Inclusion does not prove medical validity, privacy compliance, security, or DSH compatibility. Review source code, data flow, licenses, and clinical claims before use.",
            "",
            "## Contributing",
            "",
            f"See [CONTRIBUTING.md](CONTRIBUTING.md). Curated seeds may override automated category and description fields only after the global {MIN_STARS}-star gate; generated catalog entries should be changed through data or collector rules rather than hand editing.",
            "",
            "## License",
            "",
            "[CC0 1.0 Universal](LICENSE). Individual repositories retain their own licenses.",
            "",
        ]
    )
    return "\n".join(lines)
