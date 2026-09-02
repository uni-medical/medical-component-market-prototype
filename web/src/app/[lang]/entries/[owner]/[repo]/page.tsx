import type { Metadata } from "next";
import { notFound } from "next/navigation";
import rawCatalog from "@/data/prototype-catalog.json";
import { EntryDetail } from "@/components/entry-detail";
import { findEntry, parseCatalogIndex } from "@/lib/catalog";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";

interface EntryPageProps {
  params: Promise<{ lang: string; owner: string; repo: string }>;
}

const catalog = parseCatalogIndex(rawCatalog);

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    catalog.entries.map((entry) => {
      const [owner, repo] = entry.fullName.split("/");
      return { lang, owner, repo };
    }),
  );
}

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
  const { lang, owner, repo } = await params;
  const entry = findEntry(catalog.entries, owner, repo);
  if (!entry || !isLocale(lang)) return {};

  return {
    title: entry.fullName,
    description: entry.description ?? getDictionary(lang).noDescription,
  };
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { lang, owner, repo } = await params;
  if (!isLocale(lang)) notFound();
  const entry = findEntry(catalog.entries, owner, repo);
  if (!entry) notFound();

  return <EntryDetail dictionary={getDictionary(lang)} entry={entry} locale={lang} />;
}
