import { CATALOG_CATEGORIES, type CatalogEntry } from "@/lib/catalog";

export type ConceptId =
  | "registry"
  | "domain-atlas"
  | "ecosystem-showcase"
  | "composition-studio";

export interface ConceptOption {
  id: ConceptId;
  route: `/concepts/${ConceptId}`;
  title: string;
  description: string;
  lens: string;
}

/**
 * The four visual directions intentionally share the same catalog contract.
 * This is a navigation contract, not a claim that all four views are shipped
 * products or that any listing has been evaluated for clinical use.
 */
export const CONCEPT_OPTIONS: readonly ConceptOption[] = [
  {
    id: "registry",
    route: "/concepts/registry",
    title: "Academic Registry",
    description:
      "A structured view for comparing research components and their source context.",
    lens: "Compare metadata",
  },
  {
    id: "domain-atlas",
    route: "/concepts/domain-atlas",
    title: "Domain Atlas",
    description:
      "Explore research areas and the components associated with them.",
    lens: "Find by domain",
  },
  {
    id: "ecosystem-showcase",
    route: "/concepts/ecosystem-showcase",
    title: "Ecosystem Showcase",
    description:
      "A product-style view of domains, capabilities, and traceable component records.",
    lens: "See the ecosystem",
  },
  {
    id: "composition-studio",
    route: "/concepts/composition-studio",
    title: "Composition Studio",
    description:
      "A collection-oriented view for organizing reusable components.",
    lens: "Organize for reuse",
  },
] as const;

export function getConceptById(id: string): ConceptOption | undefined {
  return CONCEPT_OPTIONS.find((concept) => concept.id === id);
}

export interface DomainSignal {
  id: string;
  label: string;
  description: string;
  count: number;
  entryIds: string[];
  accent: "teal" | "amber" | "slate";
}

const DOMAIN_RULES: ReadonlyArray<{
  id: string;
  label: string;
  description: string;
  accent: DomainSignal["accent"];
  test: (entry: CatalogEntry) => boolean;
}> = [
  {
    id: "medical-research",
    label: "Medical research",
    description: "Clinical literature, imaging, biomedical data, and research workflows.",
    accent: "teal",
    test: (entry) =>
      entry.domains.includes("medical") ||
      /medical|pubmed|fhir|bio|clinical|cancer|genomics|imaging|slicer/i.test(
        `${entry.fullName} ${entry.description ?? ""} ${entry.topics.join(" ")}`,
      ),
  },
  {
    id: "agent-infrastructure",
    label: "Agent infrastructure",
    description: "Skills, plugins, and runtime building blocks for agentic systems.",
    accent: "slate",
    test: (entry) => /agent|skill|plugin|harness|assistant|tool/i.test(
      `${entry.fullName} ${entry.description ?? ""} ${entry.topics.join(" ")}`,
    ),
  },
  {
    id: "mcp-integration",
    label: "MCP & integration",
    description: "Protocol servers and interfaces that connect agents to external systems.",
    accent: "amber",
    test: (entry) =>
      entry.primaryCategory === "MCP Server" || /mcp|api|graphql|fhir/i.test(
        `${entry.fullName} ${entry.description ?? ""} ${entry.topics.join(" ")}`,
      ),
  },
  {
    id: "scientific-discovery",
    label: "Scientific discovery",
    description: "Evidence retrieval, analysis, and tools for research-oriented exploration.",
    accent: "teal",
    test: (entry) => /research|science|pubmed|biology|data-analysis|knowledge|literature/i.test(
      `${entry.fullName} ${entry.description ?? ""} ${entry.topics.join(" ")}`,
    ),
  },
  {
    id: "developer-tooling",
    label: "Developer tooling",
    description: "Command-line and local development components for building with AI.",
    accent: "slate",
    test: (entry) => /cli|developer|coding|code|terminal|tooling/i.test(
      `${entry.fullName} ${entry.description ?? ""} ${entry.topics.join(" ")}`,
    ),
  },
];

