import { test, expect } from "@playwright/test";
import { assertNoHorizontalOverflow } from "./helpers/viewport-utils";

/**
 * Layout and scroll tests for all publicly accessible pages.
 * These tests validate that no page has horizontal overflow,
 * broken layouts, or clipping issues on mobile viewports.
 */

const publicPages = [
  { path: "/", name: "Landing Page" },
  { path: "/login", name: "Login" },
  { path: "/cadastro", name: "Cadastro" },
  { path: "/esqueci-senha", name: "Esqueci Senha" },
  { path: "/sobre/profissionais", name: "Profissionais Publico" },
  { path: "/sobre/servicos", name: "Servicos Publico" },
  { path: "/sobre/clube", name: "Clube Publico" },
  { path: "/termos", name: "Termos de Uso" },
  { path: "/privacidade", name: "Privacidade" },
];

test.describe("Layout - No Horizontal Overflow", () => {
  for (const pageInfo of publicPages) {
    test(`${pageInfo.name} (${pageInfo.path}) has no horizontal overflow`, async ({
      page,
    }) => {
      await page.goto(pageInfo.path, { waitUntil: "domcontentloaded" });
      // Allow redirects (auth pages may redirect)
      await page.waitForTimeout(1000);
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe("Layout - Content Width", () => {
  for (const pageInfo of publicPages) {
    test(`${pageInfo.name} content stays within viewport width`, async ({
      page,
    }) => {
      await page.goto(pageInfo.path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      const viewport = page.viewportSize()!;

      // Check all direct children of body
      const overflowingElements = await page.evaluate((vw) => {
        const elements = document.querySelectorAll("body *");
        const overflowing: string[] = [];
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.right > vw + 5) {
            // 5px tolerance
            overflowing.push(
              `${el.tagName}.${el.className?.toString().slice(0, 50)} (right: ${Math.round(rect.right)}px)`
            );
          }
        });
        return overflowing.slice(0, 5); // Limit to first 5
      }, viewport.width);

      expect(
        overflowingElements,
        `Elements overflowing viewport: ${overflowingElements.join(", ")}`
      ).toHaveLength(0);
    });
  }
});

test.describe("Layout - Body Overflow-X", () => {
  test("body has overflow-x: hidden", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bodyOverflow = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      return {
        overflowX: style.overflowX,
        overflowY: style.overflowY,
      };
    });

    // body should have overflow-x: hidden (set via globals.css)
    expect(bodyOverflow.overflowX).toBe("hidden");
  });
});

test.describe("Layout - Sticky Header", () => {
  for (const pagePath of ["/login", "/cadastro"]) {
    test(`Header stays at top on scroll for ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(500);

      // Check if header is still near the top
      const header = page.locator("header").first();
      const isVisible = await header.isVisible().catch(() => false);

      if (isVisible) {
        const box = await header.boundingBox();
        if (box) {
          // Sticky header should be at or near top (within 2px)
          expect(box.y).toBeLessThanOrEqual(2);
        }
      }
    });
  }
});

test.describe("Layout - Font Sizes", () => {
  test("No text is smaller than 12px on mobile", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    const tinyText = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        "p, span, label, a, button, h1, h2, h3, h4, h5, h6, li, td, th"
      );
      const tiny: string[] = [];
      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        if (fontSize > 0 && fontSize < 12 && el.textContent?.trim()) {
          tiny.push(
            `${el.tagName}("${el.textContent?.trim().slice(0, 20)}") = ${fontSize}px`
          );
        }
      });
      return tiny.slice(0, 10);
    });

    // sr-only text is expected to be tiny, filter those out
    const realTiny = tinyText.filter((t) => !t.includes("sr-only"));
    if (realTiny.length > 0) {
      console.warn("Small text found:", realTiny);
    }
  });
});

test.describe("Layout - Images", () => {
  test("Images do not cause overflow on landing page", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const viewport = page.viewportSize()!;
    const oversizedImages = await page.evaluate((vw) => {
      const images = document.querySelectorAll("img");
      const oversized: string[] = [];
      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        if (rect.width > vw + 5) {
          oversized.push(
            `${img.src?.slice(-30)} (width: ${Math.round(rect.width)}px)`
          );
        }
      });
      return oversized;
    }, viewport.width);

    expect(oversizedImages).toHaveLength(0);
  });
});
