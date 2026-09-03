import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Boxes,
  CircleDot,
  ExternalLink,
  GitBranch,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import type { CatalogEntry, CatalogIndex } from "@/lib/catalog";
import { entryHref, formatStars } from "@/lib/catalog";
import {
  getEcosystemSummary,
  getMedicalFirstDomainSignals,
  getMedicalFeaturedEntries,
} from "@/lib/concepts";
import type { Locale } from "@/lib/i18n";
import styles from "./ecosystem-showcase.module.css";

interface EcosystemShowcaseProps {
  catalog: CatalogIndex;
  locale: Locale;
}

const copy = {
  en: {
    eyebrow: "Medical component market · visual prototype",
    title: "Every component is a starting point. Every record is traceable.",
    intro:
      "A focused catalogue for medical AI research: begin with a domain, compare public metadata, and follow each component back to its source repository.",
    detail:
      "The market is a static, source-aware prototype. It presents public-safe GitHub metadata without implying installation, execution, or clinical suitability.",
    prototype: "Prototype",
    browse: "Browse medical components",
    methodology: "View methodology",
    snapshot: "Catalog snapshot",
    records: "records",
    medical: "medical",
    types: "component types",
    stable: "Stable records",
    candidate: "Candidate records",
    publicSnapshots: "public source snapshots",
    thesisTitle: "A shared market for medical AI research.",
    thesisBody:
      "The visual language is product-led; the evidence boundary remains research-oriented. Every view points back to the same catalogue contract.",
    discover: "Discover by domain",
    discoverBody: "Start from a medical research area or adjacent infrastructure signal.",
    compare: "Compare metadata",
    compareBody: "Read type, description, Star, license, tags, and update context together.",
    trace: "Trace the source",
    traceBody: "Open the repository and inspect the snapshot provenance before reuse.",
    domainsKicker: "02 / domain entry points",
    domainsTitle: "Ecosystem domains",
    domainsBody: "Counts are derived from the 20-record fixture; they describe coverage, not popularity.",
    entriesKicker: "03 / featured records",
    entriesTitle: "Five types, one medical-first view.",
    entriesBody: "One representative record per component type, selected from the same public metadata index.",
    openEntry: "Open entry",
    openRepository: "Open repository",
    tags: "tags",
    noDescription: "No source description provided.",
    noTags: "No source tags",
    boundaryKicker: "04 / evidence boundary",
    boundaryTitle: "A market view is not a validation result.",
    boundaryBody:
      "Stable and Candidate describe snapshot provenance only. Neither label implies medical validity, security review, compatibility, or readiness for clinical use.",
    fixtureNote: "Fixture coverage · no runtime GitHub requests",
  },
  zh: {
    eyebrow: "医疗组件市场 · 视觉原型",
    title: "每个组件都是入口，每条记录都可追溯。",
    intro:
      "面向医疗 AI 研究的聚合目录：从领域开始，比较公开元数据，再沿着来源仓库检查每个组件。",
    detail:
      "这是一个静态、关注来源的市场原型。页面只呈现可公开的 GitHub 元数据，不暗示安装、执行或临床适用性。",
    prototype: "原型",
    browse: "浏览医疗组件",
    methodology: "查看方法说明",
    snapshot: "目录快照",
    records: "条记录",
    medical: "条医疗记录",
    types: "种组件类型",
    stable: "条稳定记录",
    candidate: "条候选记录",
    publicSnapshots: "公开来源快照",
    thesisTitle: "面向医疗 AI 研究的共享组件市场。",
    thesisBody:
      "外观采用产品化生态语言，数据边界保持研究型表达。每个视图都回到同一份目录契约。",
    discover: "按领域发现",
    discoverBody: "从医疗研究方向或相邻的基础设施信号开始浏览。",
    compare: "比较元数据",
    compareBody: "并列阅读类型、描述、Star、许可证、标签和更新时间。",
    trace: "追溯来源",
    traceBody: "打开仓库，在复用前检查来源和快照信息。",
    domainsKicker: "02 / 领域入口",
    domainsTitle: "生态领域入口",
    domainsBody: "数量由 20 条 fixture 推导，只表示覆盖情况，不表示流行度。",
    entriesKicker: "03 / 代表记录",
    entriesTitle: "五种类型，一套医疗优先视图。",
    entriesBody: "每种组件类型选择一条代表记录，数据仍来自同一份公开元数据索引。",
    openEntry: "查看条目",
    openRepository: "打开仓库",
    tags: "标签",
    noDescription: "数据源未提供描述。",
    noTags: "数据源未提供标签",
    boundaryKicker: "04 / 证据边界",
    boundaryTitle: "市场视图不是验证结论。",
    boundaryBody:
      "稳定层与候选层只描述快照来源，不代表医疗有效性、安全审查、兼容性或临床使用准备度。",
    fixtureNote: "Fixture 覆盖 · 运行时不访问 GitHub",
  },
} as const;

