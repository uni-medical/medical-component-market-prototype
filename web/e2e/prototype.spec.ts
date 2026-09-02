import { expect, test } from "@playwright/test";

test("English directory, detail, and Chinese route are navigable", async ({ page }) => {
  await page.goto("/en/");
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A research-oriented registry for medical AI components",
  );
  await expect(page.getByRole("searchbox")).toBeDisabled();
  await expect(page.getByTestId("catalog-entry")).toHaveCount(20);

  await page.getByTestId("catalog-entry").first().getByRole("link").first().click();
  await expect(page).toHaveURL(/\/en\/entries\/[^/]+\/[^/]+\/?$/);
  await expect(page.getByRole("link", { name: "Open repository" })).toBeVisible();

  await page.getByRole("link", { name: "中文" }).click();
  await expect(page).toHaveURL(/\/zh\/entries\//);
  await expect(page.getByText("数据来源与边界")).toBeVisible();
});

test("mobile layout does not overflow and keeps the disclosure visible", async ({ page }) => {
  await page.goto("/zh");
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  await expect(page.getByText(/收录仅表示可能与医疗 AI 工作流相关/)).toBeVisible();
});
