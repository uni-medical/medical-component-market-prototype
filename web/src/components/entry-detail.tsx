import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  GitBranch,
  GitFork,
  Globe2,
  ShieldAlert,
  Star,
} from "lucide-react";
import { formatStars, getEntryInitials, type CatalogEntry } from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface EntryDetailProps {
  dictionary: Dictionary;
  entry: CatalogEntry;
  locale: Locale;
}

function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="detail-item">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function EntryDetail({ dictionary, entry, locale }: EntryDetailProps) {
  const [owner, repository] = entry.fullName.split("/");
  const alternateLocale = locale === "en" ? "zh" : "en";
  const alternateHref = `/${alternateLocale}/entries/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
  const snapshot = entry.snapshot.mainSha ?? entry.snapshot.automationSha ?? "";

  return (
    <div className="page-shell">
      <SiteHeader dictionary={dictionary} locale={locale} alternateHref={alternateHref} />
      <main className="detail-page site-width">
        <Link className="back-link" href={`/${locale}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          {dictionary.backToDirectory}
        </Link>

        <section className="detail-hero">
          <div className={`entry-monogram entry-monogram--${entry.tier} detail-hero__monogram`} aria-hidden="true">
            {getEntryInitials(entry.fullName)}
          </div>
          <div className="detail-hero__copy">
            <div className="entry-badges">
              <span className={`tier-badge tier-badge--${entry.tier}`}>
                {dictionary.labels[entry.tier]}
              </span>
              {entry.domains.map((domain) => (
                <span className="domain-badge" key={domain}>{dictionary.labels[domain]}</span>
              ))}
            </div>
            <span className="entry-owner">{owner}</span>
            <h1>{entry.fullName}</h1>
            <p>{entry.description ?? dictionary.noDescription}</p>
            <div className="detail-actions">
              <a className="primary-action" href={entry.repositoryUrl} target="_blank" rel="noreferrer">
                {dictionary.openRepository}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              {entry.homepageUrl && (
                <a className="secondary-action" href={entry.homepageUrl} target="_blank" rel="noreferrer">
                  <Globe2 size={16} aria-hidden="true" />
                  {dictionary.openHomepage}
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="detail-grid">
          <section className="detail-card" aria-labelledby="entry-metadata">
            <span className="section-kicker">{dictionary.labels.repositoryObservation}</span>
            <h2 id="entry-metadata">{dictionary.labels.metadata}</h2>
            <dl className="detail-list">
              <DetailItem label={dictionary.details.tier}>{dictionary.labels[entry.tier]}</DetailItem>
              <DetailItem label={dictionary.details.categories}>{entry.categories.join(" · ")}</DetailItem>
              <DetailItem label={dictionary.details.domains}>
                {entry.domains.map((domain) => dictionary.labels[domain]).join(" · ")}
              </DetailItem>
              <DetailItem label={dictionary.details.stars}>
                <Star size={14} aria-hidden="true" /> {formatStars(entry.stars)}
              </DetailItem>
              <DetailItem label={dictionary.details.license}>{entry.license}</DetailItem>
              <DetailItem label={dictionary.details.language}>{entry.language}</DetailItem>
              <DetailItem label={dictionary.details.source}>
                <GitFork size={14} aria-hidden="true" /> {entry.source}
              </DetailItem>
              <DetailItem label={dictionary.updated}>
                <Clock3 size={14} aria-hidden="true" /> {new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { dateStyle: "medium" }).format(new Date(entry.updatedAt))}
              </DetailItem>
              <DetailItem label={dictionary.details.snapshot}>
                <GitBranch size={14} aria-hidden="true" /> <code>{snapshot.slice(0, 10)}</code>
              </DetailItem>
            </dl>
          </section>

          <section className="boundary-card" aria-labelledby="boundary-title">
            <div className="boundary-card__icon" aria-hidden="true">
              <ShieldAlert size={22} />
            </div>
            <span className="section-kicker">{dictionary.labels.readBeforeAdoption}</span>
            <h2 id="boundary-title">{dictionary.dataBoundaries}</h2>
            <p>{entry.tier === "stable" ? dictionary.stableDefinition : dictionary.candidateDefinition}</p>
            <p>{dictionary.disclosure}</p>
            {entry.categoryDrift && (
              <div className="drift-alert">
                <strong>{dictionary.details.drift}</strong>
                <span>
                  {entry.categoryDrift.stableCategory} → {entry.categoryDrift.automationCategory}
                </span>
                <p>{dictionary.driftDefinition}</p>
              </div>
            )}
          </section>
        </div>

        <section className="topic-section" aria-labelledby="topics-title">
          <span className="section-kicker">{dictionary.labels.sourceVocabulary}</span>
          <h2 id="topics-title">{dictionary.details.topics}</h2>
          {entry.topics.length > 0 ? (
            <div className="topic-cloud">
              {entry.topics.map((topic) => <span key={topic}>{topic}</span>)}
            </div>
          ) : (
            <p className="empty-state">{dictionary.labels.noSourceTopics}</p>
          )}
        </section>
      </main>
      <div className="site-width">
        <SiteFooter dictionary={dictionary} />
      </div>
    </div>
  );
}
