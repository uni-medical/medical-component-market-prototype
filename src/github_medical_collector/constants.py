# LOCKED: false

"""Stable catalog, relevance, and GitHub API constants."""

CATEGORY_ORDER = ("Plugin", "Skill", "Tool", "MCP Server", "CLI")
CATEGORY_PRECEDENCE = ("MCP Server", "Plugin", "Skill", "CLI", "Tool")
MIN_STARS = 100
SEARCH_SCOPES = ("medical", "general")
RECORD_SCOPES = (*SEARCH_SCOPES, "manual")
CATALOG_SCHEMA_VERSION = 2

GENERAL_KEYWORDS = (
    "agent",
    "agents",
    "agentic",
    "deepseek harness",
    "dsh",
    "function calling",
    "function-calling",
    "tool calling",
    "tool-calling",
    "autonomous research",
    "automated research",
    "deep research",
)
TOOL_FOCUS_KEYWORDS = (
    "agent tool",
    "agent tools",
    "agentic tool",
    "agentic tools",
    "function calling",
    "function-calling",
    "tool calling",
    "tool-calling",
    "tool use",
    "tool-use",
    "research agent",
    "research assistant",
    "autonomous research",
    "automated research",
    "deep research",
)
CATEGORY_KEYWORDS = {
    "MCP Server": ("mcp", "model context protocol"),
    "Plugin": ("plugin", "extension", "bundle", "cordis", "deepseek harness", "dsh"),
    "Skill": ("agent skill", "skills", "skill.md", "skill"),
    "CLI": ("command-line", "command line", "terminal", "cli"),
    "Tool": TOOL_FOCUS_KEYWORDS,
}
MEDICAL_KEYWORDS = (
    "medical",
    "medicine",
    "health",
    "healthcare",
    "clinical",
    "biomedical",
    "bioinformatics",
    "genomic",
    "genomics",
    "pathology",
    "radiology",
    "pharmacology",
    "drug discovery",
    "patient",
    "fhir",
    "dicom",
    "ehr",
    "pubmed",
    "ncbi",
    "hipaa",
    "epidemiology",
    "biostatistics",
    "omics",
)
DSH_KEYWORDS = (
    "deepseek harness",
    "deepseek-harness",
    "dsh-plugin",
    "dsh plugin",
    "dsh",
    "cordis",
)
GITHUB_API_ROOT = "https://api.github.com"
USER_AGENT = "awesome-dsh-med-plugin-collector/2.0"