const domainLabels: Record<string, string> = {
  "Medical research": "医疗研究",
  "Agent infrastructure": "Agent 基础设施",
  "MCP & integration": "MCP 与集成",
  "Scientific discovery": "科学发现",
  "Developer tooling": "开发者工具链",
};

const domainDescriptions: Record<string, string> = {
  "Medical research": "临床、生物医学与生命科学工作流",
  "Agent infrastructure": "面向 Agent 的 Skill、Plugin 与工具调用接口",
  "MCP & integration": "连接组件与外部系统的协议和接口",
  "Scientific discovery": "面向研究探索的证据检索与分析工具",
  "Developer tooling": "用于构建 AI 应用的 CLI 与本地开发工具",
};

const pillarIcons = [Layers3, Boxes, ShieldCheck] as const;

function localizedDomain(label: string, locale: Locale): string {
  return locale === "zh" ? domainLabels[label] ?? label : label;
}

function localizedDomainDescription(label: string, description: string, locale: Locale): string {
  return locale === "zh" ? domainDescriptions[label] ?? description : description;
}

function localizedEntryDomains(entry: CatalogEntry, locale: Locale): string {
  return entry.domains
    .map((domain) => locale === "zh" ? (domain === "medical" ? "医疗" : "通用") : domain)
    .join(" · ");
}