export function deriveDomainSignals(entries: CatalogEntry[]): DomainSignal[] {
  return DOMAIN_RULES.map((rule) => {
    const matched = entries.filter(rule.test);
    return {
      id: rule.id,
      label: rule.label,
      description: rule.description,
      count: matched.length,
      entryIds: matched.map((entry) => entry.id),
      accent: rule.accent,
    };
  })
    .filter((signal) => signal.count > 0)
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

/** Keep the medical signal visible first on the ecosystem landing surface.
 * The general atlas retains its count-based ordering; this helper is scoped
 * to the product-facing ecosystem view and leaves that existing view intact.
 */
export function getMedicalFirstDomainSignals(entries: CatalogEntry[], limit = 4): DomainSignal[] {
  return deriveDomainSignals(entries)
    .sort((left, right) => Number(right.id === "medical-research") - Number(left.id === "medical-research") || right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, limit);
}

export interface MetadataCoverage {
  present: number;
  total: number;
  percentage: number;
  missing: string[];
}

const COVERAGE_FIELDS: ReadonlyArray<{ key: keyof CatalogEntry; label: string; present: (entry: CatalogEntry) => boolean }> = [
  { key: "description", label: "Description", present: (entry) => Boolean(entry.description?.trim()) },
  { key: "primaryCategory", label: "Category", present: (entry) => Boolean(entry.primaryCategory) },
  { key: "domains", label: "Domain", present: (entry) => entry.domains.length > 0 },
  { key: "topics", label: "Tags", present: (entry) => entry.topics.length > 0 },
  { key: "homepageUrl", label: "Homepage", present: (entry) => Boolean(entry.homepageUrl) },
  { key: "language", label: "Language", present: (entry) => Boolean(entry.language && entry.language !== "Not specified") },
  { key: "license", label: "License", present: (entry) => Boolean(entry.license && entry.license !== "NOASSERTION") },
  { key: "updatedAt", label: "Updated date", present: (entry) => Boolean(entry.updatedAt) },
  { key: "snapshot", label: "Source snapshot", present: (entry) => Boolean(entry.snapshot.mainSha || entry.snapshot.automationSha) },
];

export function getMetadataCoverage(entry: CatalogEntry): MetadataCoverage {
  const missing = COVERAGE_FIELDS.filter((field) => !field.present(entry)).map((field) => field.label);
  const present = COVERAGE_FIELDS.length - missing.length;
  return {
    present,
    total: COVERAGE_FIELDS.length,
    percentage: Math.round((present / COVERAGE_FIELDS.length) * 100),
    missing,
  };
}

export function getCatalogMetadataCoverage(entries: CatalogEntry[]): MetadataCoverage {
  const total = entries.length * COVERAGE_FIELDS.length;
  const present = entries.reduce((sum, entry) => sum + getMetadataCoverage(entry).present, 0);
  const missing = entries.flatMap((entry) => getMetadataCoverage(entry).missing);
  return {
    present,
    total,
    percentage: total === 0 ? 0 : Math.round((present / total) * 100),
    missing,
  };
}

export function getRepresentativeEntries(entries: CatalogEntry[], limit = 3): CatalogEntry[] {
  return [...entries]
    .sort((left, right) => Number(right.domains.includes("medical")) - Number(left.domains.includes("medical")) || right.stars - left.stars)
    .slice(0, limit);
}

export interface EcosystemSummary {
  total: number;
  medical: number;
  general: number;
  stable: number;
  candidate: number;
  tierCount: number;
  categoryCount: number;
  categories: string[];
}

/**
 * Derive the small set of figures used by the ecosystem landing surface.
 * Keeping this calculation here makes it impossible for the visual layer to
 * drift into hand-written counts when the fixture changes.
 */
export function getEcosystemSummary(entries: CatalogEntry[]): EcosystemSummary {
  const categories = [...new Set(entries.map((entry) => entry.primaryCategory))].sort((left, right) => left.localeCompare(right));
  const tiers = new Set(entries.map((entry) => entry.tier));
  return entries.reduce<EcosystemSummary>(
    (summary, entry) => ({
      ...summary,
      total: summary.total + 1,
      medical: summary.medical + Number(entry.domains.includes("medical")),
      general: summary.general + Number(entry.domains.includes("general")),
      stable: summary.stable + Number(entry.tier === "stable"),
      candidate: summary.candidate + Number(entry.tier === "candidate"),
    }),
    { total: 0, medical: 0, general: 0, stable: 0, candidate: 0, tierCount: tiers.size, categoryCount: categories.length, categories },
  );
}

/**
 * Pick one deterministic, medical-first record for each supported component
 * type. Categories without a medical record fall back to their best source
 * record so the market still communicates complete type coverage.
 */
export function getMedicalFeaturedEntries(entries: CatalogEntry[]): CatalogEntry[] {
  const rank = (entry: CatalogEntry) => [
    entry.domains.includes("medical") ? 0 : 1,
    entry.tier === "stable" ? 0 : 1,
    -entry.stars,
    entry.fullName,
  ] as const;
  const compare = (left: CatalogEntry, right: CatalogEntry) => {
    const leftRank = rank(left);
    const rightRank = rank(right);
    for (let index = 0; index < leftRank.length; index += 1) {
      if (leftRank[index] < rightRank[index]) return -1;
      if (leftRank[index] > rightRank[index]) return 1;
    }
    return 0;
  };

  return CATALOG_CATEGORIES.flatMap((category) => {
    const candidate = entries
      .filter((entry) => entry.primaryCategory === category)
      .sort(compare)[0];
    return candidate ? [candidate] : [];
  });
}
