import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  CircleDot,
  GitBranch,
  Layers3,
  Network,
  Search,
  Tag,
} from "lucide-react";
import type { CatalogEntry, CatalogIndex } from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import styles from "./domain-atlas.module.css";

interface DomainRule {
  id: string;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  color: "teal" | "blue" | "amber" | "violet" | "rose";
  matches: (entry: CatalogEntry) => boolean;
}

const DOMAIN_RULES: DomainRule[] = [
  {
    id: "medical-ai",
    label: "Medical AI & research",
    labelZh: "医疗 AI 与研究",
    description: "Clinical, biomedical, and life-science workflows",
    descriptionZh: "临床、生物医学与生命科学工作流",
    color: "teal",
    matches: (entry) =>
      entry.domains.includes("medical") ||
      entry.topics.some((topic) =>
        /(medical|health|bio|genom|cancer|clinical|pubmed|fhir|ehr)/i.test(topic),
      ),
  },
  {
    id: "agent-infrastructure",
    label: "Agent infrastructure",
    labelZh: "Agent 基础设施",
    description: "Skills, plugins, and tool-use surfaces for agents",
    descriptionZh: "面向 Agent 的 Skill、Plugin 与工具调用接口",
    color: "blue",
    matches: (entry) =>
      entry.topics.some((topic) =>
        /(agent|plugin|skill|mcp|tool-use|dsh)/i.test(topic),
      ),
  },
  {
    id: "knowledge-systems",
    label: "Knowledge systems",
    labelZh: "知识系统",
    description: "Retrieval, memory, and structured knowledge layers",
    descriptionZh: "检索、记忆与结构化知识层",
    color: "violet",
    matches: (entry) =>
      entry.topics.some((topic) =>
        /(knowledge|memory|rag|retrieval|reasoning|context|literature|science)/i.test(topic),
      ),
  },
  {
    id: "developer-tooling",
    label: "Developer tooling",
    labelZh: "开发者工具链",
    description: "CLIs, code workflows, and integration utilities",
    descriptionZh: "CLI、代码工作流与集成工具",
    color: "amber",
    matches: (entry) =>
      entry.primaryCategory === "CLI" ||
      entry.topics.some((topic) => /(developer|coding|cli|typescript|python|api|graphql)/i.test(topic)),
  },
  {
    id: "interoperability",
    label: "Interoperability",
    labelZh: "互操作与标准",
    description: "Protocols and interfaces that connect components",
    descriptionZh: "连接组件的协议与接口标准",
    color: "rose",
    matches: (entry) =>
      entry.topics.some((topic) => /(fhir|ehr|graphql|api|mcp|server|open-source)/i.test(topic)),
  },
];

const copy = {
  en: {
    eyebrow: "Concept B · SkillNet-inspired ontology",
    title: "Domain Atlas",
    intro:
      "A domain-first lens for navigating the same component index. Start with a research area, then inspect the metadata and source trail behind each node.",
    prototype: "Prototype",
    proposed: "Proposed taxonomy",
    searchLabel: "Search domains or component tags",
    searchPlaceholder: "Search domains, topics, or repositories…",
    searchNote: "Search is a visual affordance in this phase; the connected index will add full-text retrieval.",
    domainHeading: "Popular domains",
    domainNote: "Counts are fixture coverage from transparent topic rules; they are not usage or popularity metrics.",
    entries: "entries",
    lead: "Leading entries",
    ontologyHeading: "Ontology slice",
    ontologyNote: "A compact view of component types, domain coverage, and source maturity.",
    componentType: "Component type",
    coverage: "Domain coverage",
    maturity: "Source maturity",
    stable: "Stable",
    candidate: "Candidate",
    inspect: "Inspect",
    noTopic: "No source topics",
    metadataHeading: "Metadata affordance",
    metadataBody:
      "Each domain node resolves to the same entry detail view: repository, license, topics, snapshot, and observation time remain visible before adoption.",
    openRegistry: "Open academic registry",
    future: "Future extension",
    futureBody: "Ontology edges and saved domain views can become URL-shareable filters once the index is connected.",
    ontologyKicker: "02 / Ontology",
    metadataKicker: "03 / Metadata",
  },
  zh: {
    eyebrow: "方案 B · 参考 SkillNet 的本体视图",
    title: "领域图谱",
    intro:
      "用领域作为入口浏览同一份组件索引：先定位研究方向，再回到每个节点背后的元数据与来源链路。",
    prototype: "原型",
    proposed: "提议中的分类",
    searchLabel: "搜索领域或组件标签",
    searchPlaceholder: "搜索领域、标签或仓库…",
    searchNote: "当前搜索框仅展示交互入口；接入全量索引后再启用全文检索。",
    domainHeading: "热门领域",
    domainNote: "数量由 20 条原型数据按透明标签规则计算，不代表使用量、流行度或质量评分。",
    entries: "条目",
    lead: "代表条目",
    ontologyHeading: "本体切片",
    ontologyNote: "并列展示组件类型、领域覆盖与数据源成熟度。",
    componentType: "组件类型",
    coverage: "领域覆盖",
    maturity: "来源成熟度",
    stable: "稳定层",
    candidate: "候选层",
    inspect: "查看",
    noTopic: "数据源未提供标签",
    metadataHeading: "元数据入口",
    metadataBody:
      "每个领域节点最终都指向同一份条目详情：在使用前仍可看到仓库、许可证、标签、快照与观测时间。",
    openRegistry: "打开学术型目录",
    future: "后续扩展",
    futureBody: "接入真实索引后，可把本体关系与保存的领域视图转为可分享的 URL 筛选状态。",
    ontologyKicker: "02 / 本体切片",
    metadataKicker: "03 / 元数据",
  },
} as const;

