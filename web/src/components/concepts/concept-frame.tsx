import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface ConceptFrameProps {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: Locale;
  conceptLabel: string;
  conceptSlug: string;
  variant?: "default" | "ecosystem";
  footerSource?: string;
}

export function ConceptFrame({ children, dictionary, locale, conceptLabel, conceptSlug, variant = "default", footerSource }: ConceptFrameProps) {
  const alternateLocale = locale === "en" ? "zh" : "en";
  return (
    <div className={`page-shell concept-page${variant === "ecosystem" ? " concept-page--ecosystem" : ""}`}>
      <SiteHeader
        dictionary={dictionary}
        locale={locale}
        alternateHref={`/${alternateLocale}/concepts/${conceptSlug}`}
      />
      <div className="concept-view-strip site-width">
        <span className="section-kicker">{conceptLabel}</span>
        <Link href={`/${locale}/concepts`}>{locale === "zh" ? "返回浏览方式" : "Back to browse views"} ↗</Link>
      </div>
      {children}
      <div className="site-width"><SiteFooter dictionary={dictionary} sourceText={footerSource} /></div>
    </div>
  );
}
