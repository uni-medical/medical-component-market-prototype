export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

const dictionaries = {
  en: {
    localeName: "English",
    alternateLocaleName: "中文",
    brand: "Medical AI Component Market",
    brandShort: "Medical Component Market",
    navigation: {
      directory: "Directory",
      methodology: "Methodology",
      concepts: "Browse views",
    },
    labels: {
      trustedDirectory: "Research-oriented component registry",
      evidenceFacets: "Catalog taxonomy",
      sourceAwareIndex: "Source-aware index",
      stable: "Stable",
      candidate: "Candidate",
      medical: "Medical",
      general: "General",
      repositoryObservation: "Repository observation",
      metadata: "Metadata",
      readBeforeAdoption: "Read before adoption",
      sourceVocabulary: "Source vocabulary",
      noSourceTopics: "No source topics were provided.",
      reproducibleFixture: "Reproducible fixture",
    },
    prototypeLabel: "Prototype",
    heroEyebrow: "Research Software · Agent Skills · Tools · MCP Servers · CLI",
    heroTitle: "A research-oriented registry for medical AI components.",
    heroDescription:
      "A structured catalog of reusable components for medical research and AI for Health, with explicit provenance, licensing, domain scope, and review status.",
    heroPillarsLabel: "Component market capabilities",
    heroPillars: ["Structured taxonomy", "Traceable metadata", "Reviewable sources"],
    searchLabel: "Search the research registry",
    searchPlaceholder: "Search the component registry…",
    searchStatus: "Full-text search arrives when the complete component index is connected.",
    dataPulse: "Prototype registry snapshot",
    summary: {
      total: "Indexed components",
      stable: "Stable",
      candidate: "Candidate",
      medical: "Medical",
      generated: "Observed",
    },
    filtersTitle: "Explore the taxonomy",
    filterPrototype: "Filters activate in the connected-data phase.",
    filterGroups: {
      tier: "Data tier",
      type: "Component type",
      domain: "Domain",
      license: "License",
      language: "Language",
      tag: "Tag",
    },
    resultsTitle: "Registry candidates",
    resultsDescription: "Twenty real repositories sampled to evaluate taxonomy, metadata completeness, and provenance—not as medical, safety, or compatibility endorsements.",
    resultCount: "20 candidates",
    mobileFilters: "Preview filters",
    noDescription: "No source description is available for this entry.",
    source: "Source",
    observed: "Observed",
    updated: "Repository updated",
    openEntry: "Open entry",
    openRepository: "Open repository",
    openHomepage: "Open homepage",
    backToDirectory: "Back to directory",
    dataBoundaries: "Data source & boundaries",
    details: {
      tier: "Data tier",
      categories: "Categories",
      domains: "Domains",
      stars: "GitHub stars",
      license: "License",
      language: "Language",
      source: "Discovery source",
      snapshot: "Source snapshot",
      drift: "Classification drift",
      topics: "Topics",
    },
    stableDefinition:
      "Stable means the entry appears in the reviewed main snapshot. It is not a verification badge.",
    candidateDefinition:
      "Candidate means the entry is present only in the automated discovery feed and needs further review.",
    driftDefinition:
      "The automated feed currently assigns a different component category. The stable category remains authoritative in this prototype.",
    disclosure:
      "Inclusion indicates possible relevance to medical AI workflows. It does not constitute medical validation, security review, or proof of compatibility. Inspect the source, license, data flow, and claims before use.",
    methodology: {
      eyebrow: "Taxonomy · provenance · review",
      title: "A research registry requires explicit metadata.",
      intro:
        "This prototype treats component discovery as a structured research-catalog problem: each record retains scope, provenance, licensing, source maturity, and review boundaries.",
      sections: [
        {
          number: "01",
          title: "Taxonomy & scope",
          body: "Consistent component types, domain labels, descriptions, and source vocabulary define what can be searched and compared across the registry.",
        },
        {
          number: "02",
          title: "Domain relevance",
          body: "Medical and General labels distinguish domain-focused capabilities from reusable infrastructure without implying clinical effectiveness or deployment readiness.",
        },
        {
          number: "03",
          title: "Reusability & interoperability",
          body: "Plugins, skills, tools, MCP servers, CLIs, and research software are compared as reusable units while retaining their original interface, source, and license.",
        },
        {
          number: "04",
          title: "Provenance & review",
          body: "Stable and Candidate describe source maturity, not verification. Popularity and quality metrics remain absent until their methods and data sources are explicit.",
        },
      ],
      provenanceTitle: "Snapshot provenance",
      mainSnapshot: "Main snapshot",
      automationSnapshot: "Automation snapshot",
    },
    footerSource: "A static prototype of a research-oriented medical AI component registry, projected from versioned GitHub metadata.",
  },
  zh: {
    localeName: "中文",
    alternateLocaleName: "English",
    brand: "医疗 AI 组件市场",
    brandShort: "医疗 AI 组件市场",
    navigation: {
      directory: "目录",
      methodology: "方法与边界",
      concepts: "浏览方式",
    },
    labels: {
      trustedDirectory: "面向研究的组件索引",
      evidenceFacets: "目录分类",
      sourceAwareIndex: "来源可追溯索引",
      stable: "稳定层",
      candidate: "候选层",
      medical: "医疗",
      general: "通用",
      repositoryObservation: "仓库观测",
      metadata: "元数据",
      readBeforeAdoption: "使用前阅读",
      sourceVocabulary: "来源标签",
      noSourceTopics: "数据源未提供标签。",
      reproducibleFixture: "可复现原型数据",
    },
    prototypeLabel: "原型",
    heroEyebrow: "Research Software · Agent Skill · Tool · MCP Server · CLI",
    heroTitle: "面向医疗 AI 的研究型组件索引。",
    heroDescription:
      "一个面向医学研究与 AI for Health 的结构化可复用组件目录，明确记录溯源、许可证、领域范围和审核状态。",
    heroPillarsLabel: "组件市场能力",
    heroPillars: ["结构化分类", "可追溯元数据", "可复核来源"],
    searchLabel: "搜索研究型组件索引",
    searchPlaceholder: "搜索组件索引…",
    searchStatus: "完整文本搜索将在接入全量组件索引后开放。",
    dataPulse: "原型索引快照",
    summary: {
      total: "索引组件",
      stable: "稳定层",
      candidate: "候选层",
      medical: "医疗相关",
      generated: "观测日期",
    },
    filtersTitle: "查看分类体系",
    filterPrototype: "筛选功能将在数据接入阶段启用。",
    filterGroups: {
      tier: "数据层级",
      type: "组件类型",
      domain: "领域",
      license: "许可证",
      language: "语言",
      tag: "标签",
    },
    resultsTitle: "组件索引样例",
    resultsDescription: "20 个真实仓库样本，用于评估分类体系、元数据完整性与溯源能力；不构成医疗、安全或兼容性背书。",
    resultCount: "20 个候选",
    mobileFilters: "查看筛选原型",
    noDescription: "数据源未提供该条目的描述。",
    source: "来源",
    observed: "观测时间",
    updated: "仓库更新",
    openEntry: "查看条目",
    openRepository: "打开代码仓库",
    openHomepage: "打开项目主页",
    backToDirectory: "返回目录",
    dataBoundaries: "数据来源与边界",
    details: {
      tier: "数据层级",
      categories: "组件类型",
      domains: "领域",
      stars: "GitHub Star",
      license: "许可证",
      language: "语言",
      source: "发现来源",
      snapshot: "数据快照",
      drift: "分类漂移",
      topics: "标签",
    },
    stableDefinition:
      "稳定层表示该条目已出现在 main 快照中，不代表已获验证。",
    candidateDefinition:
      "候选层表示该条目仅来自自动发现流，仍需后续复核。",
    driftDefinition:
      "自动数据流当前给出了不同组件分类；本原型仍以稳定快照分类为准。",
    disclosure:
      "收录仅表示可能与医疗 AI 工作流相关，不构成医疗有效性验证、安全审查或兼容性证明。使用前应检查源码、许可证、数据流和项目声明。",
    methodology: {
      eyebrow: "分类体系 · 溯源 · 审核",
      title: "研究型组件索引需要明确的元数据。",
      intro:
        "本原型将组件发现视为结构化研究目录问题：每条记录保留领域范围、溯源、许可证、数据源成熟度和审核边界。",
      sections: [
        {
          number: "01",
          title: "分类体系与范围",
          body: "一致的组件类型、领域标签、描述和来源词汇定义了索引中哪些内容可被搜索与比较。",
        },
        {
          number: "02",
          title: "领域相关性",
          body: "Medical 和 General 标签用于区分领域能力与通用基础组件，不表示临床有效性或已可部署。",
        },
        {
          number: "03",
          title: "可复用性与互操作性",
          body: "Plugin、Skill、Tool、MCP Server、CLI 和研究软件可作为可复用单元进行比较，同时保留原始接口、来源和许可证。",
        },
        {
          number: "04",
          title: "溯源与审核",
          body: "Stable 和 Candidate 只描述数据源成熟度，不代表验证状态。在方法和数据源明确前，不展示流行度或质量指标。",
        },
      ],
      provenanceTitle: "快照溯源",
      mainSnapshot: "Main 快照",
      automationSnapshot: "Automation 快照",
    },
    footerSource: "基于 GitHub 版本化元数据的研究型医疗 AI 组件索引静态原型。",
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en";
}
