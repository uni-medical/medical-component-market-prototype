import rawCatalog from "@/data/prototype-catalog.json";
import { parseCatalogIndex } from "@/lib/catalog";
import {
  CONCEPT_OPTIONS,
  deriveDomainSignals,
  getCatalogMetadataCoverage,
  getConceptById,
  getMetadataCoverage,
  getRepresentativeEntries,
} from "@/lib/concepts";

describe("frontend concept selection contract", () => {
  it("defines four distinct desktop concepts for the meeting ballot", () => {
    expect(CONCEPT_OPTIONS).toHaveLength(4);

    const ids = CONCEPT_OPTIONS.map((concept) => concept.id);
    expect(new Set(ids).size).toBe(4);
    expect(ids).toEqual(
      expect.arrayContaining([
        "registry",
        "domain-atlas",
        "ecosystem-showcase",
        "composition-studio",
      ]),
    );

    for (const concept of CONCEPT_OPTIONS) {
      expect(concept.title).toEqual(expect.any(String));
      expect(concept.description).toEqual(expect.any(String));
      expect(concept.route).toMatch(/^\/concepts\//);
      expect(concept.title.length).toBeGreaterThan(5);
    }
  });

  it("keeps the concepts meaningfully differentiated", () => {
    const copy = CONCEPT_OPTIONS.map((concept) =>
      `${concept.title} ${concept.description}`.toLowerCase(),
    );

    expect(copy.some((text) => /academic|registry|catalog|目录|索引/.test(text))).toBe(true);
    expect(copy.some((text) => /domain|atlas|ontology|领域|知识/.test(text))).toBe(true);
    expect(copy.some((text) => /composition|studio|bundle|组合|编排/.test(text))).toBe(true);
  });

  it("resolves a known concept and rejects an unknown concept", () => {
    expect(getConceptById("domain-atlas")?.id).toBe("domain-atlas");
    expect(getConceptById("does-not-exist")).toBeUndefined();
  });

  it("derives popular domains from fixture fields rather than fixed counters", () => {
    const catalog = parseCatalogIndex(rawCatalog);
    const signals = deriveDomainSignals(catalog.entries);

    expect(signals.length).toBeGreaterThanOrEqual(3);
    expect(signals[0].count).toBeGreaterThanOrEqual(signals.at(-1)?.count ?? 0);
    expect(signals.every((signal) => signal.count === signal.entryIds.length)).toBe(true);
    expect(signals.some((signal) => signal.id === "medical-research")).toBe(true);
  });

  it("reports metadata presence without turning it into a quality score", () => {
    const catalog = parseCatalogIndex(rawCatalog);
    const complete = getMetadataCoverage(catalog.entries[0]);
    const sparse = getMetadataCoverage({
      ...catalog.entries[0],
      description: null,
      topics: [],
      homepageUrl: null,
      language: "Not specified",
      license: "NOASSERTION",
    });

    expect(complete.total).toBe(9);
    expect(complete.present).toBeGreaterThan(sparse.present);
    expect(sparse.missing).toEqual(expect.arrayContaining(["Description", "Tags", "Homepage", "License"]));
    expect(getCatalogMetadataCoverage([])).toEqual({ present: 0, total: 0, percentage: 0, missing: [] });
    expect(getCatalogMetadataCoverage(catalog.entries).percentage).toBeGreaterThan(0);
  });

  it("selects representative entries deterministically", () => {
    const catalog = parseCatalogIndex(rawCatalog);
    const selected = getRepresentativeEntries(catalog.entries, 3);
    expect(selected).toHaveLength(3);
    expect(selected.every((entry) => catalog.entries.some((candidate) => candidate.id === entry.id))).toBe(true);
    expect(getRepresentativeEntries(catalog.entries, 0)).toEqual([]);
  });
});
