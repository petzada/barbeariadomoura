import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

/** Mobile viewports for testing */
const mobileViewports = {
  "Mobile 320x568": { width: 320, height: 568 },
  "Mobile 360x640": { width: 360, height: 640 },
  "Mobile 375x667": { width: 375, height: 667 },
  "Mobile 390x844": { width: 390, height: 844 },
  "Mobile 412x915": { width: 412, height: 915 },
  "Landscape 568x320": { width: 568, height: 320 },
  "Landscape 667x375": { width: 667, height: 375 },
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 30000,
  expect: { timeout: 10000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Mobile portrait viewports
    ...Object.entries(mobileViewports).map(([name, viewport]) => ({
      name,
      use: {
        viewport,
        isMobile: viewport.width <= 480,
        hasTouch: viewport.width <= 480,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      },
    })),
    // Desktop for baseline comparison
    {
      name: "Desktop",
      use: {
        viewport: { width: 1280, height: 720 },
        isMobile: false,
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
