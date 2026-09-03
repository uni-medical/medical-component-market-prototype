import {
  AlertTriangle,
  Beaker,
  Check,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  GitBranch,
  Info,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import type { CatalogEntry, CatalogIndex } from "@/lib/catalog";
import { getMetadataCoverage } from "@/lib/concepts";
import type { Dictionary, Locale } from "@/lib/i18n";
import styles from "./quality-lab.module.css";

export interface QualityLabProps {
  /** Accepts the shared catalog index so every concept uses the same fixture. */
  catalog: Pick<CatalogIndex, "entries" | "generatedAt" | "sourceSnapshots"> | CatalogEntry[];
  locale: Locale;
  /** Reserved for the shared page contract; copy is kept local to this concept. */
  dictionary?: Dictionary;
}

type Copy = {
  eyebrow: string;
  title: string;
  intro: string;
  prototype: string;
  scopeTitle: string;
  scopeBody: string;
  metrics: {
    records: string;
    metadata: string;
    queued: string;
    snapshots: string;
  };
  reviewTitle: string;
  reviewSubtitle: string;
  rubricTitle: string;
  rubricSubtitle: string;
  proposed: string;
  notEvaluated: string;
  dimensions: Array<{ name: string; question: string; signal: string }>;
  coverageTitle: string;
  coverageBody: string;
  listingCue: string;
  observed: string;
  fields: string;
  source: string;
  stable: string;
  candidate: string;
  evidenceTitle: string;
  evidenceBody: string;
  mainSnapshot: string;
  automationSnapshot: string;
  fieldLegend: string;
  emptyListings: string;
  summaryLabel: string;
  reviewKicker: string;
  evaluationKicker: string;
  auditKicker: string;
  triageLabel: string;
  triageStates: readonly string[];
  marketplaceSkin: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: "Concept C · review workbench",
    title: "A transparent quality lab for component records.",
    intro:
      "A research-facing workspace for deciding what a catalog record still needs before it can be compared, composed, or adopted.",
    prototype: "Prototype · rubric proposal",
    scopeTitle: "Review scope",
    scopeBody:
      "This view audits public metadata and makes the future review protocol visible. It does not certify a component or assign a quality score.",
    metrics: {
      records: "Records in scope",
      metadata: "Metadata coverage",
      queued: "Candidate listings",
      snapshots: "Source snapshots",
    },
    reviewTitle: "Component listings to review",
    reviewSubtitle:
      "The same marketplace records, with a review-oriented skin. Six visible rows are a sample; coverage points to fields to inspect.",
    rubricTitle: "Review lens (proposed)",
    rubricSubtitle:
      "A future review layer can sit beside the same listings; no quality score is assigned here.",
    proposed: "Proposed",
    notEvaluated: "Not evaluated",
    dimensions: [
      {
        name: "Safety",
        question: "Claims, data handling, and failure boundaries",
        signal: "Requires source review",
      },
      {
        name: "Completeness",
        question: "Documentation, interface, and metadata coverage",
        signal: "Metadata only in this prototype",
      },
      {
        name: "Executability",
        question: "Reproducible setup and a runnable example",
        signal: "Requires execution trace",
      },
      {
        name: "Maintainability",
        question: "Release cadence, ownership, and change hygiene",
        signal: "Requires repository history",
      },
      {
        name: "Cost-awareness",
        question: "Runtime, model, and external service costs",
        signal: "Requires measured workload",
      },
    ],
    coverageTitle: "What metadata coverage means",
    coverageBody:
      "Coverage is the proportion of nine public fields present in the fixture: description, category, domain, topics, homepage, language, license, update time, and source snapshot. Presence is not correctness or quality.",
    listingCue: "What to inspect",
    observed: "Observed",
    fields: "public fields",
    source: "Source",
    stable: "Stable",
    candidate: "Candidate",
    evidenceTitle: "Evidence boundary",
    evidenceBody:
      "Stable means present in the reviewed main snapshot; Candidate means present only in automated discovery. Neither label implies medical validity, security review, or compatibility.",
    mainSnapshot: "main snapshot",
    automationSnapshot: "automation snapshot",
    fieldLegend: "Derived from fixture fields · no hidden score",
    emptyListings: "No candidate listings in the current fixture.",
    summaryLabel: "Quality lab summary",
    reviewKicker: "02 / marketplace listings",
    evaluationKicker: "03 / evaluation design",
    auditKicker: "04 / audit note",
    triageLabel: "Listing cues",
    triageStates: ["Candidate", "Metadata gap", "Stable"],
    marketplaceSkin: "The same component market, shown with a review-oriented visual skin. These cues describe what to inspect; they do not rank quality.",
  },
  zh: {
    eyebrow: "方案 C · 质控工作台",
    title: "让组件记录的质量边界透明可见。",
    intro:
      "一个面向研究评审的工作区：在条目被比较、组合或采用前，先明确它还缺少哪些可核验信息。",
    prototype: "原型 · 质控框架提案",
    scopeTitle: "评审范围",
    scopeBody:
      "本视图检查公开元数据，并把未来的评审协议显式展示出来；不对组件做认证，也不生成质量分数。",
    metrics: {
      records: "范围内条目",
      metadata: "元数据覆盖",
      queued: "候选条目",
      snapshots: "来源快照",
    },
    reviewTitle: "待审组件条目",
    reviewSubtitle:
      "与 marketplace 相同的组件记录，只换成审阅型外观。当前展示六条样例，并用覆盖率提示要检查的字段。",
    rubricTitle: "审阅视角（拟议）",
    rubricSubtitle:
      "未来可以在同一批条目旁增加审阅层；本原型不生成质量分数。",
    proposed: "拟议",
    notEvaluated: "尚未评估",
    dimensions: [
      {
        name: "安全性",
        question: "声明、数据处理与失效边界",
        signal: "需要源码评审",
      },
      {
        name: "完整性",
        question: "文档、接口与元数据覆盖",
        signal: "本原型仅展示元数据",
      },
      {
        name: "可执行性",
        question: "可复现安装与可运行示例",
        signal: "需要执行记录",
      },
      {
        name: "可维护性",
        question: "发布节奏、维护者与变更规范",
        signal: "需要仓库历史",
      },
      {
        name: "成本意识",
        question: "运行、模型与外部服务成本",
        signal: "需要实测工作负载",
      },
    ],
    coverageTitle: "如何理解元数据覆盖",
    coverageBody:
      "覆盖率是 fixture 中九个公开字段的存在比例：描述、分类、领域、标签、主页、语言、许可证、更新时间和来源快照。有字段不等于内容正确，更不等于质量。",
    listingCue: "检查提示",
    observed: "观测",
    fields: "公开字段",
    source: "来源",
    stable: "稳定层",
    candidate: "候选层",
    evidenceTitle: "证据边界",
    evidenceBody:
      "稳定层表示条目出现在经过复核的 main 快照；候选层表示条目仅出现在自动发现流。两者都不代表医疗有效性、安全审查或兼容性。",
    mainSnapshot: "main 快照",
    automationSnapshot: "automation 快照",
    fieldLegend: "由 fixture 字段推导 · 不含隐藏分数",
    emptyListings: "当前 fixture 中没有候选条目。",
    summaryLabel: "质控实验台摘要",
    reviewKicker: "02 / 组件市场条目",
    evaluationKicker: "03 / 评估设计",
    auditKicker: "04 / 审计说明",
    triageLabel: "条目提示",
    triageStates: ["候选层", "元数据缺口", "稳定层"],
    marketplaceSkin: "与同一组件市场共用记录，只换成审阅型外观。这些提示用于说明要检查什么，不用于排序质量。",
  },
};

