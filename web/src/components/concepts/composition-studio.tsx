"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Boxes,
  Check,
  CircleHelp,
  GitBranch,
  Link2,
  Plus,
  RotateCcw,
  Sparkles,
  Stars,
} from "lucide-react";
import type { CatalogEntry, CatalogIndex } from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import styles from "./composition-studio.module.css";

interface CompositionStudioProps {
  /** The shared fixture is passed by the concept route; arrays remain supported for isolated previews. */
  catalog: Pick<CatalogIndex, "entries" | "generatedAt" | "sourceSnapshots"> | CatalogEntry[];
  locale: Locale;
  /** Kept in the public contract so this concept can sit beside the other dictionary-driven views. */
  dictionary?: Dictionary;
}

type StageKey = "discovery" | "analysis" | "evidence";

interface StageCopy {
  key: StageKey;
  number: string;
  title: string;
  description: string;
  accent: string;
}

const stageCopy: Record<"en" | "zh", StageCopy[]> = {
  en: [
    {
      key: "discovery",
      number: "01",
      title: "Discovery",
      description: "Retrieve literature, records, or domain context.",
      accent: "teal",
    },
    {
      key: "analysis",
      number: "02",
      title: "Analysis",
      description: "Transform observations with a reproducible tool.",
      accent: "ink",
    },
    {
      key: "evidence",
      number: "03",
      title: "Research output",
      description: "Return an inspectable artefact for a research workflow.",
      accent: "amber",
    },
  ],
  zh: [
    {
      key: "discovery",
      number: "01",
      title: "发现",
      description: "检索文献、记录或领域上下文。",
      accent: "teal",
    },
    {
      key: "analysis",
      number: "02",
      title: "分析",
      description: "使用可复现工具处理观测结果。",
      accent: "ink",
    },
    {
      key: "evidence",
      number: "03",
      title: "研究输出",
      description: "为研究工作流返回可检查的研究产物。",
      accent: "amber",
    },
  ],
};

const labels = {
  en: {
    eyebrow: "Concept 04 · Composition Studio",
    title: "Compose a research workflow from reusable components.",
    intro:
      "A future-facing surface for grouping complementary skills, tools, and MCP servers into a reviewable bundle.",
    proposed: "Proposed interaction",
    pipeline: "Example composition",
    pipelineTitle: "Discovery → analysis → research output",
    pipelineNote: "Three compatible records arranged as a research workflow.",
    add: "Add to bundle",
    remove: "Remove",
    bundle: "Working bundle",
    components: "components",
    reset: "Reset example",
    future: "Concept preview · composition and execution are future work",
    noExecution:
      "This prototype only demonstrates information architecture. It does not install, connect, or execute a component.",
    metadata: "Metadata",
    stars: "stars",
    source: "source",
    topics: "topics",
    noTopics: "No topics",
    noDescription: "No source description.",
    output: "Inspectable hand-off",
    outputText: "A future bundle could expose inputs, outputs, interfaces, and provenance before execution.",
    outputFields: ["inputs", "interfaces", "provenance"],
    next: "Next stage",
    candidate: "Candidate",
    stable: "Stable",
    type: "type",
    context: "Context",
    contextText:
      "Inspired by collection and pack patterns: a bundle is a citable research object, not a one-click trust signal.",
    canvasLabel: "Composition canvas",
    manifestTitle: "Bundle manifest",
    manifestHint: "A structured hand-off for a future execution layer.",
    manifestState: "Local state only",
    manifestRows: ["3 stages", "Inspectable metadata", "No execution"],
  },
  zh: {
    eyebrow: "方案 04 · 组合工作台",
    title: "从可复用组件组合研究工作流。",
    intro:
      "面向未来的组合界面：将互补的 Skill、Tool 与 MCP Server 编排成可复核的组件包。",
    proposed: "交互设想",
    pipeline: "组合示例",
    pipelineTitle: "发现 → 分析 → 研究输出",
    pipelineNote: "三个可互补的真实条目，按研究工作流排列。",
    add: "加入组件包",
    remove: "移除",
    bundle: "当前组件包",
    components: "个组件",
    reset: "重置示例",
    future: "概念预览 · 组合与执行能力将在后续实现",
    noExecution: "本原型仅展示信息架构，不会安装、连接或执行任何组件。",
    metadata: "元数据",
    stars: "Star",
    source: "来源",
    topics: "标签",
    noTopics: "暂无标签",
    noDescription: "数据源未提供描述。",
    output: "可检查的交接",
    outputText: "未来组件包可在执行前公开输入、输出、接口与溯源信息。",
    outputFields: ["输入", "接口", "溯源"],
    next: "下一阶段",
    candidate: "候选层",
    stable: "稳定层",
    type: "类型",
    context: "设计语境",
    contextText: "参考 collection 与 pack 模式：组件包是可引用的研究对象，不是一步到位的信任背书。",
    canvasLabel: "组合画布",
    manifestTitle: "组件包清单",
    manifestHint: "为未来执行层准备的结构化交接信息。",
    manifestState: "仅本地状态",
    manifestRows: ["3 个阶段", "可检查元数据", "不会执行"],
  },
} as const;

