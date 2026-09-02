import { render, screen } from "@testing-library/react";
import rawCatalog from "@/data/prototype-catalog.json";
import { EntryDetail } from "@/components/entry-detail";
import { parseCatalogIndex } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

describe("entry detail", () => {
  it("shows source context and avoids unsupported assurance claims", () => {
    const entry = parseCatalogIndex(rawCatalog).entries[0];
    render(
      <EntryDetail
        dictionary={getDictionary("en")}
        entry={entry}
        locale="en"
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(entry.fullName);
    expect(screen.getByRole("link", { name: /open repository/i })).toHaveAttribute(
      "href",
      entry.repositoryUrl,
    );
    expect(screen.getAllByText(/does not constitute/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/^verified$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/quality score/i)).not.toBeInTheDocument();
  });

  it("renders candidate fallbacks and classification drift without inventing metadata", () => {
    const candidate = parseCatalogIndex(rawCatalog).entries.find(
      (entry) => entry.tier === "candidate",
    );
    expect(candidate).toBeDefined();

    render(
      <EntryDetail
        dictionary={getDictionary("en")}
        entry={{
          ...candidate!,
          homepageUrl: null,
          topics: [],
          categoryDrift: {
            stableCategory: "Tool",
            automationCategory: "MCP Server",
          },
        }}
        locale="en"
      />,
    );

    expect(screen.getByText(/present only in the automated discovery feed/i)).toBeVisible();
    expect(screen.getByText(/Tool → MCP Server/)).toBeVisible();
    expect(screen.getByText(/No source topics were provided/)).toBeVisible();
    expect(screen.queryByRole("link", { name: /open homepage/i })).not.toBeInTheDocument();
  });

  it("localizes structural evidence labels on the Chinese detail page", () => {
    const entry = parseCatalogIndex(rawCatalog).entries[0];
    render(
      <EntryDetail
        dictionary={getDictionary("zh")}
        entry={entry}
        locale="zh"
      />,
    );

    expect(screen.getByText("仓库观测")).toBeVisible();
    expect(screen.getByRole("heading", { name: "元数据" })).toBeVisible();
    expect(screen.getByText("使用前阅读")).toBeVisible();
    expect(screen.queryByText("Repository observation")).not.toBeInTheDocument();
  });
});
