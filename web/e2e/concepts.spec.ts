import { expect, test } from "@playwright/test";

const concepts = [
  { slug: "registry", marker: /academic registry|research registry|研究型|学术/i },
  { slug: "domain-atlas", marker: /domain atlas|popular domains|领域/i },
  { slug: "quality-lab", marker: /quality lab|proposed.*rubric|质控|评测/i },
  { slug: "composition-studio", marker: /composition studio|future composition|组合|编排/i },
];

test("concept hub exposes four distinct desktop directions and a local ballot", async ({ page }) => {
  await page.goto("/en/concepts");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(/concept|direction|方案|设计/i);
  await expect(page.getByRole("radio")).toHaveCount(4);
  await expect(page.getByText(/local[- ]only|no shared backend|仅本地|不会提交/i)).toBeVisible();

  for (const { slug } of concepts) {
    await expect(page.locator(`a[href^="/en/concepts/${slug}"]`)).toBeVisible();
  }
});

for (const { slug, marker } of concepts) {
  test(`renders ${slug} as an independently addressable prototype`, async ({ page }) => {
    await page.goto(`/en/concepts/${slug}`);
    await expect(page).toHaveURL(new RegExp(`/en/concepts/${slug}/?$`));
    await expect(page.getByRole("main")).toContainText(marker);
    await expect(page.getByText(/prototype|concept preview|原型/i).first()).toBeVisible();
  });
}

test("Chinese concept hub remains available for the meeting", async ({ page }) => {
  await page.goto("/zh/concepts");
  await expect(page).toHaveURL(/\/zh\/concepts\/?$/);
  await expect(page.getByRole("radio")).toHaveCount(4);
  await expect(page.getByText(/本地投票|未连接共享后台/).first()).toBeVisible();
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
  await page.goto("/en/concepts/quality-lab/");
  await expect(page.getByRole("main")).toContainText(/marketplace lens|same marketplace records/i);
  await expect(page.getByRole("main")).not.toContainText(/priority review queue|review queue/i);
  await page.goto("/en/concepts/composition-studio/");
  await expect(page.getByRole("main")).toContainText(/component listings|future pack affordance/i);
  await expect(page.getByRole("main")).toContainText(/8\s*featured listings.*20/i);
  await expect(page.getByRole("main")).not.toContainText(/discovery.*analysis.*research output/i);
});
