import Link from "next/link";
import { ArrowUpRight, Boxes, Compass, GitBranch, Sparkles, Star } from "lucide-react";
import type { CatalogIndex, CatalogEntry } from "@/lib/catalog";
import { entryHref, formatStars } from "@/lib/catalog";
import { deriveDomainSignals } from "@/lib/concepts";
import type { Locale } from "@/lib/i18n";
import styles from "./ecosystem-showcase.module.css";

const copy = {
  en: { eyebrow: "Concept C · ecosystem marketplace", title: "Everything is a component. Every record is traceable.", intro: "A product-led view of the same catalog: discover a domain, scan featured components, and follow each record back to its public source.", prototype: "Prototype · visual direction", domains: "Ecosystem domains", domainsNote: "Fixture-derived coverage, not popularity or quality scores.", featured: "Featured components", featuredNote: "The listing data is unchanged; only the marketplace skin changes.", open: "Open entry", records: "records", snapshots: "public snapshots", source: "source", stable: "Stable", candidate: "Candidate", boundary: "Evidence boundary", boundaryBody: "Stable and Candidate describe snapshot provenance only. Neither label implies medical validity, security review, compatibility, or a quality score." },
  zh: { eyebrow: "方案 C · 生态展示市场", title: "每个条目都是组件，每条记录都可追溯。", intro: "以产品化生态视角浏览同一份目录：先发现研究领域，再查看代表组件，并沿着公开来源回到原始仓库。", prototype: "原型 · 外观方向", domains: "生态领域", domainsNote: "数量来自 fixture 覆盖，不代表流行度或质量评分。", featured: "代表组件", featuredNote: "条目数据保持不变，只替换 marketplace 外观。", open: "查看条目", records: "条记录", snapshots: "公开快照", source: "来源", stable: "稳定层", candidate: "候选层", boundary: "证据边界", boundaryBody: "稳定层与候选层只描述快照来源，不代表医疗有效性、安全审查、兼容性或质量评分。" },
} as const;

function shortName(entry: CatalogEntry) { return entry.fullName.split("/")[1] ?? entry.fullName; }

export function EcosystemShowcase({ catalog, locale }: { catalog: CatalogIndex; locale: Locale }) {
  const text = copy[locale];
  const domains = deriveDomainSignals(catalog.entries).slice(0, 4);
  const entries = [...catalog.entries].sort((a, b) => b.stars - a.stars || a.fullName.localeCompare(b.fullName)).slice(0, 6);
  const domainDescriptionZh: Record<string, string> = { "Medical research": "临床、生物医学与生命科学工作流", "Agent infrastructure": "面向 Agent 的 Skill、Plugin 与工具调用接口", "MCP & integration": "连接组件与外部系统的协议和接口", "Scientific discovery": "面向研究探索的证据检索与分析工具", "Developer tooling": "用于构建 AI 应用的 CLI 与本地开发工具" };
  return <main className={styles.page} aria-labelledby="ecosystem-title">
    <section className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" /><div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroCopy}><div className={styles.eyebrowRow}><span>{text.eyebrow}</span><b><Sparkles size={13} aria-hidden="true" /> {text.prototype}</b></div><h1 id="ecosystem-title">{text.title}</h1><p>{text.intro}</p><div className={styles.heroStats}><span><strong>{catalog.entries.length}</strong> {text.records}</span><span><GitBranch size={15} aria-hidden="true" /> {text.snapshots}</span></div></div>
      <aside className={styles.heroAside}><Compass size={20} aria-hidden="true" /><strong>{locale === "zh" ? "从领域开始" : "Start with a domain"}</strong><span>{locale === "zh" ? "再回到可核验的条目" : "Then return to a traceable entry"}</span></aside>
    </section>
    <section className={styles.section} aria-labelledby="ecosystem-domains-title"><div className={styles.sectionHead}><div><span className={styles.kicker}>01 / {text.domains}</span><h2 id="ecosystem-domains-title">{text.domains}</h2><p>{text.domainsNote}</p></div></div><div className={styles.domainGrid}>{domains.map((domain, index) => <article className={`${styles.domainCard} ${styles[`accent${index}`]}`} key={domain.id}><span>0{index + 1}</span><h3>{locale === "zh" ? ({ "Medical research": "医疗研究", "Agent infrastructure": "Agent 基础设施", "MCP & integration": "MCP 与集成", "Scientific discovery": "科学发现", "Developer tooling": "开发者工具链" } as Record<string,string>)[domain.label] ?? domain.label : domain.label}</h3><p>{locale === "zh" ? domainDescriptionZh[domain.label] ?? domain.description : domain.description}</p><strong>{domain.count} {text.records}</strong></article>)}</div></section>
    <section className={styles.section} aria-labelledby="ecosystem-featured-title"><div className={styles.sectionHead}><div><span className={styles.kicker}>02 / {text.featured}</span><h2 id="ecosystem-featured-title">{text.featured}</h2><p>{text.featuredNote}</p></div><Boxes size={22} aria-hidden="true" /></div><div className={styles.entryList}>{entries.map((entry, index) => <article className={styles.entry} key={entry.id}><span className={styles.entryNumber}>0{index + 1}</span><div className={styles.entryMain}><div className={styles.entryTop}><span className={entry.tier === "stable" ? styles.stable : styles.candidate}>{entry.tier === "stable" ? text.stable : text.candidate}</span><code>{entry.primaryCategory}</code><small>{entry.source}</small></div><h3>{shortName(entry)}</h3><p>{entry.description ?? (locale === "zh" ? "数据源未提供描述。" : "No source description provided.")}</p><div className={styles.entryMeta}><span><Star size={13} aria-hidden="true" /> {formatStars(entry.stars)}</span><span>{entry.domains.join(" · ")}</span><span>{entry.license}</span></div></div><Link href={entryHref(locale, entry)} aria-label={`${text.open}: ${entry.fullName}`}><ArrowUpRight size={18} aria-hidden="true" /></Link></article>)}</div></section>
    <aside className={styles.boundary} role="note"><span className={styles.boundaryIcon} aria-hidden="true"><GitBranch size={18} /></span><div><span className={styles.kicker}>03 / {text.boundary}</span><h2>{text.boundary}</h2><p>{text.boundaryBody}</p></div></aside>
  </main>;
}
