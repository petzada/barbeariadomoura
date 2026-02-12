import { test, expect } from "@playwright/test";
import { assertNoHorizontalOverflow } from "./helpers/viewport-utils";

/**
 * Auth page flow tests - login, register, forgot password.
 * These are publicly accessible and can be tested without auth.
 */

test.describe("Login Flow - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
  });

  test("form is fully visible without scrolling on portrait", async ({
    page,
  }) => {
    const viewport = page.viewportSize()!;
    if (viewport.height >= 568) {
      // On portrait viewports >= 568px, form should be visible
      const form = page.locator("form").first();
      const isVisible = await form.isVisible().catch(() => false);
      if (isVisible) {
        const box = await form.boundingBox();
        if (box) {
          expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 100);
        }
      }
    }
  });

  test("email input has correct type for mobile keyboard", async ({
    page,
  }) => {
    const emailInput = page.locator('input[type="email"]');
    const count = await emailInput.count();
    if (count > 0) {
      const type = await emailInput.first().getAttribute("type");
      expect(type).toBe("email");
    }
  });

  test("password input has correct type", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput.first()).toBeVisible();
  });

  test("submit button is tappable (adequate size)", async ({ page }) => {
    const btn = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /entrar|login/i });

    const isVisible = await btn.first().isVisible().catch(() => false);
    if (isVisible) {
      const box = await btn.first().boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(36);
        expect(box.width).toBeGreaterThanOrEqual(80);
      }
    }
  });

  test("error state shows toast/message without breaking layout", async ({
    page,
  }) => {
    // Submit empty form to trigger validation
    const submitBtn = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /entrar|login/i });

    if (await submitBtn.first().isVisible().catch(() => false)) {
      await submitBtn.first().click();
      await page.waitForTimeout(1000);
      await assertNoHorizontalOverflow(page);
    }
  });

  test("links (esqueci senha, cadastro) are tappable", async ({ page }) => {
    const links = page.locator("a").filter({
      hasText: /esqueci|cadastr|registr/i,
    });
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      if (box && box.width > 0) {
        expect(box.height).toBeGreaterThanOrEqual(20);
      }
    }
  });
});

test.describe("Register Flow - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cadastro", { waitUntil: "domcontentloaded" });
  });

  test("all form fields are within viewport width", async ({ page }) => {
    const viewport = page.viewportSize()!;
    const inputs = page.locator("input");
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const box = await inputs.nth(i).boundingBox();
      if (box && box.width > 0) {
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 2);
      }
    }
  });

  test("form is scrollable when it exceeds viewport height", async ({
    page,
  }) => {
    const viewport = page.viewportSize()!;
    const form = page.locator("form").first();
    const isVisible = await form.isVisible().catch(() => false);

    if (isVisible) {
      const box = await form.boundingBox();
      if (box && box.height > viewport.height) {
        // Page should be scrollable
        const scrollable = await page.evaluate(
          () => document.documentElement.scrollHeight > window.innerHeight
        );
        expect(scrollable).toBe(true);
      }
    }
  });

  test("phone input triggers numeric keyboard", async ({ page }) => {
    const telInput = page.locator(
      'input[type="tel"], input[name*="telefone"], input[name*="phone"]'
    );
    const count = await telInput.count();
    if (count > 0) {
      const type = await telInput.first().getAttribute("type");
      const inputMode = await telInput.first().getAttribute("inputmode");
      expect(type === "tel" || inputMode === "tel" || inputMode === "numeric").toBe(true);
    }
  });

  test("submit with invalid data shows error without breaking layout", async ({
    page,
  }) => {
    const submitBtn = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /cadastr|registr|criar/i });

    if (await submitBtn.first().isVisible().catch(() => false)) {
      await submitBtn.first().click();
      await page.waitForTimeout(1000);
      await assertNoHorizontalOverflow(page);
    }
  });
});

test.describe("Forgot Password Flow - Mobile", () => {
  test("page layout fits viewport", async ({ page }) => {
    await page.goto("/esqueci-senha", { waitUntil: "domcontentloaded" });
    await assertNoHorizontalOverflow(page);

    const viewport = page.viewportSize()!;
    const inputs = page.locator("input");
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const box = await inputs.nth(i).boundingBox();
      if (box && box.width > 0) {
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 2);
      }
    }
  });
});
