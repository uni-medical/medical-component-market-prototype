# LOCKED: false

from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path


SOURCE_ROOT = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SOURCE_ROOT))

import github_medical_collector as collector
from github_medical_collector.cli import parse_args


# Data:
# - full_name/description/topics: repository identity and classification evidence
# - stars/license: displayed metadata
# Algorithm:
# 1. Build the smallest GitHub API-shaped object needed by tests.
def make_repository(
    full_name: str,
    description: str,
    topics: list[str] | None = None,
    stars: int = 100,
    license_id: str | None = "MIT",
) -> dict:
    return {
        "full_name": full_name,
        "html_url": f"https://github.com/{full_name}",
        "private": False,
        "archived": False,
        "fork": False,
        "stargazers_count": stars,
        "license": {"spdx_id": license_id} if license_id else None,
        "description": description,
        "language": "Python",
        "topics": topics or [],
        "updated_at": "2026-08-20T00:00:00Z",
        "pushed_at": "2026-08-19T00:00:00Z",
        "homepage": "",
        "open_issues_count": 2,
    }


class CollectorTests(unittest.TestCase):
    # Data:
    # - one generic Awesome repository and one medical MCP repository
    # Algorithm:
    # 1. Evaluate both with the same deterministic metadata rule.
    # 2. Reject the generic hit and retain explainable medical/category evidence.
    def test_relevance_rule_rejects_generic_search_noise(self) -> None:
        generic = collector.normalize_repository(
            make_repository("example/awesome", "A list of everything"),
            "Plugin",
            "medical plugin",
            "medical",
            "2026-08-25",
        )
        medical_mcp = collector.normalize_repository(
            make_repository(
                "example/medical-mcp",
                "MCP server for clinical records",
                ["healthcare", "mcp"],
            ),
            "MCP Server",
            "medical MCP server",
            "medical",
            "2026-08-25",
        )
        assert generic is not None and medical_mcp is not None
        self.assertIsNone(collector.relevance_evidence(generic, "Plugin", "medical"))
        evidence = collector.relevance_evidence(
            medical_mcp, "MCP Server", "medical"
        )
        self.assertIsNotNone(evidence)
        assert evidence is not None
        self.assertIn("medical:clinical", evidence)
        self.assertIn("category:mcp", evidence)

    # Data:
    # - DSH-specific repository without a medical keyword in public metadata
    # Algorithm:
    # 1. Apply the Plugin exception requested for DSH discovery.
    # 2. Verify an explicit DSH reason is retained.
    def test_relevance_rule_keeps_dsh_plugin_ecosystem(self) -> None:
        record = collector.normalize_repository(
            make_repository(
                "example/dsh-plugin", "DeepSeek Harness plugin collection", ["dsh-plugin"]
            ),
            "Plugin",
            "dsh medical plugin",
            "general",
            "2026-08-25",
        )
        assert record is not None
        evidence = collector.relevance_evidence(record, "Plugin", "general")
        self.assertIsNotNone(evidence)
        assert evidence is not None
        self.assertTrue(any(reason.startswith("dsh:") for reason in evidence))

    # Data:
    # - general Agent plugin without a medical term
    # Algorithm:
    # 1. Evaluate the same repository under general and medical scopes.
    # 2. Accept only the explicitly general search intent.
    def test_general_scope_accepts_agent_plugin_without_medical_term(self) -> None:
        record = collector.normalize_repository(
            make_repository(
                "example/agent-plugin",
                "Agent plugin for reusable automation",
                ["agent", "plugin"],
                stars=250,
            ),
            "Plugin",
            "agent plugin",
            "general",
            "2026-08-25",
        )
        assert record is not None
        general = collector.relevance_evidence(record, "Plugin", "general")
        medical = collector.relevance_evidence(record, "Plugin", "medical")
        self.assertIsNotNone(general)
        assert general is not None
        self.assertIn("general:agent", general)
        self.assertIsNone(medical)

    # Data:
    # - automatic and curated repositories immediately below the global floor
    # Algorithm:
    # 1. Normalize both paths at 99 stars.
    # 2. Verify neither can bypass the 100-star boundary.
    def test_global_minimum_stars_filters_automatic_and_manual(self) -> None:
        item = make_repository(
            "example/low-star-agent", "Medical agent tool", stars=99
        )
        automatic = collector.normalize_repository(
            item,
            "Tool",
            "medical agent tool",
            "medical",
            "2026-08-25",
        )
        manual = collector.normalize_manual_repository(
            item,
            {"full_name": "example/low-star-agent", "category": "Tool"},
            "2026-08-25",
        )
        self.assertIsNone(automatic)
        self.assertIsNone(manual)

    # Data:
    # - broad medical library plus focused Agent Tool and research-agent records
    # Algorithm:
    # 1. Apply the Tool evidence rule under medical and general scopes.
    # 2. Reject generic infrastructure and retain Agent/calling/research tools.
    def test_tool_relevance_requires_agent_or_calling_focus(self) -> None:
        broad = collector.normalize_repository(
            make_repository(
                "example/medical-library",
                "Medical AI library workflow platform and API",
                stars=500,
            ),
            "Tool",
            "medical AI tool",
            "medical",
            "2026-08-25",
        )
        agent_tool = collector.normalize_repository(
            make_repository(
                "example/medical-agent-tool",
                "Medical agent with tools for clinical workflows",
                stars=500,
            ),
            "Tool",
            "medical agent tool",
            "medical",
            "2026-08-25",
        )
        function_calling = collector.normalize_repository(
            make_repository(
                "example/function-calling",
                "Agent framework for function calling",
                stars=500,
            ),
            "Tool",
            "function calling agent",
            "general",
            "2026-08-25",
        )
        auto_research = collector.normalize_repository(
            make_repository(
                "example/deep-research",
                "Autonomous research agent for deep research",
                stars=500,
            ),
            "Tool",
            "deep research agent",
            "general",
            "2026-08-25",
        )
        distant_co_occurrence = collector.normalize_repository(
            make_repository(
                "example/vaccine-sequence",
                (
                    "Medical research where a biological agent remains stable. "
                    "The sequencing approach is a useful laboratory tool."
                ),
                stars=500,
            ),
            "Tool",
            "medical agent tool",
            "medical",
            "2026-08-25",
        )
        reverse_relation = collector.normalize_repository(
            make_repository(
                "example/medical-tool-agent",
                "Learning to use medical tools with a multimodal agent",
                stars=500,
            ),
            "Tool",
            "medical agent tool",
            "medical",
            "2026-08-25",
        )
        assert all(
            record is not None
            for record in (
                broad,
                agent_tool,
                function_calling,
                auto_research,
                distant_co_occurrence,
                reverse_relation,
            )
        )
        assert broad is not None and distant_co_occurrence is not None
        self.assertIsNone(collector.relevance_evidence(broad, "Tool", "medical"))
        self.assertIsNone(
            collector.relevance_evidence(
                distant_co_occurrence, "Tool", "medical"
            )
        )
        for record, scope in (
            (agent_tool, "medical"),
            (function_calling, "general"),
            (auto_research, "general"),
            (reverse_relation, "medical"),
        ):
            assert record is not None
            self.assertIsNotNone(collector.relevance_evidence(record, "Tool", scope))

    # Data:
    # - one record discovered only through the CLI query but mentioning Agent tools
    # Algorithm:
    # 1. Merge the CLI observation.
    # 2. Verify metadata cannot move it into a category that did not discover it.
    def test_classification_stays_within_discovery_categories(self) -> None:
        item = make_repository(
            "example/agent-cli",
            "CLI for AI agents with tools and function calling",
            stars=500,
        )
        record = collector.normalize_repository(
            item,
            "CLI",
            "agent CLI",
            "general",
            "2026-08-25",
        )
        assert record is not None
        records = collector.merge_candidates([record])
        self.assertEqual(records[0]["category"], "CLI")

    # Data:
    # - repository with no declared license
    # Algorithm:
    # 1. Normalize the repository.
    # 2. Verify explicit missing-license behavior and metadata mapping.
    def test_normalize_missing_license(self) -> None:
        record = collector.normalize_repository(
            make_repository("example/medical-cli", "Medical CLI", license_id=None),
            "CLI",
            "medical CLI",
            "medical",
            "2026-08-25",
        )
        self.assertIsNotNone(record)
        assert record is not None
        self.assertEqual(record["license"], "NOASSERTION")
        self.assertEqual(record["stars"], collector.MIN_STARS)

    # Data:
    # - same repository discovered by Tool and MCP Server queries
    # Algorithm:
    # 1. Normalize both observations.
    # 2. Merge by identity and verify deterministic MCP classification.
    def test_deduplicate_and_classify_mcp(self) -> None:
        item = make_repository(
            "example/medical-mcp", "Medical Model Context Protocol server", ["mcp"]
        )
        candidates = [
            collector.normalize_repository(
                item, "Tool", "medical agent tool", "medical", "2026-08-25"
            ),
            collector.normalize_repository(
                item,
                "MCP Server",
                "medical MCP server",
                "medical",
                "2026-08-25",
            ),
        ]
        records = collector.merge_candidates([record for record in candidates if record])
        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]["category"], "MCP Server")
        self.assertEqual(len(records[0]["matched_queries"]), 2)

    # Data:
    # - automatic Tool candidate plus curated Plugin override
    # Algorithm:
    # 1. Merge both observations.
    # 2. Verify manual category and description take precedence.
    def test_manual_entry_has_precedence(self) -> None:
        item = make_repository("example/dsh-med", "Generic medical agent tool")
        automatic = collector.normalize_repository(
            item, "Tool", "medical agent tool", "medical", "2026-08-25"
        )
        manual = collector.normalize_manual_repository(
            item,
            {
                "full_name": "example/dsh-med",
                "category": "Plugin",
                "description_override": "Verified DSH plugin.",
                "manual_note": "source reviewed",
            },
            "2026-08-25",
        )
        assert automatic is not None and manual is not None
        records = collector.merge_candidates([automatic, manual])
        self.assertEqual(records[0]["category"], "Plugin")
        self.assertEqual(records[0]["description"], "Verified DSH plugin.")

    # Data:
    # - one record per fixed category
    # Algorithm:
    # 1. Render the catalog README.
    # 2. Verify category order and one collapsible section per category.
    def test_readme_category_order_and_metadata(self) -> None:
        records = []
        for index, category in enumerate(collector.CATEGORY_ORDER):
            record = collector.normalize_repository(
                make_repository(
                    f"example/repo-{index}",
                    f"{category} for medicine",
                    stars=collector.MIN_STARS + 10 - index,
                ),
                category,
                f"query-{index}",
                "medical",
                "2026-08-25",
            )
            assert record is not None
            record["category"] = category
            record.pop("matched_categories")
            records.append(record)
        readme = collector.render_readme(
            {"generated_at": "2026-08-25T00:00:00Z", "records": records},
            [
                collector.SearchSpec(
                    "Plugin",
                    "medical plugin in:name,description stars:>=100 archived:false",
                    "medical",
                )
            ],
        )
        positions = [readme.index(f"## {category}") for category in collector.CATEGORY_ORDER]
        self.assertEqual(positions, sorted(positions))
        self.assertEqual(
            readme.count("<summary><strong>Browse 1 repository</strong></summary>"),
            len(collector.CATEGORY_ORDER),
        )
        self.assertEqual(
            readme.count("| Repository | Stars | License | Language | Updated |"),
            len(collector.CATEGORY_ORDER),
        )
        self.assertNotIn(
            "| Repository | Stars | License | Language | Updated | Description | Topics |",
            readme,
        )
        self.assertIn("How each category is searched and filtered", readme)

    # Data:
    # - one normalized repository with every displayed field
    # Algorithm:
    # 1. Render one category in isolation.
    # 2. Verify the compact table precedes complete vertical metadata lines.
    def test_category_uses_summary_table_and_vertical_cards(self) -> None:
        record = collector.normalize_repository(
            make_repository(
                "example/medical-mcp",
                "MCP server for clinical records",
                ["healthcare", "mcp"],
                stars=142,
            ),
            "MCP Server",
            "medical MCP server",
            "medical",
            "2026-08-25",
        )
        assert record is not None
        record["category"] = "MCP Server"
        record.pop("matched_categories")
        rendered = "\n".join(collector.render_category([record], "MCP Server"))
        self.assertEqual(rendered.count("<details>"), 1)
        self.assertEqual(rendered.count("</details>"), 1)
        self.assertIn("Browse 1 repository", rendered)
        compact_header = "| Repository | Stars | License | Language | Updated |"
        compact_row = (
            "| [example/medical-mcp](https://github.com/example/medical-mcp) "
            "| 142 | MIT | Python | 2026-08-20 |"
        )
        self.assertIn(compact_header, rendered)
        self.assertIn(compact_row, rendered)
        self.assertLess(rendered.index(compact_header), rendered.index("#### 1."))
        summary_table = rendered.split("### Repository details", maxsplit=1)[0]
        self.assertNotIn("Description", summary_table)
        self.assertNotIn("Topics", summary_table)
        self.assertIn("#### 1. [example/medical-mcp]", rendered)
        self.assertIn("⭐ 142", rendered)
        self.assertIn("**Description:** MCP server for clinical records", rendered)
        self.assertIn("- **License:** `MIT`", rendered)
        self.assertIn("- **Language:** `Python`", rendered)
        self.assertIn("- **Updated:** `2026-08-20`", rendered)
        self.assertIn("- **Discovery scope:** `medical`", rendered)
        self.assertIn("- **Topics:** `healthcare` · `mcp`", rendered)
        self.assertEqual(rendered.count("| Repository |"), 1)

    # Data:
    # - stable records, query config, and temporary output paths
    # Algorithm:
    # 1. Persist once and confirm files change.
    # 2. Persist identical data again and confirm a no-op.
    def test_persistence_is_idempotent(self) -> None:
        record = collector.normalize_repository(
            make_repository("example/medical-tool", "Medical agent tool"),
            "Tool",
            "medical agent tool",
            "medical",
            "2026-08-25",
        )
        assert record is not None
        records = collector.merge_candidates([record])
        specs = [
            collector.SearchSpec(
                "Tool",
                "medical agent tool in:name,description stars:>=100 archived:false",
                "medical",
            )
        ]
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            catalog_path = root / "catalog.json"
            readme_path = root / "README.md"
            first_changed = collector.persist_outputs(
                records,
                specs,
                catalog_path,
                readme_path,
                "2026-08-25T00:00:00Z",
            )
            second_changed = collector.persist_outputs(
                records,
                specs,
                catalog_path,
                readme_path,
                "2026-08-26T00:00:00Z",
            )
            self.assertTrue(first_changed)
            self.assertFalse(second_changed)
            catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
            self.assertEqual(catalog["generated_at"], "2026-08-25T00:00:00Z")

    # Data:
    # - repository search configuration on disk
    # Algorithm:
    # 1. Load all immutable SearchSpec values.
    # 2. Verify both scopes exist in every category and every query has the floor.
    def test_search_config_covers_medical_and_general_scopes(self) -> None:
        specs = collector.load_search_specs(SOURCE_ROOT.parent / "config/search_queries.json")
        configured_pairs = {(spec.category, spec.scope) for spec in specs}
        expected_pairs = {
            (category, scope)
            for category in collector.CATEGORY_ORDER
            for scope in collector.SEARCH_SCOPES
        }
        self.assertEqual(configured_pairs, expected_pairs)
        self.assertTrue(
            all(f"stars:>={collector.MIN_STARS}" in spec.query for spec in specs)
        )
        self.assertTrue(
            any("deep research" in spec.query for spec in specs if spec.category == "Tool")
        )

    # Data:
    # - package-relative CLI defaults
    # Algorithm:
    # 1. Parse an empty argument list.
    # 2. Verify configuration and generated output use config/ and runs/.
    def test_cli_defaults_follow_modular_layout(self) -> None:
        args = parse_args([])
        self.assertEqual(args.queries.name, "search_queries.json")
        self.assertEqual(args.queries.parent.name, "config")
        self.assertEqual(args.manual_entries.parent.name, "config")
        self.assertEqual(args.catalog.name, "catalog.json")
        self.assertEqual(args.catalog.parent.name, "results")
        self.assertEqual(args.catalog.parent.parent.name, "runs")


if __name__ == "__main__":
    unittest.main()
