import { SlidersHorizontal } from "lucide-react";
import type { CatalogEntry } from "@/lib/catalog";
import { CATALOG_CATEGORIES } from "@/lib/catalog";
import type { Dictionary } from "@/lib/i18n";

interface FilterPanelProps {
  dictionary: Dictionary;
  entries: CatalogEntry[];
}

function frequentValues(values: string[], limit: number): string[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([value]) => value);
}

function FilterGroup({ title, values }: { title: string; values: readonly string[] }) {
  return (
    <fieldset className="filter-group" disabled>
      <legend>{title}</legend>
      <div className="filter-options">
        {values.map((value) => (
          <label key={value}>
            <input type="checkbox" />
            <span>{value}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function FilterPanel({ dictionary, entries }: FilterPanelProps) {
  const licenses = frequentValues(entries.map((entry) => entry.license), 4);
  const languages = frequentValues(entries.map((entry) => entry.language), 4);
  const tags = frequentValues(entries.flatMap((entry) => entry.topics), 5);

  return (
    <details className="filter-panel" open>
      <summary>
        <SlidersHorizontal size={17} aria-hidden="true" />
        {dictionary.mobileFilters}
      </summary>
      <div className="filter-panel__content">
        <div className="filter-panel__heading">
          <div>
            <span className="section-kicker">{dictionary.labels.evidenceFacets}</span>
            <h2>{dictionary.filtersTitle}</h2>
          </div>
        </div>
        <p className="filter-panel__note">{dictionary.filterPrototype}</p>
        <FilterGroup
          title={dictionary.filterGroups.tier}
          values={[dictionary.labels.stable, dictionary.labels.candidate]}
        />
        <FilterGroup title={dictionary.filterGroups.type} values={CATALOG_CATEGORIES} />
        <FilterGroup
          title={dictionary.filterGroups.domain}
          values={[dictionary.labels.medical, dictionary.labels.general]}
        />
        <FilterGroup title={dictionary.filterGroups.license} values={licenses} />
        <FilterGroup title={dictionary.filterGroups.language} values={languages} />
        <FilterGroup title={dictionary.filterGroups.tag} values={tags} />
      </div>
    </details>
  );
}
