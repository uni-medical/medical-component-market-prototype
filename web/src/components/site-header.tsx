import Link from "next/link";
import { Languages, Orbit } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { alternateLocale } from "@/lib/i18n";

interface SiteHeaderProps {
  dictionary: Dictionary;
  locale: Locale;
  alternateHref: string;
}

export function SiteHeader({ dictionary, locale, alternateHref }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href={`/${locale}`} aria-label={dictionary.brand}>
          <span className="brand__mark" aria-hidden="true">
            <Orbit size={19} strokeWidth={1.8} />
          </span>
          <span className="brand__copy">
            <span className="brand__title">{dictionary.brandShort}</span>
            <span className="brand__subtitle">{dictionary.labels.trustedDirectory}</span>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Primary navigation">
          <Link href={`/${locale}`}>{dictionary.navigation.directory}</Link>
          <Link href={`/${locale}/concepts`}>{dictionary.navigation.concepts}</Link>
          <Link href={`/${locale}/methodology`}>{dictionary.navigation.methodology}</Link>
          <Link className="locale-switch" href={alternateHref} lang={alternateLocale(locale)}>
            <Languages size={15} aria-hidden="true" />
            {dictionary.alternateLocaleName}
          </Link>
        </nav>
      </div>
    </header>
  );
}
