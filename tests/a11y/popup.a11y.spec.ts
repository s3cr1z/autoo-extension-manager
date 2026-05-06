import { formatViolations, partitionViolations, runAxe } from "../fixtures/axe"
import { expect, test } from "../fixtures/extension"
import { setTheme, waitForReady } from "../fixtures/theme"

/**
 * Automated accessibility scans of the popup with `@axe-core/playwright`.
 *
 * The scans cover WCAG 2.1 Level A and AA. We run them in both light
 * and dark themes because token-driven contrast can regress on a single
 * side without the other.
 *
 * Test outcomes:
 *   - **fail** if a critical/serious violation appears whose rule ID is
 *     not in `tests/a11y/known-issues.json` (i.e. a regression).
 *   - **pass with warning** if all critical/serious violations are
 *     tolerated by `known-issues.json`. The test logs the tolerated and
 *     informational violations so they remain visible.
 *
 * Failures here are useful but not exhaustive — manual screen-reader and
 * keyboard testing is still required for full coverage. See
 * `docs/testing.md` for the manual checklist.
 */
async function reportAndAssert(
  violations: Awaited<ReturnType<typeof runAxe>>["violations"],
  label: string
) {
  const { regressions, tolerated, informational } = partitionViolations(violations)
  if (tolerated.length || informational.length) {
    /* eslint-disable no-console */
    console.log(`\n[a11y:${label}] tolerated violations (${tolerated.length}):`)
    console.log(formatViolations(tolerated) || "  (none)")
    console.log(`[a11y:${label}] informational violations (${informational.length}):`)
    console.log(formatViolations(informational) || "  (none)")
    /* eslint-enable no-console */
  }
  expect(
    regressions,
    `Unexpected a11y regressions on ${label}:\n${formatViolations(regressions)}`
  ).toEqual([])
}

for (const theme of ["light", "dark"] as const) {
  test(`popup, ${theme} theme — no a11y regressions`, async ({ page, extensionURL }) => {
    await page.goto(`${extensionURL}/popup.html`)
    await waitForReady(page)
    await setTheme(page, theme)

    const results = await runAxe(page)
    await reportAndAssert(results.violations, `popup-${theme}`)
  })
}

test("popup, search bar open — no a11y regressions", async ({ page, extensionURL }) => {
  await page.goto(`${extensionURL}/popup.html`)
  await waitForReady(page)
  await setTheme(page, "light")

  await page.keyboard.press("KeyF")
  await page.waitForTimeout(250)

  const results = await runAxe(page)
  await reportAndAssert(results.violations, "popup-search")
})
