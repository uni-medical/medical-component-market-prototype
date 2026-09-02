import { alternateLocale, getDictionary, isLocale } from "@/lib/i18n";

describe("bilingual routing", () => {
  it("accepts only the supported locale slugs", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("switches between English and Chinese", () => {
    expect(alternateLocale("en")).toBe("zh");
    expect(alternateLocale("zh")).toBe("en");
  });

  it("provides complete navigation and disclosure copy", () => {
    for (const locale of ["en", "zh"] as const) {
      const dictionary = getDictionary(locale);
      expect(dictionary.navigation.directory).toBeTruthy();
      expect(dictionary.navigation.methodology).toBeTruthy();
      expect(dictionary.disclosure).toBeTruthy();
      expect(dictionary.prototypeLabel).toBeTruthy();
    }
  });

  it("presents a unified medical component market without exposing the RSI agenda", () => {
    const english = getDictionary("en");
    const chinese = getDictionary("zh");

    expect(english.brandShort).toBe("Medical Component Market");
    expect(english.heroTitle).toBe(
      "A research-oriented registry for medical AI components.",
    );
    expect(english.heroEyebrow).toMatch(/Research Software.*Agent Skills.*Tools/i);
    expect(english.heroDescription).toMatch(
      /provenance.*licensing.*domain scope.*review status/i,
    );
    expect(english.heroPillars).toEqual([
      "Structured taxonomy",
      "Traceable metadata",
      "Reviewable sources",
    ]);
    expect(chinese.brandShort).toBe("医疗 AI 组件市场");
    expect(chinese.heroTitle).toBe("面向医疗 AI 的研究型组件索引。");
    expect(JSON.stringify(english)).not.toMatch(/\bRSI\b|recursive self-improvement/i);
    expect(JSON.stringify(chinese)).not.toMatch(/RSI|递归自我改进/i);
  });
});
