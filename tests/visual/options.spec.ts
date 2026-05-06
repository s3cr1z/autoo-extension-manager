import { expect, test } from "../fixtures/extension"
import { setTheme, waitForReady } from "../fixtures/theme"

/**
 * Visual regression for the Options page.
 *
 * The Options page is a hash-routed React app; each route is rendered as
 * a sub-page and we capture one screenshot per route, in both themes.
 *
 * The Options page is full-tab and therefore needs a wider viewport than
 * the popup default.
 */
test.use({ viewport: { width: 1280, height: 900 } })

const ROUTES: { path: string; label: string }[] = [
  { path: "", label: "home" },
  { path: "setting", label: "setting" },
  { path: "scene", label: "scene" },
  { path: "group", label: "group" },
  { path: "management", label: "management" },
  { path: "rule", label: "rule" },
  { path: "history", label: "history" }
]

test.describe("options — visual regression", () => {
  for (const theme of ["light", "dark"] as const) {
    for (const { path: routePath, label } of ROUTES) {
      test(`${label} route, ${theme} theme`, async ({ page, extensionURL }) => {
        // Initial visit also primes storage so `setTheme` can persist.
        await page.goto(`${extensionURL}/options.html`)
        await waitForReady(page)
        await setTheme(page, theme)

        const hash = routePath ? `#/${routePath}` : ""
        await page.goto(`${extensionURL}/options.html${hash}`)
        await waitForReady(page)
        // Allow the route's async data fetches a moment to settle.
        await page.waitForTimeout(300)

        await expect(page).toHaveScreenshot(`options-${label}-${theme}.png`, {
          mask: [
            // Version string + build hashes mutate per-build.
            page.locator("[data-testid='build-version'], .em-build-version"),
            // Lists of installed extensions vary per CI run.
            page.locator(".ext-history-row, .ext-manage-row")
          ],
          fullPage: true
        })
      })
    }
  }
})
