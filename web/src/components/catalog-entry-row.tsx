import Link from "next/link";
import { ArrowUpRight, Clock3, GitFork, Star } from "lucide-react";
import {
  entryHref,
  formatStars,
  getEntryInitials,
  type CatalogEntry,
} from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";

interface CatalogEntryRowProps {
  dictionary: Dictionary;
  entry: CatalogEntry;
  locale: Locale;
}

export function CatalogEntryRow({ dictionary, entry, locale }: CatalogEntryRowProps) {
  const repositoryName = entry.fullName.split("/")[1] ?? entry.fullName;

  return (
    <article className="entry-row" data-testid="catalog-entry">
      <div className={`entry-monogram entry-monogram--${entry.tier}`} aria-hidden="true">
        {getEntryInitials(entry.fullName)}
      </div>

      <div className="entry-row__main">
        <div className="entry-row__heading">
          <div>
            <span className="entry-owner">{entry.fullName.split("/")[0]}</span>
            <h3>
              <Link href={entryHref(locale, entry)}>
                {repositoryName}
                <ArrowUpRight size={15} aria-hidden="true" />
                <span className="sr-only"> — {dictionary.openEntry}</span>
              </Link>
            </h3>
          </div>
          <div className="entry-badges">
            <span className={`tier-badge tier-badge--${entry.tier}`}>
              {dictionary.labels[entry.tier]}
            </span>
            {entry.domains.includes("medical") && (
              <span className="domain-badge">{dictionary.labels.medical}</span>
            )}
          </div>
        </div>

        <p className={`entry-description${entry.description ? "" : " entry-description--empty"}`}>
          {entry.description ?? dictionary.noDescription}
        </p>

        <div className="entry-tags" aria-label={dictionary.details.topics}>
          <span className="category-tag">{entry.primaryCategory}</span>
          {entry.topics.slice(0, 3).map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
          {entry.topics.length > 3 && <span>+{entry.topics.length - 3}</span>}
        </div>
      </div>

      <dl className="entry-row__metrics">
        <div>
          <dt>
            <Star size={14} aria-hidden="true" /> Star
          </dt>
          <dd>{formatStars(entry.stars)}</dd>
        </div>
        <div>
          <dt>
            <GitFork size={14} aria-hidden="true" /> {dictionary.source}
          </dt>
          <dd>{entry.source}</dd>
        </div>
        <div>
          <dt>
            <Clock3 size={14} aria-hidden="true" /> {dictionary.observed}
          </dt>
          <dd>{new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US").format(new Date(entry.observedAt))}</dd>
        </div>
      </dl>
    </article>
  );
}
