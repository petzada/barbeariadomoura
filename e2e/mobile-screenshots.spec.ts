import { test } from "@playwright/test";

/**
 * Screenshot tests for visual regression detection.
 * These capture screenshots of key pages at each mobile viewport
 * for manual review and future regression comparison.
 */

const screenshotPages = [
  { path: "/", name: "landing" },
  { path: "/login", name: "login" },
  { path: "/cadastro", name: "cadastro" },
  { path: "/esqueci-senha", name: "esqueci-senha" },
  { path: "/sobre/profissionais", name: "profissionais-publico" },
  { path: "/sobre/servicos", name: "servicos-publico" },
  { path: "/sobre/clube", name: "clube-publico" },
];

test.describe("Visual Regression Screenshots", () => {
  for (const pageInfo of screenshotPages) {
    test(`screenshot ${pageInfo.name}`, async ({ page }, testInfo) => {
      await page.goto(pageInfo.path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000); // Wait for animations

      const viewport = page.viewportSize()!;
      const vpName = `${viewport.width}x${viewport.height}`;

      await page.screenshot({
        path: `e2e/screenshots/${vpName}-${pageInfo.name}.png`,
        fullPage: true,
      });

      // Also capture above-the-fold only
      await page.screenshot({
        path: `e2e/screenshots/${vpName}-${pageInfo.name}-fold.png`,
        fullPage: false,
      });

      // Attach to test report
      const screenshot = await page.screenshot({ fullPage: false });
      await testInfo.attach(`${vpName}-${pageInfo.name}`, {
        body: screenshot,
        contentType: "image/png",
      });
    });
  }
});
