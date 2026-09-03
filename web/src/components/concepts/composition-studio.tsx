import Link from "next/link";
import { ArrowUpRight, Boxes, GitBranch, PackageOpen, Sparkles, Star } from "lucide-react";
import type { CatalogEntry, CatalogIndex } from "@/lib/catalog";
import { entryHref, formatStars } from "@/lib/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import styles from "./composition-studio.module.css";

interface CompositionStudioProps {
  catalog: Pick<CatalogIndex, "entries"> | CatalogEntry[];
  locale: Locale;
  dictionary?: Dictionary;
}

const copy = {
  en: {
    eyebrow: "Concept D · Composition Studio · marketplace skin",
    title: "A pack-ready marketplace for reusable components.",
    intro: "The same component listings as the registry, presented with a softer collection-oriented visual language. Grouping is a future affordance, not an execution screen.",
    prototype: "Prototype · visual direction",
    listingKicker: "01 / component listings",
    listingTitle: "Browse reusable components",
    listingHint: "Same fields, same source boundaries, different marketplace presentation.",
    packKicker: "02 / future pack affordance",
    packTitle: "Collections can come later",
    packBody: "A future release could let researchers save a few listings as a citable pack. This prototype does not install, connect, or execute components.",
    open: "Open entry",
    topics: "tags",
    noTopics: "No source tags",
    source: "source",
    type: "type",
    stars: "stars",
    license: "license",
    domain: "domain",
    updated: "updated",
    featured: "featured listings",
    stable: "Stable",
    candidate: "Candidate",
    packReady: "Pack-ready metadata",
  },
  zh: {
    eyebrow: "方案 D · Composition Studio · marketplace 皮肤",
    title: "面向可复用组件的组件包市场视图。",
    intro: "与登记册使用同一批组件条目，只用更偏 collection 的视觉语言呈现。组合是未来入口，不是当前执行界面。",
    prototype: "原型 · 外观方向",
    listingKicker: "01 / 组件条目",
    listingTitle: "浏览可复用组件",
    listingHint: "同样的字段、同样的来源边界，只改变 marketplace 的呈现方式。",
    packKicker: "02 / 未来组件包入口",
    packTitle: "未来可以保存组件包",
    packBody: "后续可以让研究者把几个条目保存为可引用的组件包。本原型不会安装、连接或执行组件。",
    open: "查看条目",
    topics: "标签",
    noTopics: "数据源未提供标签",
    source: "来源",
    type: "类型",
    stars: "Star",
    license: "许可证",
    domain: "领域",
    updated: "更新时间",
    featured: "条精选记录",
    stable: "稳定层",
    candidate: "候选层",
    packReady: "可进入组件包的元数据",
  },
} as const;

function getEntries(catalog: CompositionStudioProps["catalog"]): CatalogEntry[] {
  return Array.isArray(catalog) ? catalog : catalog.entries;
}

function ListingCard({ entry, locale }: { entry: CatalogEntry; locale: Locale }) {
  const text = copy[locale];
  const topics = entry.topics.length > 0 ? entry.topics.slice(0, 3) : [text.noTopics];
  return (
    <article className={styles.listingCard}>
      <div className={styles.listingTopline}>
        <span className={styles.listingIcon} aria-hidden="true"><PackageOpen size={17} /></span>
        <span className={entry.tier === "stable" ? styles.tierStable : styles.tierCandidate}>{entry.tier === "stable" ? text.stable : text.candidate}</span>
        <span className={styles.listingType}>{entry.primaryCategory}</span>
      </div>
      <span className={styles.listingOwner}>{entry.fullName.split("/")[0]}</span>
      <h3>{entry.fullName.split("/")[1] ?? entry.fullName}</h3>
      <p>{entry.description ?? (locale === "zh" ? "数据源未提供描述。" : "No source description provided.")}</p>
      <dl className={styles.listingMeta}>
        <div><dt>{text.stars}</dt><dd><Star size={12} aria-hidden="true" />{formatStars(entry.stars)}</dd></div>
        <div><dt>{text.type}</dt><dd>{entry.primaryCategory}</dd></div>
        <div><dt>{text.source}</dt><dd>{entry.source}</dd></div>
        <div><dt>{text.license}</dt><dd>{entry.license}</dd></div>
        <div><dt>{text.domain}</dt><dd>{entry.domains.join(" · ")}</dd></div>
        <div><dt>{text.updated}</dt><dd>{new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(entry.updatedAt))}</dd></div>
      </dl>
      <div className={styles.listingFooter}>
        <div className={styles.listingTags} aria-label={text.topics}>{topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
        <Link href={entryHref(locale, entry)}>{text.open}<ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

export function CompositionStudio({ catalog, locale }: CompositionStudioProps) {
  const text = copy[locale];
  const entries = getEntries(catalog);
  const listings = [...entries].sort((a, b) => b.stars - a.stars || a.fullName.localeCompare(b.fullName)).slice(0, 8);

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="composition-title">
        <div className={styles.heroGrid} aria-hidden="true" /><div className={styles.heroOrb} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrowRow}><span className={styles.eyebrow}>{text.eyebrow}</span><span className={styles.proposedBadge}><Sparkles size={13} aria-hidden="true" /> {text.prototype}</span></div>
          <h1 id="composition-title">{text.title}</h1><p>{text.intro}</p>
        </div>
        <aside className={styles.contextNote}><div className={styles.contextIcon} aria-hidden="true"><Boxes size={18} /></div><div><span>{text.packReady}</span><p>{text.listingHint}</p></div></aside>
      </section>

      <section className={styles.marketSection} aria-labelledby="listing-title">
        <div className={styles.sectionHeader}><div><span className={styles.kicker}>{text.listingKicker}</span><h2 id="listing-title">{text.listingTitle}</h2><p>{text.listingHint}</p></div><div className={styles.marketCount}><GitBranch size={15} aria-hidden="true" /><strong>{listings.length}</strong><span>{text.featured} / {entries.length}</span></div></div>
        <div className={styles.listingGrid}>{listings.map((entry) => <ListingCard entry={entry} key={entry.id} locale={locale} />)}</div>
      </section>

      <aside className={styles.packCallout} role="note"><div className={styles.packIcon} aria-hidden="true"><PackageOpen size={19} /></div><div><span className={styles.kicker}>{text.packKicker}</span><h2>{text.packTitle}</h2><p>{text.packBody}</p></div></aside>
    </main>
  );
}
