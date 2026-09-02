import Link from "next/link";
import { ArrowLeft, GitCommitHorizontal, ShieldCheck } from "lucide-react";
import type { CatalogIndex } from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface MethodologyViewProps {
  catalog: CatalogIndex;
  dictionary: Dictionary;
  locale: Locale;
}

export function MethodologyView({ catalog, dictionary, locale }: MethodologyViewProps) {
  const alternateLocale = locale === "en" ? "zh" : "en";

  return (
    <div className="page-shell">
      <SiteHeader
        dictionary={dictionary}
        locale={locale}
        alternateHref={`/${alternateLocale}/methodology`}
      />
      <main className="methodology-page site-width">
        <Link className="back-link" href={`/${locale}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          {dictionary.backToDirectory}
        </Link>

        <section className="methodology-hero">
          <div className="methodology-hero__icon" aria-hidden="true">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <span className="eyebrow">{dictionary.methodology.eyebrow}</span>
          <h1>{dictionary.methodology.title}</h1>
          <p>{dictionary.methodology.intro}</p>
        </section>

        <section className="methodology-sections" aria-label={dictionary.navigation.methodology}>
          {dictionary.methodology.sections.map((section) => (
            <article key={section.number}>
              <span>{section.number}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="provenance-panel" aria-labelledby="provenance-title">
          <div>
            <span className="section-kicker">{dictionary.labels.reproducibleFixture}</span>
            <h2 id="provenance-title">{dictionary.methodology.provenanceTitle}</h2>
          </div>
          <dl>
            <div>
              <dt>{dictionary.methodology.mainSnapshot}</dt>
              <dd><GitCommitHorizontal size={15} aria-hidden="true" /><code>{catalog.sourceSnapshots.main}</code></dd>
            </div>
            <div>
              <dt>{dictionary.methodology.automationSnapshot}</dt>
              <dd><GitCommitHorizontal size={15} aria-hidden="true" /><code>{catalog.sourceSnapshots.automation}</code></dd>
            </div>
          </dl>
        </section>
      </main>
      <div className="site-width">
        <SiteFooter dictionary={dictionary} />
      </div>
    </div>
  );
}
