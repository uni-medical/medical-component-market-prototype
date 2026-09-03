import type { Metadata } from "next";
import { notFound } from "next/navigation";
import rawCatalog from "@/data/prototype-catalog.json";
import { CatalogShell } from "@/components/catalog-shell";
import { ConceptFrame } from "@/components/concepts/concept-frame";
import { CompositionStudio } from "@/components/concepts/composition-studio";
import { DomainAtlas } from "@/components/concepts/domain-atlas";
import { EcosystemShowcase } from "@/components/concepts/ecosystem-showcase";
import { parseCatalogIndex } from "@/lib/catalog";
import { CONCEPT_OPTIONS, getConceptById, type ConceptId } from "@/lib/concepts";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";

interface ConceptPageProps {
  params: Promise<{ lang: string; concept: string }>;
}

const catalog = parseCatalogIndex(rawCatalog);

const CONCEPT_SEO_COPY = {
  en: {
    registry: { title: "Academic Registry", description: "A source-aware academic registry for medical AI components." },
    "domain-atlas": { title: "Domain Atlas", description: "A domain-first view of medical AI component coverage." },
    "ecosystem-showcase": { title: "Ecosystem Showcase", description: "A product-led marketplace view of medical AI components and their source context." },
    "composition-studio": { title: "Composition Studio", description: "A prototype workspace for composing reusable research components." },
  },
  zh: {
    registry: { title: "学术型登记册", description: "面向医疗 AI 组件的可追溯学术登记视图。" },
    "domain-atlas": { title: "领域图谱", description: "以领域为入口查看医疗 AI 组件覆盖情况。" },
    "ecosystem-showcase": { title: "生态展示市场", description: "以产品化生态视角呈现医疗 AI 组件及其来源上下文。" },
    "composition-studio": { title: "组合工作台", description: "用于组合可复用研究组件的桌面端原型。" },
  },
} as const;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => CONCEPT_OPTIONS.map((concept) => ({ lang, concept: concept.id })));
}

export async function generateMetadata({ params }: ConceptPageProps): Promise<Metadata> {
  const { lang, concept: conceptSlug } = await params;
  if (!isLocale(lang)) return {};
  const concept = getConceptById(conceptSlug);
  if (!concept) return {};
  const seo = CONCEPT_SEO_COPY[lang][concept.id];
  return concept.id === "ecosystem-showcase"
    ? { title: seo.title, description: seo.description, other: { "theme-color": "#0a0a0a" } }
    : { title: seo.title, description: seo.description };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { lang, concept: conceptSlug } = await params;
  if (!isLocale(lang)) notFound();
  const concept = getConceptById(conceptSlug);
  if (!concept) notFound();
  const dictionary = getDictionary(lang);

  switch (concept.id as ConceptId) {
    case "registry":
      return <CatalogShell catalog={catalog} dictionary={dictionary} locale={lang} conceptMode />;
    case "domain-atlas":
      return (
        <ConceptFrame dictionary={dictionary} locale={lang} conceptSlug={concept.id} conceptLabel={lang === "zh" ? "方案 02 · 领域图谱" : "Concept 02 · Domain Atlas"}>
          <DomainAtlas catalog={catalog} locale={lang} />
        </ConceptFrame>
      );
    case "ecosystem-showcase":
      return (
        <ConceptFrame variant="ecosystem" footerSource={lang === "zh" ? "面向医疗 AI 组件与研究工具的来源可追溯目录。" : "A source-aware directory for medical AI components and research tools."} dictionary={dictionary} locale={lang} conceptSlug={concept.id} conceptLabel={lang === "zh" ? "生态展示市场" : "Ecosystem Showcase"}>
          <EcosystemShowcase catalog={catalog} locale={lang} />
        </ConceptFrame>
      );
    case "composition-studio":
      return (
        <ConceptFrame dictionary={dictionary} locale={lang} conceptSlug={concept.id} conceptLabel={lang === "zh" ? "方案 04 · 组合工作台" : "Concept 04 · Composition Studio"}>
          <CompositionStudio catalog={catalog} locale={lang} />
        </ConceptFrame>
      );
    default:
      notFound();
  }
}
