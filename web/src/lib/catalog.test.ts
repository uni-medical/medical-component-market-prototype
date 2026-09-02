import rawCatalog from "@/data/prototype-catalog.json";
import {
  entryHref,
  findEntry,
  formatStars,
  getCatalogSummary,
  getEntryInitials,
  parseCatalogIndex,
} from "@/lib/catalog";

describe("prototype catalog contract", () => {
  const catalog = parseCatalogIndex(rawCatalog);

  it("contains exactly twenty unique, public-safe entries", () => {
    expect(catalog.entries).toHaveLength(20);
    expect(new Set(catalog.entries.map((entry) => entry.id)).size).toBe(20);

    for (const entry of catalog.entries) {
      expect(Object.keys(entry).sort()).toEqual(
        [
          "categories",
          "categoryDrift",
          "description",
          "domains",
          "fullName",
          "homepageUrl",
          "id",
          "language",
          "license",
          "observedAt",
          "primaryCategory",
          "repositoryUrl",
          "snapshot",
          "source",
          "stars",
          "tier",
          "topics",
          "updatedAt",
        ].sort(),
      );
    }
  });

  it("covers every catalog type, both tiers, and both domains", () => {
    const categories = new Set(catalog.entries.flatMap((entry) => entry.categories));
    expect(categories).toEqual(
      new Set(["Plugin", "Skill", "Tool", "MCP Server", "CLI"]),
    );
    expect(new Set(catalog.entries.map((entry) => entry.tier))).toEqual(
      new Set(["stable", "candidate"]),
    );
    expect(new Set(catalog.entries.flatMap((entry) => entry.domains))).toEqual(
      new Set(["medical", "general"]),
    );
  });

  it("derives summary counts instead of accepting hard-coded totals", () => {
    const summary = getCatalogSummary(catalog.entries);

    expect(summary.total).toBe(20);
    expect(summary.stable + summary.candidate).toBe(20);
    expect(summary.medical).toBeGreaterThan(0);
  });

  it("finds owner/repository routes and generates stable initials", () => {
    const first = catalog.entries[0];
    const [owner, repo] = first.fullName.split("/");

    expect(findEntry(catalog.entries, owner, repo)).toEqual(first);
    expect(getEntryInitials(first.fullName)).toMatch(/^[A-Z0-9]{2}$/);
    expect(findEntry(catalog.entries, "missing", "entry")).toBeUndefined();
    expect(entryHref("en", first)).toContain(`/en/entries/${owner}/`);
  });

  it("formats compact star counts across display thresholds", () => {
    expect(formatStars(1_250_000)).toBe("1.3M");
    expect(formatStars(12_500)).toBe("13k");
    expect(formatStars(1_250)).toBe("1.3k");
    expect(formatStars(999)).toBe("999");
  });

  it("rejects duplicated identities and invalid snapshot hashes", () => {
    const duplicate = {
      ...rawCatalog,
      entries: [...rawCatalog.entries, rawCatalog.entries[0]],
    };
    const invalidSha = {
      ...rawCatalog,
      sourceSnapshots: { ...rawCatalog.sourceSnapshots, main: "not-a-sha" },
    };

    expect(() => parseCatalogIndex(duplicate)).toThrow(/duplicate/i);
    expect(() => parseCatalogIndex(invalidSha)).toThrow(/snapshot/i);
  });

  it("rejects malformed public fields instead of coercing them", () => {
    const withEntry = (overrides: Record<string, unknown>) => {
      const copy = structuredClone(rawCatalog) as unknown as {
        entries: Array<Record<string, unknown>>;
      };
      copy.entries[0] = { ...copy.entries[0], ...overrides };
      return copy;
    };

    expect(() => parseCatalogIndex(null)).toThrow(/object/i);
    expect(() => parseCatalogIndex({ ...rawCatalog, schemaVersion: "2" })).toThrow(
      /schemaVersion/i,
    );
    expect(() => parseCatalogIndex({ ...rawCatalog, entries: {} })).toThrow(/array/i);
    expect(() => parseCatalogIndex(withEntry({ id: "different/repository" }))).toThrow(
      /identity/i,
    );
    expect(() => parseCatalogIndex(withEntry({ categories: [] }))).toThrow(/category/i);
    expect(() => parseCatalogIndex(withEntry({ tier: "verified" }))).toThrow(/tier/i);
    expect(() => parseCatalogIndex(withEntry({ domains: ["unknown"] }))).toThrow(/domain/i);
    expect(() => parseCatalogIndex(withEntry({ stars: -1 }))).toThrow(/stars/i);
    expect(() => parseCatalogIndex(withEntry({ repositoryUrl: "javascript:alert(1)" }))).toThrow(
      /HTTP/i,
    );
    expect(() => parseCatalogIndex(withEntry({ updatedAt: "yesterday" }))).toThrow(
      /timestamp/i,
    );
    expect(() => parseCatalogIndex(withEntry({ snapshot: {} }))).toThrow(/snapshot/i);
    expect(() => parseCatalogIndex(withEntry({ categoryDrift: {} }))).toThrow(/non-empty/i);
  });
});
