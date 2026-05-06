import { formatViolations, partitionViolations, runAxe } from "../fixtures/axe"
import { expect, test } from "../fixtures/extension"
import { setTheme, waitForReady } from "../fixtures/theme"

/**
 * Automated accessibility scans of every Options route with
 * `@axe-core/playwright`.
 *
 * Tests fail only on critical/serious violations whose rule ID is not in
 * `tests/a11y/known-issues.json`. Known-tolerated violations and
 * informational (moderate/minor) violations are logged but don't break
 * CI. See `docs/testing.md` → "A11y baseline" for the rationale.
 */
test.use({ viewport: { width: 1280, height: 900 } })

const ROUTES = [
  { path: "", label: "home" },
  { path: "setting", label: "setting" },
  { path: "scene", label: "scene" },
  { path: "group", label: "group" },
  { path: "management", label: "management" },
  { path: "rule", label: "rule" },
  { path: "history", label: "history" }
] as const

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
  for (const { path: routePath, label } of ROUTES) {
    test(`options /${label}, ${theme} theme — no a11y regressions`, async ({
      page,
      extensionURL
    }) => {
      await page.goto(`${extensionURL}/options.html`)
      await waitForReady(page)
      await setTheme(page, theme)

      const hash = routePath ? `#/${routePath}` : ""
      await page.goto(`${extensionURL}/options.html${hash}`)
      await waitForReady(page)
      await page.waitForTimeout(300)

      const results = await runAxe(page)
      await reportAndAssert(results.violations, `options-${label}-${theme}`)
    })
  }
}
