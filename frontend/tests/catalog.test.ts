import { describe, expect, it } from "vitest";
import { catalog } from "../src/data/catalog";
import { filterCatalog } from "../src/utils/filterCatalog";
import { createStaticCatalogClient } from "../src/api/catalogClient";
describe("catalog", () => {
  it("loads exactly the public records and resolves ids with slashes", async () => {
    const client = createStaticCatalogClient(catalog);
    expect(await client.listEntries()).toHaveLength(20);
    expect(await client.getEntry("bowang-lab/MedSAMSlicer")).toBeDefined();
    expect(await client.getEntry("missing/repo")).toBeUndefined();
  });
  it("combines filters and searches fields without case sensitivity", () => {
    const result = filterCatalog(catalog.entries, new URLSearchParams("type=Plugin&domain=medical&tier=stable&license=NOASSERTION&q=MEDSAM"));
    expect(result.map(e=>e.id)).toEqual(["bowang-lab/MedSAMSlicer"]);
    expect(filterCatalog(catalog.entries,new URLSearchParams("q=nonexistent-xyz"))).toEqual([]);
  });
  it("searches tags and handles absent descriptions", () => {
    const e = {...catalog.entries[0], description:null, topics:["special-tag"]};
    expect(filterCatalog([e],new URLSearchParams("q=special-tag"))).toHaveLength(1);
    expect(filterCatalog([e],new URLSearchParams("q=Plugin"))).toHaveLength(1);
  });
});
