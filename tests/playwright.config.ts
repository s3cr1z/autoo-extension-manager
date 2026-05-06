import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright config for the auto-extension-manager test suite.
 *
 * The suite has two halves:
 *   - `visual/` — screenshot-based visual regression of the popup and
 *     options pages in light + dark themes.
 *   - `a11y/`   — `@axe-core/playwright` automated accessibility scans of
 *     the same surfaces.
 *
 * Both halves load `build/` as an unpacked Chrome extension, so the
 * extension must be built before tests run. The repo's `test:e2e` npm
 * script does this automatically (`npm run build && npx playwright test`).
 */
export default defineConfig({
  testDir: ".",
  // Visual snapshots live next to the spec that produced them so it's
  // obvious which test owns which baseline.
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Extension contexts are heavy; running serially keeps logs and snapshot
  // diffs deterministic.
  workers: 1,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    // Tests open extension URLs directly via `extensionId`, so a base URL
    // would be misleading. Leave it unset.
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    // Match a typical popup viewport. Specs that need a wider window
    // (Options page) override this per-test.
    viewport: { width: 480, height: 600 }
  },
  expect: {
    toHaveScreenshot: {
      // Allow tiny anti-aliasing differences. Tighten as the suite stabilises.
      maxDiffPixelRatio: 0.02,
      animations: "disabled"
    }
  },
  projects: [
    {
      name: "chromium",
      // Inherit Chrome's UA / args but keep the viewport from `use` above so
      // popup-sized specs aren't unnecessarily 1280-wide.
      use: { ...devices["Desktop Chrome"], viewport: { width: 480, height: 600 } }
    }
  ]
})
