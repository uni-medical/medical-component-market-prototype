import type { Metadata } from "next";
import { notFound } from "next/navigation";
import rawCatalog from "@/data/prototype-catalog.json";
import { ConceptHub } from "@/components/concepts/concept-hub";
import { parseCatalogIndex } from "@/lib/catalog";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";

interface ConceptsPageProps {
  params: Promise<{ lang: string }>;
}

const catalog = parseCatalogIndex(rawCatalog);

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: ConceptsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: lang === "zh" ? "方案选型" : "Concept gallery",
    description: lang === "zh" ? "四种共用数据底座的桌面端前端原型。" : "Four desktop-first frontend directions on one shared catalog substrate.",
  };
}

export default async function ConceptsPage({ params }: ConceptsPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <ConceptHub catalog={catalog} dictionary={getDictionary(lang)} locale={lang} />;
}
