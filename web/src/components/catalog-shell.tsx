import Link from "next/link";
import { Database, FlaskConical, Search, ShieldCheck, Sparkles } from "lucide-react";
import type { CatalogIndex } from "@/lib/catalog";
import { getCatalogSummary } from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import { FilterPanel } from "@/components/filter-panel";
import { CatalogEntryRow } from "@/components/catalog-entry-row";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface CatalogShellProps {
  catalog: CatalogIndex;
  dictionary: Dictionary;
  locale: Locale;
  conceptMode?: boolean;
}

export function CatalogShell({ catalog, dictionary, locale, conceptMode = false }: CatalogShellProps) {
  const summary = getCatalogSummary(catalog.entries);
  const observedDate = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(catalog.generatedAt));

  const metrics = [
    { label: dictionary.summary.total, value: summary.total, icon: Database },
    { label: dictionary.summary.stable, value: summary.stable, icon: ShieldCheck },
    { label: dictionary.summary.candidate, value: summary.candidate, icon: Sparkles },
    { label: dictionary.summary.medical, value: summary.medical, icon: FlaskConical },
  ];

  return (
    <div className="page-shell">
      <SiteHeader
        dictionary={dictionary}
        locale={locale}
        alternateHref={conceptMode
          ? `/${locale === "en" ? "zh" : "en"}/concepts/registry`
          : `/${locale === "en" ? "zh" : "en"}`}
      />

      <main>
        {conceptMode && (
          <div className="concept-mode-strip site-width">
            <span className="section-kicker">01 · {locale === "zh" ? "学术型登记册" : "Academic Registry"}</span>
            <Link href={`/${locale}/concepts`}>{locale === "zh" ? "返回方案选型" : "Back to concept gallery"} ↗</Link>
          </div>
        )}
        <section className="hero site-width" aria-labelledby="catalog-title">
          <div className="hero__grid-lines" aria-hidden="true" />
          <div className="hero__component-loop" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero__copy">
            <div className="eyebrow-row">
              <span className="eyebrow">{dictionary.heroEyebrow}</span>
              <span className="prototype-badge">{dictionary.prototypeLabel}</span>
            </div>
            <h1 id="catalog-title">{dictionary.heroTitle}</h1>
            <p>{dictionary.heroDescription}</p>
            <div className="hero__pillars" aria-label={dictionary.heroPillarsLabel}>
              {dictionary.heroPillars.map((pillar, index) => (
                <span key={pillar}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          <div className="hero__search" role="search" aria-label={dictionary.searchLabel}>
            <Search size={22} aria-hidden="true" />
            <label className="sr-only" htmlFor="prototype-search">
              {dictionary.searchLabel}
            </label>
            <input
              id="prototype-search"
              type="search"
              placeholder={dictionary.searchPlaceholder}
              disabled
            />
            <kbd>/</kbd>
            <p>{dictionary.searchStatus}</p>
          </div>
        </section>

        <section className="data-pulse site-width" aria-labelledby="data-pulse-title">
          <div className="data-pulse__intro">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <span id="data-pulse-title">{dictionary.dataPulse}</span>
              <strong>{observedDate}</strong>
            </div>
          </div>
          <dl className="data-pulse__metrics">
            {metrics.map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <dt>
                  <Icon size={15} aria-hidden="true" />
                  {label}
                </dt>
                <dd>{String(value).padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="catalog-layout site-width">
          <FilterPanel dictionary={dictionary} entries={catalog.entries} />

          <section className="catalog-results" aria-labelledby="results-title">
            <div className="catalog-results__header">
              <div>
                <span className="section-kicker">{dictionary.labels.sourceAwareIndex}</span>
                <h2 id="results-title">{dictionary.resultsTitle}</h2>
                <p>{dictionary.resultsDescription}</p>
              </div>
              <span className="result-count">{dictionary.resultCount}</span>
            </div>
            <div className="entry-list">
              {catalog.entries.map((entry) => (
                <CatalogEntryRow
                  dictionary={dictionary}
                  entry={entry}
                  key={entry.id}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <div className="site-width">
        <SiteFooter dictionary={dictionary} />
      </div>
    </div>
  );
}
