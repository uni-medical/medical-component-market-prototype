import { render, screen } from "@testing-library/react";
import rawCatalog from "@/data/prototype-catalog.json";
import { CatalogShell } from "@/components/catalog-shell";
import { getDictionary } from "@/lib/i18n";
import { parseCatalogIndex } from "@/lib/catalog";

describe("catalog prototype shell", () => {
  it("presents the directory as an honest, non-functional prototype", () => {
    render(
      <CatalogShell
        catalog={parseCatalogIndex(rawCatalog)}
        dictionary={getDictionary("en")}
        locale="en"
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /research-oriented registry.*medical AI components/i,
    );
    expect(screen.getByText(/Medical Component Market/i)).toBeVisible();
    expect(screen.getByText("Prototype")).toBeVisible();
    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.getByRole("link", { name: /methodology/i })).toHaveAttribute(
      "href",
      "/en/methodology",
    );
    expect(screen.getByRole("link", { name: /中文/i })).toHaveAttribute(
      "href",
      "/zh",
    );
    expect(screen.getAllByTestId("catalog-entry")).toHaveLength(20);
    expect(screen.queryByText(/download(s)?/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/quality score/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^verified$/i)).not.toBeInTheDocument();
    expect(document.querySelector(".hero__component-loop")).toHaveAttribute("aria-hidden", "true");
    expect(document.body.textContent).not.toMatch(/\bRSI\b|recursive self-improvement/i);
  });

  it("exposes all planned filter groups without pretending they work", () => {
    render(
      <CatalogShell
        catalog={parseCatalogIndex(rawCatalog)}
        dictionary={getDictionary("zh")}
        locale="zh"
      />,
    );

    for (const label of ["数据层级", "组件类型", "领域", "许可证", "语言", "标签"]) {
      expect(screen.getByText(label)).toBeVisible();
    }
    expect(screen.getByText("目录分类")).toBeVisible();
    expect(screen.getByText("来源可追溯索引")).toBeVisible();
    expect(screen.getAllByText("稳定层").length).toBeGreaterThan(0);
    expect(screen.queryByText("Evidence facets")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "面向医疗 AI 的研究型组件索引",
    );
    expect(screen.getAllByText(/组件索引样例/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText("组件市场能力")).toBeVisible();
    expect(document.body.textContent).not.toMatch(/RSI|递归自我改进/i);
    expect(screen.getByText(/筛选功能将在数据接入阶段启用/)).toBeVisible();
  });
});
