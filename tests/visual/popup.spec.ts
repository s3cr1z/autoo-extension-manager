import { expect, test } from "../fixtures/extension"
import { mergeSetting, setTheme, waitForReady } from "../fixtures/theme"

/**
 * Visual regression for the popup surface (toolbar UI).
 *
 * The popup is loaded directly via its extension URL rather than by
 * clicking the toolbar action — Playwright doesn't expose the toolbar in
 * headless Chromium, but the rendered HTML is identical either way.
 *
 * Each test:
 *   1. Forces a deterministic theme via `chrome.storage.sync`.
 *   2. Waits for the React app to mount.
 *   3. Compares against a checked-in screenshot baseline.
 *
 * To generate or refresh baselines locally:
 *   `npx playwright test --update-snapshots`
 *
 * Dynamic content (extension counts, install timestamps) is masked so
 * baselines don't drift between machines.
 */
test.describe("popup — visual regression", () => {
  for (const layout of ["list", "grid"] as const) {
    for (const theme of ["light", "dark"] as const) {
      test(`${layout} view, ${theme} theme`, async ({ page, extensionURL }) => {
        await page.goto(`${extensionURL}/popup.html`)
        await waitForReady(page)
        // Persist both layout and theme in one storage write, then reload
        // once. Two sequential reloads make the popup race-y because
        // `prepare()` is async.
        await mergeSetting(page, { layout, darkMode: theme })
        await page.reload({ waitUntil: "domcontentloaded" })
        await waitForReady(page)

        await expect(page).toHaveScreenshot(`popup-${layout}-${theme}.png`, {
          mask: [page.locator(".extension-count"), page.locator(".group-name")],
          fullPage: true
        })
      })
    }
  }

  test("search bar open, light theme", async ({ page, extensionURL }) => {
    await page.goto(`${extensionURL}/popup.html`)
    await waitForReady(page)
    await setTheme(page, "light")
    await waitForReady(page)

    // Press the documented `f` shortcut to open the search bar.
    await page.keyboard.press("KeyF")
    // Wait for the search input itself rather than a fixed timeout — the
    // slide-down animation can take longer than expected on slow CI.
    await page
      .locator('input[type="search"], input[type="text"]')
      .first()
      .waitFor({ state: "visible" })

    await expect(page).toHaveScreenshot("popup-search-open-light.png", {
      mask: [page.locator(".extension-count")],
      fullPage: true
    })
  })

  test("empty search results state, light theme", async ({ page, extensionURL }) => {
    await page.goto(`${extensionURL}/popup.html`)
    await waitForReady(page)
    await setTheme(page, "light")
    await waitForReady(page)

    await page.keyboard.press("KeyF")
    // Wait for the search input to actually be present and focused before
    // typing — otherwise the keystrokes can race the slide-down animation.
    const searchInput = page.locator('input[type="search"], input[type="text"]').first()
    await searchInput.waitFor({ state: "visible" })

    await page.keyboard.type("zzz_no_match_zzz")
    // The empty-state copy is rendered after the throttled search settles;
    // waiting for it is more reliable than a fixed timeout.
    await page
      .getByText(/No extensions match|没有匹配的扩展|一致する拡張機能はありません/)
      .waitFor()

    await expect(page).toHaveScreenshot("popup-empty-search-light.png", {
      mask: [page.locator(".extension-count")],
      fullPage: true
    })
  })
})