function dateLabel(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function shortName(entry: CatalogEntry): string {
  return entry.fullName.split("/")[1] ?? entry.fullName;
}

function ownerName(entry: CatalogEntry): string {
  return entry.fullName.split("/")[0] ?? entry.fullName;
}

function topicList(entry: CatalogEntry, fallback: string): string[] {
  return entry.topics.length > 0 ? entry.topics.slice(0, 4) : [fallback];
}

function SnapshotRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.snapshotRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FeaturedEntry({ entry, locale }: { entry: CatalogEntry; locale: Locale }) {
  const text = copy[locale];
  const topics = topicList(entry, text.noTags);
  return (
    <article className={styles.entryCard}>
      <div className={styles.entryIndex} aria-hidden="true">{entry.primaryCategory.slice(0, 1)}</div>
      <div className={styles.entryContent}>
        <div className={styles.entryMetaTop}>
          <span className={entry.tier === "stable" ? styles.stableBadge : styles.candidateBadge}>
            <CircleDot size={11} aria-hidden="true" />
            {entry.tier === "stable" ? text.stable : text.candidate}
          </span>
          <code translate="no">{entry.primaryCategory}</code>
          <span className={styles.entrySource} translate="no">{entry.source}</span>
        </div>
        <p className={styles.entryOwner} translate="no">{ownerName(entry)}</p>
        <h3 translate="no">{shortName(entry)}</h3>
        <p className={styles.entryDescription}>{entry.description ?? text.noDescription}</p>
        <div className={styles.entryStats}>
          <span><Star size={13} aria-hidden="true" /> {formatStars(entry.stars)}</span>
          <span translate="no">{localizedEntryDomains(entry, locale)}</span>
          <span translate="no">{entry.license}</span>
          <time dateTime={entry.updatedAt}>{dateLabel(entry.updatedAt, locale)}</time>
        </div>
        <div className={styles.entryBottom}>
          <div className={styles.entryTags} aria-label={text.tags}>
            {topics.map((topic) => <span key={topic}>{topic}</span>)}
          </div>
          <div className={styles.entryLinks}>
            <Link href={entryHref(locale, entry)} aria-label={`${text.openEntry}: ${entry.fullName}`}>{text.openEntry}<ArrowUpRight size={14} aria-hidden="true" /></Link>
            <a href={entry.repositoryUrl} target="_blank" rel="noopener noreferrer" aria-label={`${text.openRepository}: ${entry.fullName}`}>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export function EcosystemShowcase({ catalog, locale }: EcosystemShowcaseProps) {
  const text = copy[locale];
  const summary = getEcosystemSummary(catalog.entries);
  const domains = getMedicalFirstDomainSignals(catalog.entries);
  const featured = getMedicalFeaturedEntries(catalog.entries);
  const pillars = [
    { title: text.discover, body: text.discoverBody },
    { title: text.compare, body: text.compareBody },
    { title: text.trace, body: text.traceBody },
  ];

  return (
    <main className={styles.page} aria-labelledby="ecosystem-title">
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <div className={styles.eyebrowRow}>
            <span>{text.eyebrow}</span>
            <span className={styles.prototypeBadge}><Sparkles size={12} aria-hidden="true" /> {text.prototype}</span>
          </div>
          <h1 id="ecosystem-title">{text.title}</h1>
          <p className={styles.heroIntro}>{text.intro}</p>
          <p className={styles.heroDetail}>{text.detail}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#featured">
              <Search size={15} aria-hidden="true" /> {text.browse}
            </a>
            <Link className={styles.secondaryAction} href={`/${locale}/methodology`}>
              {text.methodology} <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <aside className={styles.snapshotPanel} aria-label={text.snapshot}>
          <div className={styles.snapshotHeader}><span>{text.snapshot}</span><GitBranch size={16} aria-hidden="true" /></div>
          <div className={styles.snapshotMain}><strong>{summary.total}</strong><span>{text.records}</span></div>
          <div className={styles.snapshotRows}>
            <SnapshotRow label={text.medical} value={summary.medical} />
            <SnapshotRow label={text.types} value={summary.categoryCount} />
            <SnapshotRow label={text.stable} value={summary.stable} />
            <SnapshotRow label={text.candidate} value={summary.candidate} />
          </div>
          <div className={styles.snapshotFooter}><span className={styles.statusDot} aria-hidden="true" />{text.publicSnapshots}</div>
        </aside>
      </section>

      <section className={styles.thesisSection} aria-labelledby="thesis-title">
        <div className={styles.thesisIntro}>
          <span className={styles.glassKicker}>MARKET = DOMAINS + METADATA + SOURCES</span>
          <h2 id="thesis-title">{text.thesisTitle}</h2>
          <p>{text.thesisBody}</p>
        </div>
        <div className={styles.pillarGrid}>
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[index];
            return <article className={styles.pillarCard} key={pillar.title}>
              <Icon size={30} strokeWidth={1.2} aria-hidden="true" />
              <h3>{pillar.title}</h3>
              <span className={styles.pillarIndex}>0{index + 1}</span>
              <p>{pillar.body}</p>
            </article>;
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="domains-title">
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionKicker}>{text.domainsKicker}</span><h2 id="domains-title">{text.domainsTitle}</h2><p>{text.domainsBody}</p></div>
          <span className={styles.sectionRule} aria-hidden="true"><ArrowDown size={16} /></span>
        </div>
        <div className={styles.domainGrid}>
          {domains.map((domain, index) => <article className={styles.domainCard} key={domain.id}>
            <div className={styles.domainTopline}><span>0{index + 1}</span><span>{domain.count} {text.records}</span></div>
            <h3>{localizedDomain(domain.label, locale)}</h3>
            <p>{localizedDomainDescription(domain.label, domain.description, locale)}</p>
            <div className={styles.domainBar} aria-hidden="true"><span style={{ width: `${Math.min(100, Math.max(18, domain.count / Math.max(summary.total, 1) * 100))}%` }} /></div>
          </article>)}
        </div>
      </section>

      <section className={`${styles.section} ${styles.featuredSection}`} id="featured" aria-labelledby="featured-title">
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionKicker}>{text.entriesKicker}</span><h2 id="featured-title">{text.entriesTitle}</h2><p>{text.entriesBody}</p></div>
          <span className={styles.typeLegend}>{summary.categories.length} {text.types}</span>
        </div>
        <div className={styles.entryGrid}>
          {featured.map((entry) => <FeaturedEntry entry={entry} key={entry.id} locale={locale} />)}
        </div>
      </section>

      <aside className={styles.boundary} role="note">
        <div className={styles.boundaryIcon}><ShieldCheck size={22} aria-hidden="true" /></div>
        <div><span className={styles.sectionKicker}>{text.boundaryKicker}</span><h2>{text.boundaryTitle}</h2><p>{text.boundaryBody}</p></div>
      </aside>
      <p className={styles.fixtureNote}>{text.fixtureNote}</p>
    </main>
  );
}