type DomainAtlasCopy = (typeof copy)[keyof typeof copy];

function shortName(entry: CatalogEntry): string {
  return entry.fullName.split("/")[1] ?? entry.fullName;
}

function topTopics(entries: CatalogEntry[], limit = 3): string[] {
  const counts = new Map<string, number>();
  entries.flatMap((entry) => entry.topics).forEach((topic) => {
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([topic]) => topic);
}

function sourceMaturity(entries: CatalogEntry[], locale: Locale, text: DomainAtlasCopy): string {
  const stable = entries.filter((entry) => entry.tier === "stable").length;
  const candidate = entries.length - stable;
  return locale === "zh"
    ? `${text.stable} ${stable} · ${text.candidate} ${candidate}`
    : `${text.stable} ${stable} · ${text.candidate} ${candidate}`;
}

function categoryRows(catalog: CatalogIndex, locale: Locale, text: DomainAtlasCopy) {
  const categories = new Map<string, CatalogEntry[]>();
  catalog.entries.forEach((entry) => {
    const current = categories.get(entry.primaryCategory) ?? [];
    current.push(entry);
    categories.set(entry.primaryCategory, current);
  });

  return [...categories.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([category, entries]) => {
      const medical = entries.filter((entry) => entry.domains.includes("medical")).length;
      return {
        category,
        count: entries.length,
        medical,
        maturity: sourceMaturity(entries, locale, text),
        topics: topTopics(entries, 2),
      };
    });
}

function entryHref(locale: Locale, entry: CatalogEntry): string {
  const [owner, repository] = entry.fullName.split("/");
  return `/${locale}/entries/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repository ?? "")}`;
}

export interface DomainAtlasProps {
  catalog: CatalogIndex;
  locale?: Locale;
  /** Kept in the shared concept contract; copy is local so this view can stand alone. */
  dictionary?: Dictionary;
}

export function DomainAtlas({ catalog, locale = "en" }: DomainAtlasProps) {
  const text = copy[locale];
  const domains = DOMAIN_RULES.map((rule) => ({
    ...rule,
    entries: catalog.entries.filter(rule.matches),
  }))
    .filter((domain) => domain.entries.length > 0)
    .sort((a, b) => b.entries.length - a.entries.length || a.id.localeCompare(b.id));
  const rows = categoryRows(catalog, locale, text);
  const totalWithTopics = catalog.entries.filter((entry) => entry.topics.length > 0).length;
  const metadataCoverage = Math.round((totalWithTopics / Math.max(catalog.entries.length, 1)) * 100);

  return (
    <main className={styles.atlas} aria-labelledby="domain-atlas-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrow}>{text.eyebrow}</span>
            <span className={styles.prototypeBadge}>{text.prototype}</span>
          </div>
          <h1 id="domain-atlas-title">{text.title}</h1>
          <p>{text.intro}</p>
          <div className={styles.heroMeta}>
            <span><Network size={15} aria-hidden="true" />{text.proposed}</span>
            <span><GitBranch size={15} aria-hidden="true" />{catalog.entries.length} {text.entries}</span>
            <span><Tag size={15} aria-hidden="true" />{metadataCoverage}% {locale === "zh" ? "标签覆盖" : "tag coverage"}</span>
          </div>
        </div>
        <div className={styles.searchPanel} role="search" aria-label={text.searchLabel}>
          <div className={styles.searchInput}>
            <Search size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="atlas-search">{text.searchLabel}</label>
            <input id="atlas-search" type="search" placeholder={text.searchPlaceholder} disabled />
            <span className={styles.searchKey}>/</span>
          </div>
          <p>{text.searchNote}</p>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionKicker}>01 / {locale === "zh" ? "领域入口" : "Domain entry points"}</span>
          <h2>{text.domainHeading}</h2>
        </div>
        <p>{text.domainNote}</p>
      </div>

      <div className={styles.domainGrid}>
        {domains.map((domain, index) => {
          const leadingEntries = [...domain.entries]
            .sort((a, b) => b.stars - a.stars || a.fullName.localeCompare(b.fullName))
            .slice(0, 2);
          return (
            <article className={`${styles.domainCard} ${styles[`domainCard${domain.color}`]}`} key={domain.id}>
              <div className={styles.domainCardTop}>
                <span className={styles.domainIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.domainIcon} aria-hidden="true"><CircleDot size={17} /></span>
                <span className={styles.domainCount}>{domain.entries.length} {text.entries}</span>
              </div>
              <h3>{locale === "zh" ? domain.labelZh : domain.label}</h3>
              <p>{locale === "zh" ? domain.descriptionZh : domain.description}</p>
              <div className={styles.domainLeads}>
                <span>{text.lead}</span>
                <ul>
                  {leadingEntries.map((entry) => (
                    <li key={entry.id}>
                      <Link href={entryHref(locale, entry)}>
                        {shortName(entry)} <span className={styles.leadStars}>{entry.stars.toLocaleString("en-US")}★</span> <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.domainCardFoot}>
                <span>{domain.entries.filter((entry) => entry.tier === "stable").length} {text.stable}</span>
                <span>{domain.entries.filter((entry) => entry.tier === "candidate").length} {text.candidate}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.ontologyLayout}>
        <section className={styles.ontologyPanel} aria-labelledby="ontology-slice-title">
          <div className={styles.sectionHeaderCompact}>
            <div>
              <span className={styles.sectionKicker}>{text.ontologyKicker}</span>
              <h2 id="ontology-slice-title">{text.ontologyHeading}</h2>
            </div>
            <p>{text.ontologyNote}</p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>{text.componentType}</th>
                  <th>{text.coverage}</th>
                  <th>{text.maturity}</th>
                  <th>{locale === "zh" ? "来源标签" : "Source tags"}</th>
                  <th aria-label={text.inspect} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.category}>
                    <th scope="row"><span className={styles.typeDot} />{row.category}</th>
                    <td><strong>{row.count}</strong> <span className={styles.muted}>{text.entries}</span><small>{row.medical} {locale === "zh" ? "医疗" : "medical"}</small></td>
                    <td><span className={styles.maturity}>{row.maturity}</span></td>
                    <td>
                      <div className={styles.tableTags}>
                        {row.topics.length > 0 ? row.topics.map((topic) => <span key={topic}>{topic}</span>) : <span className={styles.muted}>{text.noTopic}</span>}
                      </div>
                    </td>
                    <td><ChevronRight size={16} aria-hidden="true" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className={styles.metadataPanel} aria-labelledby="metadata-affordance-title">
          <div className={styles.metadataIcon} aria-hidden="true"><BookOpen size={20} /></div>
          <span className={styles.sectionKicker}>{text.metadataKicker}</span>
          <h2 id="metadata-affordance-title">{text.metadataHeading}</h2>
          <p>{text.metadataBody}</p>
          <dl className={styles.metadataStats}>
            <div><dt>{locale === "zh" ? "条目" : "Entries"}</dt><dd>{catalog.entries.length}</dd></div>
            <div><dt>{locale === "zh" ? "标签覆盖" : "Tag coverage"}</dt><dd>{metadataCoverage}%</dd></div>
            <div><dt>{locale === "zh" ? "评分" : "Quality score"}</dt><dd className={styles.notEvaluated}>{locale === "zh" ? "未评测" : "Not evaluated"}</dd></div>
          </dl>
          <Link className={styles.metadataLink} href={`/${locale}/concepts/registry`}>{text.openRegistry}<ArrowUpRight size={15} aria-hidden="true" /></Link>
        </aside>
      </div>

      <aside className={styles.futurePanel}>
        <div className={styles.futureMark} aria-hidden="true"><Layers3 size={18} /></div>
        <div>
          <span className={styles.sectionKicker}>{text.future}</span>
          <p>{text.futureBody}</p>
        </div>
      </aside>
    </main>
  );
}
