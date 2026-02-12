import { test, expect } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  assertWithinViewport,
  assertOverlayAboveContent,
} from "./helpers/viewport-utils";

test.describe("Mobile Overlay / Modal / Menu Validation", () => {
  // =============================================
  // 1. PUBLIC PAGES - No auth required
  // =============================================

  test.describe("Landing Page (/)", () => {
    test("page loads without horizontal overflow", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await assertNoHorizontalOverflow(page);
    });

    test("hero section fits within viewport", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      // Check no horizontal scroll on any viewport
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth
      );
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    test("navigation buttons are visible and tappable", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      // Check CTA buttons exist
      const buttons = page.locator("a, button").filter({ hasText: /login|entrar|cadastr/i });
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);

      // Each button should have reasonable touch target
      for (let i = 0; i < Math.min(count, 5); i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box && box.width > 0) {
          expect(box.height).toBeGreaterThanOrEqual(32);
        }
      }
    });
  });

  // =============================================
  // 2. AUTH PAGES
  // =============================================

  test.describe("Login Page (/login)", () => {
    test("page loads without horizontal overflow", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await assertNoHorizontalOverflow(page);
    });

    test("form inputs are visible and accessible", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("domcontentloaded");

      // Check email input exists and has correct type
      const emailInput = page.locator('input[type="email"], input[name*="email"]');
      await expect(emailInput.first()).toBeVisible();

      // Check password input
      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput.first()).toBeVisible();

      // Check submit button
      const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /entrar|login/i });
      await expect(submitBtn.first()).toBeVisible();
    });

    test("form fields are within viewport", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("domcontentloaded");

      const inputs = page.locator("input");
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const box = await inputs.nth(i).boundingBox();
        if (box) {
          const viewport = page.viewportSize()!;
          expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
        }
      }
    });

    test("input touch targets are adequate", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("domcontentloaded");

      const inputs = page.locator("input");
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const box = await inputs.nth(i).boundingBox();
        if (box) {
          // h-11 = 44px, minimum recommended
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
      }
    });
  });

  test.describe("Register Page (/cadastro)", () => {
    test("page loads without horizontal overflow", async ({ page }) => {
      await page.goto("/cadastro");
      await page.waitForLoadState("networkidle");
      await assertNoHorizontalOverflow(page);
    });

    test("form with multiple fields fits in viewport", async ({ page }) => {
      await page.goto("/cadastro");
      await page.waitForLoadState("domcontentloaded");

      // All inputs should be within viewport width
      const inputs = page.locator("input");
      const count = await inputs.count();
      const viewport = page.viewportSize()!;

      for (let i = 0; i < count; i++) {
        const box = await inputs.nth(i).boundingBox();
        if (box && box.width > 0) {
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 2);
        }
      }
    });
  });

  test.describe("Forgot Password (/esqueci-senha)", () => {
    test("page loads without horizontal overflow", async ({ page }) => {
      await page.goto("/esqueci-senha");
      await page.waitForLoadState("networkidle");
      await assertNoHorizontalOverflow(page);
    });
  });
});
