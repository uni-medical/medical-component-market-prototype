import { expect, test } from "@playwright/test";

const concepts = [
  { slug: "registry", marker: /academic registry|research registry|研究型|学术/i },
  { slug: "domain-atlas", marker: /domain atlas|popular domains|领域/i },
  { slug: "ecosystem-showcase", marker: /everything is a component|ecosystem domains|生态展示/i },
  { slug: "composition-studio", marker: /composition studio|future composition|组合|编排/i },
];

test("concept hub presents four product-facing browse views", async ({ page }) => {
  await page.goto("/en/concepts");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Explore components/i);
  await expect(page.getByRole("radio")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/shared component index|tomorrow|meeting ballot|local-only|backend|fixture/i);

  for (const { slug } of concepts) {
    await expect(page.locator(`a[href^="/en/concepts/${slug}"]`)).toBeVisible();
  }
});

for (const { slug, marker } of concepts) {
  test(`renders ${slug} as an independently addressable prototype`, async ({ page }) => {
    await page.goto(`/en/concepts/${slug}`);
    await expect(page).toHaveURL(new RegExp(`/en/concepts/${slug}/?$`));
    await expect(page.getByRole("main")).toContainText(marker);
  await expect(page.getByText(/preview|prototype|concept preview|预览|原型/i).first()).toBeVisible();
  });
}

test("Chinese concept hub presents product-facing browse views", async ({ page }) => {
  await page.goto("/zh/concepts");
  await expect(page).toHaveURL(/\/zh\/concepts\/?$/);
  await expect(page.getByRole("radio")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/探索医疗 AI 组件/);
  await expect(page.locator("main")).not.toContainText(/共用|明天|会议|投票|后台|fixture/i);
});

test("Chinese concept detail keeps its localized title and route", async ({ page }) => {
  await page.goto("/zh/concepts/domain-atlas");
  await expect(page).toHaveTitle(/领域图谱/);
  await expect(page.getByRole("link", { name: /English/i })).toHaveAttribute(
    "href",
    "/en/concepts/domain-atlas/",
  );
});

test("quality and composition concepts explain their marketplace relationship", async ({ page }) => {
  await page.goto("/en/concepts/composition-studio/");
  await expect(page.getByRole("main")).toContainText(/component listings|future pack affordance/i);
  await expect(page.getByRole("main")).toContainText(/8\s*featured listings.*20/i);
  await expect(page.getByRole("main")).not.toContainText(/discovery.*analysis.*research output/i);
});

test("ecosystem showcase presents a medical-first market without validation claims", async ({ page }) => {
  await page.goto("/en/concepts/ecosystem-showcase/");
  await expect(page.locator(".concept-page--ecosystem")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Every component is a starting point/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /A component market for medical AI research/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Five types, one medical-first view/i })).toBeVisible();
  await expect(page.locator('[class*="entryCard"] code')).toHaveText(["Plugin", "Skill", "Tool", "MCP Server", "CLI"]);
  await expect(page.getByRole("main")).not.toContainText(/Quality Lab|Priority review queue|Quality Score|Verified|Downloads/i);
  await expect(page.locator(".concept-page--ecosystem")).toHaveCSS("background-color", "rgb(10, 10, 10)");
});

test("ecosystem showcase keeps links local or repository-scoped and does not call GitHub at runtime", async ({ page }) => {
  const githubRequests: string[] = [];
  page.on("request", (request) => {
    if (/api\.github\.com|github\.com\/search/i.test(request.url())) githubRequests.push(request.url());
  });
  await page.goto("/zh/concepts/ecosystem-showcase/");
  await expect(page.getByRole("heading", { name: /每个组件都是入口，每条记录都可追溯/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /五种类型，一套医疗优先视图/ })).toBeVisible();
  await expect(page.locator('[class*="entryCard"]')).toHaveCount(5);
  expect(githubRequests).toEqual([]);
});

test("other concept routes do not receive the ecosystem theme", async ({ page }) => {
  for (const slug of ["registry", "domain-atlas", "composition-studio"]) {
    await page.goto(`/en/concepts/${slug}/`);
    await expect(page.locator(".concept-page--ecosystem")).toHaveCount(0);
  }
});
