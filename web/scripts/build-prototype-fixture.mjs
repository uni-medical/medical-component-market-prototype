import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const outputPath = resolve(
  scriptDirectory,
  process.argv[2] ?? "../src/data/prototype-catalog.json",
);
const MAIN_REF = "origin/main";
const AUTOMATION_REF = "origin/automation/github-medical-collector";
const CATEGORIES = ["Plugin", "Skill", "Tool", "MCP Server", "CLI"];

function git(...args) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function readCatalog(ref) {
  return JSON.parse(git("show", `${ref}:runs/results/catalog.json`));
}

function domainsFor(record) {
  const scopes = Array.isArray(record.matched_scopes) ? record.matched_scopes : [];
  const domains = [];
  if (scopes.includes("medical")) domains.push("medical");
  if (scopes.includes("general")) domains.push("general");
  return domains.length > 0 ? domains : ["general"];
}

function candidates(records, category, domain, used) {
  return records
    .filter(
      (record) =>
        record.category === category &&
        domainsFor(record).includes(domain) &&
        !used.has(record.full_name),
    )
    .sort((left, right) => right.stars - left.stars);
}

function pick(records, category, preferredDomain, used) {
  const preferred = candidates(records, category, preferredDomain, used)[0];
  const fallback = records
    .filter((record) => record.category === category && !used.has(record.full_name))
    .sort((left, right) => right.stars - left.stars)[0];
  const selected = preferred ?? fallback;
  if (!selected) {
    throw new Error(`Unable to select a fixture entry for ${category}`);
  }
  used.add(selected.full_name);
  return selected;
}

function safeString(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeStable(record, latest, mainSha, automationSha, generatedAt) {
  const categoryDrift =
    latest && latest.category !== record.category
      ? {
          stableCategory: record.category,
          automationCategory: latest.category,
        }
      : null;

  return {
    id: record.full_name,
    fullName: record.full_name,
    description: typeof record.description === "string" ? record.description : null,
    primaryCategory: record.category,
    categories: [record.category],
    tier: "stable",
    domains: domainsFor(record),
    stars: latest?.stars ?? record.stars,
    source: safeString(record.source, "github-search"),
    topics: Array.isArray(record.topics) ? record.topics : [],
    repositoryUrl: record.url,
    homepageUrl: typeof record.homepage === "string" && record.homepage ? record.homepage : null,
    language: safeString(record.language, "Not specified"),
    license: safeString(record.license, "NOASSERTION"),
    updatedAt: latest?.updated_at ?? record.updated_at,
    observedAt: latest ? generatedAt.automation : generatedAt.main,
    snapshot: {
      mainSha,
      ...(latest ? { automationSha } : {}),
    },
    categoryDrift,
  };
}

function normalizeCandidate(record, automationSha, generatedAt) {
  const categories = Array.isArray(record.categories)
    ? record.categories.filter((category) => CATEGORIES.includes(category))
    : [];

  return {
    id: record.full_name,
    fullName: record.full_name,
    description: typeof record.description === "string" ? record.description : null,
    primaryCategory: record.category,
    categories: categories.length > 0 ? categories : [record.category],
    tier: "candidate",
    domains: domainsFor(record),
    stars: record.stars,
    source: safeString(record.source, "github-search"),
    topics: Array.isArray(record.topics) ? record.topics : [],
    repositoryUrl: record.url,
    homepageUrl: typeof record.homepage === "string" && record.homepage ? record.homepage : null,
    language: safeString(record.language, "Not specified"),
    license: safeString(record.license, "NOASSERTION"),
    updatedAt: record.updated_at,
    observedAt: generatedAt.automation,
    snapshot: { automationSha },
    categoryDrift: null,
  };
}

const mainCatalog = readCatalog(MAIN_REF);
const automationCatalog = readCatalog(AUTOMATION_REF);
const mainSha = git("rev-parse", MAIN_REF);
const automationSha = git("rev-parse", AUTOMATION_REF);
const mainByName = new Map(
  mainCatalog.records.map((record) => [record.full_name, record]),
);
const automationByName = new Map(
  automationCatalog.records.map((record) => [record.full_name, record]),
);
const automationOnly = automationCatalog.records.filter(
  (record) => !mainByName.has(record.full_name),
);
const used = new Set();
const selections = [];

for (const category of CATEGORIES) {
  selections.push({ tier: "stable", record: pick(mainCatalog.records, category, "medical", used) });
  selections.push({ tier: "candidate", record: pick(automationOnly, category, "medical", used) });
}
for (const category of CATEGORIES) {
  selections.push({ tier: "stable", record: pick(mainCatalog.records, category, "general", used) });
  selections.push({ tier: "candidate", record: pick(automationOnly, category, "general", used) });
}

const generatedAt = {
  main: mainCatalog.generated_at,
  automation: automationCatalog.generated_at,
};
const entries = selections.map(({ record, tier }) =>
  tier === "stable"
    ? normalizeStable(
        record,
        automationByName.get(record.full_name),
        mainSha,
        automationSha,
        generatedAt,
      )
    : normalizeCandidate(record, automationSha, generatedAt),
);

const output = {
  schemaVersion: "1",
  generatedAt: generatedAt.automation,
  sourceSnapshots: {
    main: mainSha,
    automation: automationSha,
  },
  entries,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Wrote ${entries.length} public-safe entries to ${outputPath}`);
