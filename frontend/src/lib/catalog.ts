export const CATALOG_CATEGORIES = [
  "Plugin",
  "Skill",
  "Tool",
  "MCP Server",
  "CLI",
] as const;

export type CatalogTier = "stable" | "candidate";
export type CatalogDomain = "medical" | "general";

export interface CatalogEntry {
  id: string;
  fullName: string;
  description: string | null;
  primaryCategory: string;
  categories: string[];
  tier: CatalogTier;
  domains: CatalogDomain[];
  stars: number;
  source: string;
  topics: string[];
  repositoryUrl: string;
  homepageUrl: string | null;
  language: string;
  license: string;
  updatedAt: string;
  observedAt: string;
  snapshot: {
    mainSha?: string;
    automationSha?: string;
  };
  categoryDrift: {
    stableCategory: string;
    automationCategory: string;
  } | null;
}

export interface CatalogIndex {
  schemaVersion: "1";
  generatedAt: string;
  sourceSnapshots: {
    main: string;
    automation: string;
  };
  entries: CatalogEntry[];
}

export interface CatalogSummary {
  total: number;
  stable: number;
  candidate: number;
  medical: number;
}

const SHA_PATTERN = /^[0-9a-f]{40}$/i;
const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertStringArray(value: unknown, label: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${label} must be a string array`);
  }
}

function assertTimestamp(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} must be an ISO-compatible timestamp`);
  }
}

function assertUrl(value: unknown, label: string, nullable = false): asserts value is string | null {
  if (nullable && value === null) return;
  assertString(value, label);
  const url = new URL(value);
  if (!HTTP_PROTOCOLS.has(url.protocol)) {
    throw new Error(`${label} must use HTTP or HTTPS`);
  }
}

function assertSha(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !SHA_PATTERN.test(value)) {
    throw new Error(`${label} snapshot must be a 40-character Git SHA`);
  }
}

function parseEntry(value: unknown, index: number): CatalogEntry {
  assertRecord(value, `entries[${index}]`);
  const entry = value;
  assertString(entry.id, `entries[${index}].id`);
  assertString(entry.fullName, `entries[${index}].fullName`);
  if (entry.id !== entry.fullName || !entry.fullName.includes("/")) {
    throw new Error(`entries[${index}] identity must be an owner/repository name`);
  }
  if (entry.description !== null) {
    assertString(entry.description, `entries[${index}].description`);
  }
  assertString(entry.primaryCategory, `entries[${index}].primaryCategory`);
  assertStringArray(entry.categories, `entries[${index}].categories`);
  if (entry.categories.length === 0 || !entry.categories.includes(entry.primaryCategory)) {
    throw new Error(`entries[${index}] must include its primary category`);
  }
  if (entry.tier !== "stable" && entry.tier !== "candidate") {
    throw new Error(`entries[${index}].tier must be stable or candidate`);
  }
  assertStringArray(entry.domains, `entries[${index}].domains`);
  if (
    entry.domains.length === 0 ||
    entry.domains.some((domain) => domain !== "medical" && domain !== "general")
  ) {
    throw new Error(`entries[${index}].domains contains an unsupported domain`);
  }
  if (typeof entry.stars !== "number" || entry.stars < 0 || !Number.isInteger(entry.stars)) {
    throw new Error(`entries[${index}].stars must be a non-negative integer`);
  }
  assertString(entry.source, `entries[${index}].source`);
  assertStringArray(entry.topics, `entries[${index}].topics`);
  assertUrl(entry.repositoryUrl, `entries[${index}].repositoryUrl`);
  assertUrl(entry.homepageUrl, `entries[${index}].homepageUrl`, true);
  assertString(entry.language, `entries[${index}].language`);
  assertString(entry.license, `entries[${index}].license`);
  assertTimestamp(entry.updatedAt, `entries[${index}].updatedAt`);
  assertTimestamp(entry.observedAt, `entries[${index}].observedAt`);
  assertRecord(entry.snapshot, `entries[${index}].snapshot`);
  if (entry.snapshot.mainSha !== undefined) {
    assertSha(entry.snapshot.mainSha, `entries[${index}].main`);
  }
  if (entry.snapshot.automationSha !== undefined) {
    assertSha(entry.snapshot.automationSha, `entries[${index}].automation`);
  }
  if (!entry.snapshot.mainSha && !entry.snapshot.automationSha) {
    throw new Error(`entries[${index}] needs at least one source snapshot`);
  }
  if (entry.categoryDrift !== null) {
    assertRecord(entry.categoryDrift, `entries[${index}].categoryDrift`);
    assertString(
      entry.categoryDrift.stableCategory,
      `entries[${index}].categoryDrift.stableCategory`,
    );
    assertString(
      entry.categoryDrift.automationCategory,
      `entries[${index}].categoryDrift.automationCategory`,
    );
  }

  return entry as unknown as CatalogEntry;
}

export function parseCatalogIndex(value: unknown): CatalogIndex {
  assertRecord(value, "catalog");
  if (value.schemaVersion !== "1") {
    throw new Error("catalog schemaVersion must be 1");
  }
  assertTimestamp(value.generatedAt, "catalog.generatedAt");
  assertRecord(value.sourceSnapshots, "catalog.sourceSnapshots");
  assertSha(value.sourceSnapshots.main, "main");
  assertSha(value.sourceSnapshots.automation, "automation");
  if (!Array.isArray(value.entries)) {
    throw new Error("catalog.entries must be an array");
  }
  const entries = value.entries.map(parseEntry);
  const identities = new Set<string>();
  for (const entry of entries) {
    const identity = entry.id.toLowerCase();
    if (identities.has(identity)) {
      throw new Error(`Duplicate catalog identity: ${entry.id}`);
    }
    identities.add(identity);
  }

  return {
    schemaVersion: "1",
    generatedAt: value.generatedAt,
    sourceSnapshots: {
      main: value.sourceSnapshots.main as string,
      automation: value.sourceSnapshots.automation as string,
    },
    entries,
  };
}

export function getCatalogSummary(entries: CatalogEntry[]): CatalogSummary {
  return entries.reduce<CatalogSummary>(
    (summary, entry) => ({
      total: summary.total + 1,
      stable: summary.stable + Number(entry.tier === "stable"),
      candidate: summary.candidate + Number(entry.tier === "candidate"),
      medical: summary.medical + Number(entry.domains.includes("medical")),
    }),
    { total: 0, stable: 0, candidate: 0, medical: 0 },
  );
}

export function findEntry(
  entries: CatalogEntry[],
  owner: string,
  repository: string,
): CatalogEntry | undefined {
  const identity = `${owner}/${repository}`.toLowerCase();
  return entries.find((entry) => entry.fullName.toLowerCase() === identity);
}

export function getEntryInitials(fullName: string): string {
  const [owner = "?", repository = "?"] = fullName.split("/");
  const initial = (value: string) => value.match(/[a-z0-9]/i)?.[0]?.toUpperCase() ?? "?";
  return `${initial(owner)}${initial(repository)}`;
}

export function formatStars(stars: number): string {
  if (stars >= 1_000_000) return `${(stars / 1_000_000).toFixed(1)}M`;
  if (stars >= 1_000) return `${(stars / 1_000).toFixed(stars >= 10_000 ? 0 : 1)}k`;
  return stars.toLocaleString("en-US");
}

export function entryHref(locale: string, entry: CatalogEntry): string {
  const [owner, repository] = entry.fullName.split("/");
  return `/${locale}/entries/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
}