function getEntries(catalog: QualityLabProps["catalog"]): CatalogEntry[] {
  return Array.isArray(catalog) ? catalog : catalog.entries;
}

function getSnapshots(catalog: QualityLabProps["catalog"]): {
  main: string;
  automation: string;
} {
  if (Array.isArray(catalog)) {
    return { main: "", automation: "" };
  }
  return catalog.sourceSnapshots;
}

function formatDate(value: string, locale: Locale): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function shortSha(value: string): string {
  return value ? value.slice(0, 10) : "—";
}

function displayName(entry: CatalogEntry): string {
  return entry.fullName.split("/")[1] ?? entry.fullName;
}

function listingCue(entry: CatalogEntry, copy: Copy, locale: Locale): string {
  const coverage = getMetadataCoverage(entry);
  if (entry.tier === "candidate" && coverage.present < coverage.total) {
    return copy.candidate;
  }
  if (entry.tier === "candidate") {
    return copy.candidate;
  }
  if (coverage.present < coverage.total) {
    const missing = coverage.total - coverage.present;
    return locale === "zh" ? `缺少 ${missing} 个${copy.fields}` : `${missing} ${copy.fields} missing`;
  }
  return copy.stable;
}

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof FileCheck2 }) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricIcon} aria-hidden="true">
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
        <span>{detail}</span>
      </div>
    </div>
  );
}

