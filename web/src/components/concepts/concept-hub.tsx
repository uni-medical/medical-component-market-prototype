import Link from "next/link";
import { ArrowUpRight, BookOpen, Boxes, FlaskConical, GitBranch, Layers3 } from "lucide-react";
import type { CatalogIndex } from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import { CONCEPT_OPTIONS } from "@/lib/concepts";
import { MeetingBallot } from "@/components/concepts/meeting-ballot";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface ConceptHubProps {
  catalog: CatalogIndex;
  dictionary: Dictionary;
  locale: Locale;
}

const localized = {
  en: {
    eyebrow: "Frontend direction study · 2026.09",
    title: "Four concept directions, one shared component index.",
    intro: "A desktop-first concept gallery for deciding how a medical AI component market should be explored, reviewed, and eventually composed.",
    compare: "Select a direction for discussion",
    compareHint: "Each concept uses the same 20-record fixture and public metadata contract. The differences are information hierarchy and interaction model.",
    current: "Current prototype",
    proposed: "Proposed direction",
    open: "Open concept",
    shared: "Shared substrate",
    sharedItems: ["20 public-safe records", "Same metadata fields", "Same bilingual routes", "No runtime GitHub requests"],
    sourceNote: "Reference pattern: SkillNet domain navigation, Hugging Face-style metadata, and research review workflows.",
    meeting: "Meeting-ready selection",
    recordUnit: "records",
    directionsUnit: "directions",
  },
  zh: {
    eyebrow: "前端方向研究 · 2026.09",
    title: "四种界面，共用一套组件索引。",
    intro: "面向桌面端的选型展厅，用于讨论医疗 AI 组件市场应如何被发现、审阅，以及未来组合。",
    compare: "选择明天讨论的方向",
    compareHint: "每个方案都使用同一份 20 条公开安全 fixture 和字段契约；差异在信息层级与交互模型。",
    current: "当前原型",
    proposed: "提议方向",
    open: "打开方案",
    shared: "共享底座",
    sharedItems: ["20 条公开安全记录", "同一套元数据字段", "同一套双语路由", "运行时不访问 GitHub"],
    sourceNote: "参考模式：SkillNet 的领域导航、Hugging Face 风格的元数据，以及研究型审阅工作流。",
    meeting: "会议选型",
    recordUnit: "条记录",
    directionsUnit: "个方向",
  },
} as const;

const iconFor = {
  registry: BookOpen,
  "domain-atlas": Layers3,
  "quality-lab": FlaskConical,
  "composition-studio": Boxes,
} as const;

const localizedConcepts = {
  en: {
    registry: { title: "Academic Registry", description: "A dense, source-aware register for taxonomy, repository metadata, and stable/candidate provenance.", lens: "Taxonomy + provenance", note: "Best for precise comparison" },
    "domain-atlas": { title: "Domain Atlas", description: "A domain-first atlas that surfaces popular research areas and maps them to component coverage.", lens: "Domains + discovery", note: "Best for finding a starting point" },
    "quality-lab": { title: "Quality Lab", description: "A review-oriented marketplace view that adds metadata cues beside the same component listings.", lens: "Review + metadata", note: "Best for governance discussions" },
    "composition-studio": { title: "Composition Studio", description: "A collection-oriented marketplace skin that keeps listings familiar while leaving pack grouping for later.", lens: "Collection + reuse", note: "Best for future pack discussion" },
  },
  zh: {
    registry: { title: "学术型登记册", description: "密集、可追溯的登记视图，用于比较分类、仓库元数据与稳定/候选溯源。", lens: "分类 + 溯源", note: "适合精确比较" },
    "domain-atlas": { title: "领域图谱", description: "以领域为入口，优先呈现热门研究方向及其组件覆盖情况。", lens: "领域 + 发现", note: "适合找到切入点" },
    "quality-lab": { title: "质控实验台", description: "在同一批组件条目旁增加元数据提示的审阅型 marketplace 外观。", lens: "审阅 + 元数据", note: "适合讨论治理" },
    "composition-studio": { title: "组合工作台", description: "偏 collection 的 marketplace 外观，保持条目熟悉，把组件包组合留到后续。", lens: "集合 + 复用", note: "适合讨论组件包愿景" },
  },
} as const;

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
            <span className="prototype-badge">{dictionary.prototypeLabel}</span>
          </div>
          <div className="concept-hub-hero__grid">
            <div>
              <h1 id="concept-hub-title">{copy.title}</h1>
              <p>{copy.intro}</p>
            </div>
            <div className="concept-hub-hero__stamp" aria-label={copy.shared}>
              <GitBranch size={18} aria-hidden="true" />
              <span>{copy.shared}</span>
              <strong>{catalog.entries.length}<small> {copy.recordUnit}</small></strong>
            </div>
          </div>
        </section>

        <section className="concept-hub-content site-width" aria-labelledby="concept-directions-title">
          <div className="concept-hub-section-heading">
            <div>
              <span className="section-kicker">01 · {copy.meeting}</span>
              <h2 id="concept-directions-title">{copy.compare}</h2>
              <p>{copy.compareHint}</p>
            </div>
            <span className="concept-hub-count">{CONCEPT_OPTIONS.length} {copy.directionsUnit}</span>
          </div>

          <div className="concept-cards">
            {CONCEPT_OPTIONS.map((concept, index) => {
              const Icon = iconFor[concept.id];
              const item = concepts[concept.id];
              return (
                <article className={`concept-card concept-card--${concept.id}`} key={concept.id}>
                  <div className="concept-card__topline">
                    <span className="concept-card__number">0{index + 1}</span>
                    <span className={concept.stage === "current" ? "concept-stage concept-stage--current" : "concept-stage"}>
                      {concept.stage === "current" ? copy.current : copy.proposed}
                    </span>
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

          <div className="concept-hub-lower">
            <div className="concept-shared-card">
              <div className="concept-shared-card__heading">
                <span className="section-kicker">02 · {copy.shared}</span>
                <h2>{copy.shared}</h2>
              </div>
              <ul>
                {copy.sharedItems.map((item) => <li key={item}><span aria-hidden="true">—</span>{item}</li>)}
              </ul>
              <p>{copy.sourceNote}</p>
            </div>
            <MeetingBallot locale={locale} />
          </div>
        </section>
      </main>
      <div className="site-width"><SiteFooter dictionary={dictionary} /></div>
    </div>
  );
}
