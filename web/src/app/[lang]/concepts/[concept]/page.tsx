import type { Metadata } from "next";
import { notFound } from "next/navigation";
import rawCatalog from "@/data/prototype-catalog.json";
import { CatalogShell } from "@/components/catalog-shell";
import { ConceptFrame } from "@/components/concepts/concept-frame";
import { CompositionStudio } from "@/components/concepts/composition-studio";
import { DomainAtlas } from "@/components/concepts/domain-atlas";
import { QualityLab } from "@/components/concepts/quality-lab";
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
    "quality-lab": { title: "Quality Lab", description: "A transparent review workbench for component metadata and proposed QC dimensions." },
    "composition-studio": { title: "Composition Studio", description: "A prototype workspace for composing reusable research components." },
  },
  zh: {
    registry: { title: "学术型登记册", description: "面向医疗 AI 组件的可追溯学术登记视图。" },
    "domain-atlas": { title: "领域图谱", description: "以领域为入口查看医疗 AI 组件覆盖情况。" },
    "quality-lab": { title: "质控实验台", description: "展示组件元数据与拟议质控维度的透明评审工作区。" },
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
  return { title: seo.title, description: seo.description };
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
    case "quality-lab":
      return (
        <ConceptFrame dictionary={dictionary} locale={lang} conceptSlug={concept.id} conceptLabel={lang === "zh" ? "方案 03 · 质控实验台" : "Concept 03 · Quality Lab"}>
          <QualityLab catalog={catalog} locale={lang} />
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