export function QualityLab({ catalog, locale }: QualityLabProps) {
  const copy = COPY[locale];
  const entries = getEntries(catalog);
  const snapshots = getSnapshots(catalog);
  const coverage = entries.map(getMetadataCoverage);
  const metadataCoverage = coverage.length
    ? Math.round(coverage.reduce((total, item) => total + item.percentage, 0) / coverage.length)
    : 0;
  const candidates = entries.filter((entry) => entry.tier === "candidate");
  const visibleListings = [...entries]
    .sort((left, right) => {
      const tierWeight = Number(right.tier === "candidate") - Number(left.tier === "candidate");
      if (tierWeight !== 0) return tierWeight;
      return getMetadataCoverage(left).percentage - getMetadataCoverage(right).percentage;
    })
    .slice(0, 6);
  const sourceSnapshotCount = Number(Boolean(snapshots.main)) + Number(Boolean(snapshots.automation));

  return (
    <main className={styles.lab}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrow}>{copy.eyebrow}</span>
            <span className={styles.prototype}>{copy.prototype}</span>
          </div>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <aside className={styles.scopeCard} aria-label={copy.scopeTitle}>
          <div className={styles.scopeCardHeader}>
            <SlidersHorizontal size={17} aria-hidden="true" />
            <span>{copy.scopeTitle}</span>
          </div>
          <p>{copy.scopeBody}</p>
          <div className={styles.scopeStamp}>
            <span>QA / 00</span>
            <span>{copy.fieldLegend}</span>
          </div>
        </aside>
      </header>

      <dl className={styles.metrics} aria-label={copy.summaryLabel}>
        <Metric
          detail={locale === "zh" ? "共享静态 fixture" : "shared static fixture"}
          icon={FileCheck2}
          label={copy.metrics.records}
          value={String(entries.length).padStart(2, "0")}
        />
        <Metric
          detail={locale === "zh" ? "字段存在比例" : "field presence only"}
          icon={ClipboardCheck}
          label={copy.metrics.metadata}
          value={`${metadataCoverage}%`}
        />
        <Metric
          detail={locale === "zh" ? "候选或待补字段" : "candidate / incomplete"}
          icon={AlertTriangle}
          label={copy.metrics.queued}
          value={String(candidates.length).padStart(2, "0")}
        />
        <Metric
          detail={locale === "zh" ? "版本化来源" : "versioned provenance"}
          icon={GitBranch}
          label={copy.metrics.snapshots}
          value={String(sourceSnapshotCount).padStart(2, "0")}
        />
      </dl>

      <section className={styles.marketplaceNote} aria-label={copy.reviewTitle}>
        <span className={styles.kicker}>01 / marketplace lens</span>
        <p>{copy.marketplaceSkin}</p>
      </section>

      <section className={styles.dashboard}>
        <div className={styles.queuePanel}>
          <div className={styles.sectionHeader}>
              <div>
                <span className={styles.kicker}>{copy.reviewKicker}</span>
                <h2>{copy.reviewTitle}</h2>
                <p>{copy.reviewSubtitle}</p>
                <div className={styles.triageFilters} aria-label={copy.triageLabel}>
                  <span>{copy.triageLabel}</span>
                  {copy.triageStates.map((state, index) => <span key={state} className={index === 0 ? styles.triageActive : ""}>{state}</span>)}
                </div>
              </div>
            <span className={styles.queueCount}>{visibleListings.length.toString().padStart(2, "0")}</span>
          </div>
          <div className={styles.queueList}>
            {visibleListings.length === 0 ? (
              <p className={styles.empty}>{copy.emptyListings}</p>
            ) : (
              visibleListings.map((entry, index) => {
                const itemCoverage = getMetadataCoverage(entry);
                const snapshot = entry.snapshot.mainSha ?? entry.snapshot.automationSha ?? "";
                return (
                  <article className={styles.queueItem} key={entry.id}>
                    <span className={styles.queueIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <div className={styles.queueIdentity}>
                      <div className={styles.queueNameRow}>
                        <code>{displayName(entry)}</code>
                        <span className={`${styles.tier} ${styles[`tier_${entry.tier}`]}`}>
                          {entry.tier === "candidate" ? copy.candidate : copy.stable}
                        </span>
                      </div>
                      <span className={styles.owner}>{entry.fullName.split("/")[0]}</span>
                      <p>{entry.description ?? (locale === "zh" ? "数据源未提供描述。" : "No source description provided.")}</p>
                      <div className={styles.queueMeta}>
                        <span>
                          <Beaker size={12} aria-hidden="true" /> {entry.primaryCategory}
                        </span>
                        <span>
                          <Clock3 size={12} aria-hidden="true" /> {copy.observed} {formatDate(entry.observedAt, locale)}
                        </span>
                        <span>
                          <GitBranch size={12} aria-hidden="true" /> {shortSha(snapshot)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.coverage}>
                      <span>{itemCoverage.present}/{itemCoverage.total}</span>
                      <span>{copy.fields}</span>
                      <div className={styles.coverageBar} aria-label={`${itemCoverage.percentage}% metadata coverage`}>
                        <span style={{ width: `${itemCoverage.percentage}%` }} />
                      </div>
                      <small>{listingCue(entry, copy, locale)}</small>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <aside className={styles.rubricPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.kicker}>{copy.evaluationKicker}</span>
              <h2>{copy.rubricTitle}</h2>
              <p>{copy.rubricSubtitle}</p>
            </div>
            <span className={styles.proposedMark}>{copy.proposed}</span>
          </div>
          <div className={styles.rubricList}>
            {copy.dimensions.map((dimension, index) => (
              <div className={styles.rubricItem} key={dimension.name}>
                <div className={styles.rubricNumber}>{String(index + 1).padStart(2, "0")}</div>
                <div className={styles.rubricCopy}>
                  <strong>{dimension.name}</strong>
                  <span>{dimension.question}</span>
                  <small>{dimension.signal}</small>
                </div>
                <span className={styles.notEvaluated}>{copy.notEvaluated}</span>
              </div>
            ))}
          </div>
          <div className={styles.rubricNote}>
            <Info size={15} aria-hidden="true" />
            <p>{copy.coverageBody}</p>
          </div>
        </aside>
      </section>

      <section className={styles.bottomGrid}>
        <div className={styles.coverageCard}>
          <div className={styles.cardIcon} aria-hidden="true">
            <Check size={17} />
          </div>
          <div>
            <span className={styles.kicker}>{copy.auditKicker}</span>
            <h2>{copy.coverageTitle}</h2>
            <p>{copy.coverageBody}</p>
          </div>
        </div>
        <div className={styles.evidenceCard}>
          <div className={styles.cardIcon} aria-hidden="true">
            <ShieldAlert size={17} />
          </div>
          <div>
            <span className={styles.kicker}>{copy.evidenceTitle}</span>
            <h2>{copy.stable} / {copy.candidate}</h2>
            <p>{copy.evidenceBody}</p>
            <div className={styles.snapshotRow}>
              <span><GitBranch size={13} aria-hidden="true" /> {copy.mainSnapshot} <code>{shortSha(snapshots.main)}</code></span>
              <span><GitBranch size={13} aria-hidden="true" /> {copy.automationSnapshot} <code>{shortSha(snapshots.automation)}</code></span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
