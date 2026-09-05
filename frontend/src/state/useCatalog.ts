import { useEffect, useState } from "react";
import { catalogClient } from "../api/catalogClient";
import type { CatalogEntry } from "../lib/catalog";
export function useCatalog() {
  const [entries, setEntries] = useState<CatalogEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    catalogClient.listEntries().then(data => { if (active) setEntries(data); })
      .catch(() => { if (active) setError("The catalog could not be loaded. Reload to try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { entries, loading, error };
}