type Labels = {
  eyebrow: string;
  title: string;
  intro: string;
  proposed: string;
  pipeline: string;
  pipelineTitle: string;
  pipelineNote: string;
  add: string;
  remove: string;
  bundle: string;
  components: string;
  reset: string;
  future: string;
  noExecution: string;
  metadata: string;
  stars: string;
  source: string;
  topics: string;
  noTopics: string;
  noDescription: string;
  output: string;
  outputText: string;
  outputFields: readonly string[];
  next: string;
  candidate: string;
  stable: string;
  type: string;
  context: string;
  contextText: string;
  canvasLabel: string;
  manifestTitle: string;
  manifestHint: string;
  manifestState: string;
  manifestRows: readonly string[];
};

function shortName(entry: CatalogEntry): string {
  const repository = entry.fullName.split("/")[1] ?? entry.fullName;
  return repository.length > 30 ? `${repository.slice(0, 27)}…` : repository;
}

function initials(entry: CatalogEntry): string {
  const [owner = "?", repository = "?"] = entry.fullName.split("/");
  return `${owner[0] ?? "?"}${repository[0] ?? "?"}`.toUpperCase();
}

function formatStars(stars: number): string {
  if (stars >= 1_000_000) return `${(stars / 1_000_000).toFixed(1)}M`;
  if (stars >= 1_000) return `${(stars / 1_000).toFixed(stars >= 10_000 ? 0 : 1)}k`;
  return stars.toLocaleString("en-US");
}

function pickEntry(entries: CatalogEntry[], id: string, fallbackIndex: number): CatalogEntry | undefined {
  return entries.find((entry) => entry.id === id) ?? entries[fallbackIndex];
}

function selectPipeline(entries: CatalogEntry[]): CatalogEntry[] {
  const preferred = [
    pickEntry(entries, "andybrandt/mcp-simple-pubmed", 0),
    pickEntry(entries, "mims-harvard/ToolUniverse", 1),
    pickEntry(entries, "aipoch/medical-research-skills", 2),
  ].filter((entry): entry is CatalogEntry => Boolean(entry));

  const unique = new Map(preferred.map((entry) => [entry.id, entry]));
  if (unique.size < 3) {
    for (const entry of entries) {
      if (!unique.has(entry.id)) unique.set(entry.id, entry);
      if (unique.size === 3) break;
    }
  }
  return [...unique.values()].slice(0, 3);
}

function EntryMetadata({ entry, copy }: { entry: CatalogEntry; copy: Labels }) {
  const topicLabel = entry.topics.length > 0 ? entry.topics.slice(0, 2).join(" · ") : copy.noTopics;

  return (
    <dl className={styles.metadata}>
      <div>
        <dt>{copy.type}</dt>
        <dd>{entry.primaryCategory}</dd>
      </div>
      <div>
        <dt>{copy.stars}</dt>
        <dd>
          <Stars size={13} aria-hidden="true" /> {formatStars(entry.stars)}
        </dd>
      </div>
      <div className={styles.metadataWide}>
        <dt>{copy.source}</dt>
        <dd>{entry.source}</dd>
      </div>
      <div className={styles.metadataWide}>
        <dt>{copy.topics}</dt>
        <dd>{topicLabel}</dd>
      </div>
    </dl>
  );
}

