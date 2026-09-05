import raw from "../../../data/prototype-catalog.json";
import { parseCatalogIndex } from "../lib/catalog";
export const catalog = parseCatalogIndex(raw);
