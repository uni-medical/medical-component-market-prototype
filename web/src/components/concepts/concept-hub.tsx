import Link from "next/link";
import { ArrowUpRight, BookOpen, Boxes, Layers3, Sparkles } from "lucide-react";
import type { CatalogIndex } from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import { CONCEPT_OPTIONS } from "@/lib/concepts";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface ConceptHubProps {
  catalog: CatalogIndex;
  dictionary: Dictionary;
  locale: Locale;
}

const localized = {
  en: {
    eyebrow: "Medical AI component market",
    title: "Explore components from the angle that fits your work.",
    intro: "Browse research tools, domain capabilities, ecosystem context, and reusable collections through a set of focused market views.",
    catalog: "Catalog",
    components: "components",
    exploreKicker: "01 · Explore",
    explore: "Choose a way to browse",
    exploreHint: "Start with a register, a research domain, an ecosystem view, or a reusable collection.",
    open: "Open view",
    pathKicker: "02 · A clear path",
    pathTitle: "From discovery to source.",
    pathBody: "Find a direction, inspect the context, and open the record when you are ready to look closer.",
    pathItems: ["Browse a research area", "Compare the record", "Open the source"],
    views: "views",
    footer: "A source-aware directory for medical AI components and research tools.",
  },
  zh: {
    eyebrow: "医疗 AI 组件市场",
    title: "用适合你的方式，探索医疗 AI 组件。",
    intro: "从研究工具、领域能力、生态关系和可复用集合等入口，浏览组件市场中的内容。",
    catalog: "目录",
    components: "条组件",
    exploreKicker: "01 · 浏览市场",
    explore: "选择浏览方式",
    exploreHint: "可以从登记册、研究领域、生态视图或可复用集合开始。",
    open: "进入浏览",
    pathKicker: "02 · 清晰路径",
    pathTitle: "从发现到来源。",
    pathBody: "先找到合适的方向，再查看条目上下文，最后打开来源仓库深入了解。",
    pathItems: ["浏览研究领域", "比较条目内容", "打开来源仓库"],
    views: "个入口",
    footer: "面向医疗 AI 组件与研究工具的来源可追溯目录。",
  },
} as const;

const iconFor = {
  registry: BookOpen,
  "domain-atlas": Layers3,
  "ecosystem-showcase": Sparkles,
  "composition-studio": Boxes,
} as const;

const localizedConcepts = {
  en: {
    registry: { title: "Academic Registry", description: "Compare component type, repository context, license, stars, and update history.", lens: "Compare metadata", note: "Taxonomy and source context" },
    "domain-atlas": { title: "Domain Atlas", description: "Start from a research area and see the components that support it.", lens: "Find by domain", note: "Research areas and coverage" },
    "ecosystem-showcase": { title: "Ecosystem Showcase", description: "See the market as an ecosystem, with domains, capabilities, and traceable records.", lens: "See the ecosystem", note: "Domains and source trails" },
    "composition-studio": { title: "Composition Studio", description: "Organize reusable components into research-oriented collections and packs.", lens: "Organize for reuse", note: "Collections and packs" },
  },
  zh: {
    registry: { title: "学术型登记册", description: "比较组件类型、仓库上下文、许可证、Star 与更新时间。", lens: "比较元数据", note: "分类与来源上下文" },
    "domain-atlas": { title: "领域图谱", description: "从研究领域出发，查看能够支持它的组件。", lens: "按领域发现", note: "研究方向与覆盖" },
    "ecosystem-showcase": { title: "生态展示市场", description: "从生态视角浏览领域、能力和可追溯的组件条目。", lens: "浏览生态", note: "领域与来源链路" },
    "composition-studio": { title: "组合工作台", description: "把可复用组件组织成面向研究的集合与组件包。", lens: "组织复用", note: "集合与组件包" },
  },
} as const;

const pathIcons = [Layers3, Boxes, BookOpen] as const;

export function ConceptHub({ catalog, dictionary, locale }: ConceptHubProps) {
  const copy = localized[locale];
  const concepts = localizedConcepts[locale];

  return (
    <div className="page-shell concept-page">
      <SiteHeader dictionary={dictionary} locale={locale} alternateHref={`/${locale === "en" ? "zh" : "en"}/concepts`} />
      <main>
        <section className="concept-hub-hero site-width" aria-labelledby="concept-hub-title">
          <div className="concept-hub-hero__meta">
            <span className="section-kicker">{copy.eyebrow}</span>
          </div>
          <div className="concept-hub-hero__grid">
            <div>
              <h1 id="concept-hub-title">{copy.title}</h1>
              <p>{copy.intro}</p>
            </div>
            <div className="concept-hub-hero__stamp" aria-label={copy.catalog}>
              <Boxes size={18} aria-hidden="true" />
              <span>{copy.catalog}</span>
              <strong>{catalog.entries.length}<small> {copy.components}</small></strong>
            </div>
          </div>
        </section>

        <section className="concept-hub-content site-width" aria-labelledby="concept-directions-title">
          <div className="concept-hub-section-heading">
            <div>
              <span className="section-kicker">{copy.exploreKicker}</span>
              <h2 id="concept-directions-title">{copy.explore}</h2>
              <p>{copy.exploreHint}</p>
            </div>
            <span className="concept-hub-count">{CONCEPT_OPTIONS.length} {copy.views}</span>
          </div>

          <div className="concept-cards">
            {CONCEPT_OPTIONS.map((concept, index) => {
              const Icon = iconFor[concept.id];
              const item = concepts[concept.id];
              return (
                <article className={`concept-card concept-card--${concept.id}`} key={concept.id}>
                  <div className="concept-card__topline">
                    <span className="concept-card__number">0{index + 1}</span>
                  </div>
                  <div className="concept-card__icon" aria-hidden="true"><Icon size={21} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="concept-card__meta">
                    <span>{item.lens}</span>
                    <span>{item.note}</span>
                  </div>
                  <Link href={`/${locale}${concept.route}`} className="concept-card__link">
                    {copy.open}<ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <section className="concept-hub-path" aria-labelledby="concept-hub-path-title">
            <div className="concept-hub-path__intro">
              <span className="section-kicker">{copy.pathKicker}</span>
              <h2 id="concept-hub-path-title">{copy.pathTitle}</h2>
              <p>{copy.pathBody}</p>
            </div>
            <div className="concept-hub-path__items">
              {copy.pathItems.map((item, index) => {
                const Icon = pathIcons[index];
                return <div className="concept-hub-path__item" key={item}><Icon size={18} aria-hidden="true" /><span><small>0{index + 1}</small>{item}</span></div>;
              })}
            </div>
          </section>
        </section>
      </main>
      <div className="site-width"><SiteFooter dictionary={dictionary} sourceText={copy.footer} /></div>
    </div>
  );
}
