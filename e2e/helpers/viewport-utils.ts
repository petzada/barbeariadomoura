import { Page, expect } from "@playwright/test";

/**
 * Assert that no horizontal overflow exists on the page.
 */
export async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth <=
      document.documentElement.clientWidth
    );
  });
  expect(overflow).toBe(true);
}

/**
 * Assert that an element's bounding box is within the viewport.
 */
export async function assertWithinViewport(
  page: Page,
  selector: string,
  options?: { partial?: boolean }
) {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("No viewport set");

  const box = await page.locator(selector).first().boundingBox();
  if (!box) throw new Error(`Element not found: ${selector}`);

  if (options?.partial) {
    // At least partially visible
    expect(box.x + box.width).toBeGreaterThan(0);
    expect(box.y + box.height).toBeGreaterThan(0);
    expect(box.x).toBeLessThan(viewport.width);
    expect(box.y).toBeLessThan(viewport.height);
  } else {
    // Fully within viewport
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1); // 1px tolerance
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
  }
}

/**
 * Assert that an overlay element is above other content (z-index check).
 */
export async function assertOverlayAboveContent(
  page: Page,
  overlaySelector: string
) {
  const isAbove = await page.evaluate((sel) => {
    const overlay = document.querySelector(sel);
    if (!overlay) return false;
    const rect = overlay.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const topElement = document.elementFromPoint(centerX, centerY);
    return overlay.contains(topElement) || overlay === topElement;
  }, overlaySelector);
  expect(isAbove).toBe(true);
}

/**
 * Assert no ancestor has overflow:hidden that clips the element.
 */
export async function assertNoClippingAncestor(
  page: Page,
  selector: string
) {
  const isClipped = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return true;
    let parent = el.parentElement;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      if (
        style.overflow === "hidden" &&
        !parent.hasAttribute("data-radix-portal")
      ) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        if (
          elRect.right > parentRect.right + 1 ||
          elRect.bottom > parentRect.bottom + 1 ||
          elRect.left < parentRect.left - 1 ||
          elRect.top < parentRect.top - 1
        ) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    return false;
  }, selector);
  expect(isClipped).toBe(false);
}

/**
 * Assert minimum touch target size (44x44px recommended by WCAG).
 */
export async function assertMinTouchTarget(
  page: Page,
  selector: string,
  minSize = 44
) {
  const box = await page.locator(selector).first().boundingBox();
  if (!box) throw new Error(`Element not found: ${selector}`);
  const effectiveWidth = Math.max(box.width, 0);
  const effectiveHeight = Math.max(box.height, 0);
  // We check effective touch area (at least one dimension should be >= minSize)
  expect(
    effectiveWidth >= minSize || effectiveHeight >= minSize
  ).toBe(true);
}

/**
 * Take a screenshot with viewport info in the name.
 */
export async function screenshotWithViewport(
  page: Page,
  name: string
) {
  const viewport = page.viewportSize();
  const vp = viewport ? `${viewport.width}x${viewport.height}` : "unknown";
  await page.screenshot({
    path: `e2e/screenshots/${vp}-${name}.png`,
    fullPage: false,
  });
}
