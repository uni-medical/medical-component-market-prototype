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
    title: lang === "zh" ? "浏览方式" : "Browse views",
    description: lang === "zh" ? "从登记册、研究领域、生态关系和组件集合等入口探索医疗 AI 组件。" : "Explore medical AI components through registry, domain, ecosystem, and collection views.",
  };
}

export default async function ConceptsPage({ params }: ConceptsPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <ConceptHub catalog={catalog} dictionary={getDictionary(lang)} locale={lang} />;
}
