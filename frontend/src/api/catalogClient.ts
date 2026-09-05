import { catalog } from "../data/catalog";
import type { CatalogEntry, CatalogIndex } from "../lib/catalog";
export interface CatalogClient {
  listEntries(): Promise<CatalogEntry[]>;
  getEntry(id: string): Promise<CatalogEntry | undefined>;
}
export function createStaticCatalogClient(data: CatalogIndex): CatalogClient {
  return { listEntries: async () => data.entries, getEntry: async (id) => data.entries.find(entry => entry.id === id) };
}
export const catalogClient = createStaticCatalogClient(catalog);
