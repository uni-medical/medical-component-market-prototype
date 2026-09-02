import { render, screen } from "@testing-library/react";
import rawCatalog from "@/data/prototype-catalog.json";
import { MethodologyView } from "@/components/methodology-view";
import { parseCatalogIndex } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

describe("methodology view", () => {
  it("explains the evidence tiers and publishes exact source snapshots", () => {
    const catalog = parseCatalogIndex(rawCatalog);
    render(
      <MethodologyView
        catalog={catalog}
        dictionary={getDictionary("en")}
        locale="en"
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /research registry requires explicit metadata/i,
    );
    expect(screen.getByRole("heading", { name: /Taxonomy & scope/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /Domain relevance/i })).toBeVisible();
    expect(document.body.textContent).not.toMatch(/\bRSI\b|recursive self-improvement/i);
    expect(screen.getByText(catalog.sourceSnapshots.main)).toBeVisible();
    expect(screen.getByText(catalog.sourceSnapshots.automation)).toBeVisible();
    expect(screen.getByRole("link", { name: /中文/i })).toHaveAttribute(
      "href",
      "/zh/methodology",
    );
  });

  it("uses localized provenance copy in Chinese", () => {
    const catalog = parseCatalogIndex(rawCatalog);
    render(
      <MethodologyView
        catalog={catalog}
        dictionary={getDictionary("zh")}
        locale="zh"
      />,
    );

    expect(screen.getByText("可复现原型数据")).toBeVisible();
    expect(screen.queryByText("Reproducible fixture")).not.toBeInTheDocument();
  });
});