function ComponentCard({
  entry,
  index,
  stage,
  selected,
  onToggle,
  copy,
}: {
  entry: CatalogEntry;
  index: number;
  stage: StageCopy;
  selected: boolean;
  onToggle: () => void;
  copy: Labels;
}) {
  return (
    <article className={`${styles.componentCard} ${selected ? styles.componentCardSelected : ""}`}>
      <div className={styles.cardTopline}>
        <span className={`${styles.stageMarker} ${styles[`stageMarker${stage.accent}`]}`}>
          {stage.number}
        </span>
        <span className={styles.stageLabel}>{stage.title}</span>
        <button
          type="button"
          className={`${styles.addButton} ${selected ? styles.addButtonSelected : ""}`}
          onClick={onToggle}
          aria-pressed={selected}
        >
          {selected ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
          <span>{selected ? copy.remove : copy.add}</span>
        </button>
      </div>
      <div className={styles.cardIdentity}>
        <span className={styles.monogram} aria-hidden="true">{initials(entry)}</span>
        <div>
          <span className={styles.owner}>{entry.fullName.split("/")[0]}</span>
          <h3>{shortName(entry)}</h3>
        </div>
      </div>
      <p className={styles.cardDescription}>{entry.description ?? copy.noDescription}</p>
      <EntryMetadata entry={entry} copy={copy} />
      <div className={styles.cardFooter}>
        <span className={`${styles.tierPill} ${entry.tier === "stable" ? styles.tierStable : styles.tierCandidate}`}>
          {entry.tier === "stable" ? copy.stable : copy.candidate}
        </span>
        <a href={entry.repositoryUrl} target="_blank" rel="noreferrer" className={styles.repoLink}>
          <Link2 size={13} aria-hidden="true" /> {entry.fullName}
        </a>
      </div>
      {index < 2 && (
        <div className={styles.connector} aria-hidden="true">
          <ArrowRight size={16} />
        </div>
      )}
    </article>
  );
}

export function CompositionStudio({ catalog, locale }: CompositionStudioProps) {
  const copy: Labels = labels[locale];
  const stages = stageCopy[locale];
  const entries = Array.isArray(catalog) ? catalog : catalog.entries;
  const pipeline = useMemo(() => selectPipeline(entries), [entries]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => pipeline.map((entry) => entry.id));

  const toggleEntry = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const resetSelection = () => setSelectedIds(pipeline.map((entry) => entry.id));

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="composition-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroOrb} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrow}>{copy.eyebrow}</span>
            <span className={styles.proposedBadge}><Sparkles size={13} aria-hidden="true" /> {copy.proposed}</span>
          </div>
          <h1 id="composition-title">{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <aside className={styles.contextNote}>
          <div className={styles.contextIcon} aria-hidden="true"><CircleHelp size={18} /></div>
          <div>
            <span>{copy.context}</span>
            <p>{copy.contextText}</p>
          </div>
        </aside>
      </section>

      <section className={styles.pipelineSection} aria-labelledby="pipeline-title">
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.kicker}>{copy.pipeline}</span>
            <h2 id="pipeline-title">{copy.pipelineTitle}</h2>
            <p>{copy.pipelineNote}</p>
          </div>
          <div className={styles.bundleStatus}>
            <div className={styles.bundleStatusLabel}><Boxes size={16} aria-hidden="true" /> {copy.bundle}</div>
            <strong>{selectedIds.length} <span>{copy.components}</span></strong>
            <button type="button" className={styles.resetButton} onClick={resetSelection}>
              <RotateCcw size={13} aria-hidden="true" /> {copy.reset}
            </button>
          </div>
        </div>

        <div className={styles.stageRail} aria-label={copy.pipeline}>
          {stages.map((stage) => (
            <div className={`${styles.railStep} ${styles[`railStep${stage.accent}`]}`} key={stage.key}>
              <span>{stage.number}</span>
              <div><strong>{stage.title}</strong><small>{stage.description}</small></div>
              {stage.key !== "evidence" && <ArrowRight size={15} aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div className={styles.canvasLayout}>
          <aside className={styles.workflowManifest} aria-label={copy.manifestTitle}>
            <div className={styles.manifestMark}><GitBranch size={16} aria-hidden="true" /></div>
            <span className={styles.kicker}>{copy.canvasLabel}</span>
            <h3>{copy.manifestTitle}</h3>
            <p>{copy.manifestHint}</p>
            <dl>
              <div><dt>{copy.manifestState}</dt><dd>{selectedIds.length}/{pipeline.length}</dd></div>
              {copy.manifestRows.map((row) => <div key={row}><dt>{row}</dt><dd>—</dd></div>)}
            </dl>
            <span className={styles.manifestNote}>{copy.noExecution}</span>
          </aside>
          <div className={styles.componentGrid}>
            {pipeline.map((entry, index) => (
              <ComponentCard
                copy={copy}
                entry={entry}
                index={index}
                key={entry.id}
                onToggle={() => toggleEntry(entry.id)}
                selected={selectedIds.includes(entry.id)}
                stage={stages[index] ?? stages[stages.length - 1]}
              />
            ))}
            {pipeline.length === 0 && <p className={styles.emptyState}>No components available in this fixture.</p>}
          </div>
        </div>
      </section>

      <section className={styles.outputSection} aria-labelledby="output-title">
        <div className={styles.outputIcon} aria-hidden="true"><GitBranch size={19} /></div>
        <div>
          <span className={styles.kicker}>{copy.output}</span>
          <h2 id="output-title">{copy.outputText}</h2>
        </div>
        <div className={styles.outputFields}>
          {copy.outputFields.map((field) => <span key={field}>{field}</span>)}
        </div>
      </section>

      <aside className={styles.disclaimer} role="note">
        <Sparkles size={15} aria-hidden="true" />
        <span><strong>{copy.future}</strong> — {copy.noExecution}</span>
      </aside>
    </main>
  );
}
