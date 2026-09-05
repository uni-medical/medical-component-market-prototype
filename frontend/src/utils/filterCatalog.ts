import type { CatalogEntry } from "../lib/catalog";
export function filterCatalog(entries: CatalogEntry[], params: URLSearchParams) {
  const q = (params.get("q") ?? "").trim().toLowerCase();
  return entries.filter(entry =>
    ["type", "domain", "tier", "license"].every(key => {
      const value = params.get(key);
      if (!value) return true;
      if (key === "type") return entry.primaryCategory === value;
      if (key === "domain") return entry.domains.some(domain => domain === value);
      if (key === "tier") return entry.tier === value;
      return entry.license === value;
    }) &&
    [entry.fullName, entry.description ?? "", ...entry.topics, entry.primaryCategory, ...entry.domains].join(" ").toLowerCase().includes(q)
  );
}
