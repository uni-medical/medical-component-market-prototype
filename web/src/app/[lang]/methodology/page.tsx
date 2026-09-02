import type { Metadata } from "next";
import { notFound } from "next/navigation";
import rawCatalog from "@/data/prototype-catalog.json";
import { MethodologyView } from "@/components/methodology-view";
import { parseCatalogIndex } from "@/lib/catalog";
import { getDictionary, isLocale } from "@/lib/i18n";

interface MethodologyPageProps {
  params: Promise<{ lang: string }>;
}

const catalog = parseCatalogIndex(rawCatalog);

export async function generateMetadata({ params }: MethodologyPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).navigation.methodology };
}

export default async function MethodologyPage({ params }: MethodologyPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <MethodologyView
      catalog={catalog}
      dictionary={getDictionary(lang)}
      locale={lang}
    />
  );
}
