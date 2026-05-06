import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import fs from "fs"
import path from "path"

/**
 * Run an axe-core scan with the project's standard tag set
 * (WCAG 2.1 A + AA).
 */
export async function runAxe(page: Page) {
  return await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()
}

export type AxeViolation = Awaited<ReturnType<typeof runAxe>>["violations"][number]

/**
 * The format of `tests/a11y/known-issues.json`.
 *
 * `tolerated` lists violation rule IDs we know about and have decided to
 * temporarily accept. The suite warns about them (so they appear in the
 * report) but doesn't fail CI. Adding a new entry here is a deliberate
 * decision to defer a fix — when adding one, also link a tracking
 * follow-up in the repo.
 */
type KnownIssues = {
  tolerated: string[]
}

const KNOWN_ISSUES_PATH = path.resolve(__dirname, "..", "a11y", "known-issues.json")

let cached: KnownIssues | undefined

function loadKnownIssues(): KnownIssues {
  if (cached) return cached
  if (!fs.existsSync(KNOWN_ISSUES_PATH)) {
    cached = { tolerated: [] }
    return cached
  }
  try {
    const content = fs.readFileSync(KNOWN_ISSUES_PATH, "utf8")
    const parsed = JSON.parse(content) as KnownIssues
    cached = parsed && Array.isArray(parsed.tolerated) ? parsed : { tolerated: [] }
  } catch {
    cached = { tolerated: [] }
  }
  return cached
}

/**
 * Partition axe violations into:
 *   - `regressions` — critical/serious violations whose rule ID is NOT in
 *     the known-issues allowlist. Tests fail on these.
 *   - `tolerated`   — critical/serious violations whose rule ID IS in the
 *     allowlist. Reported but don't fail the test.
 *   - `informational` — moderate/minor violations. Always report-only.
 */
export function partitionViolations(violations: AxeViolation[]) {
  const known = new Set(loadKnownIssues().tolerated)
  const regressions: AxeViolation[] = []
  const tolerated: AxeViolation[] = []
  const informational: AxeViolation[] = []
  for (const v of violations) {
    if (v.impact === "critical" || v.impact === "serious") {
      if (known.has(v.id)) tolerated.push(v)
      else regressions.push(v)
    } else {
      informational.push(v)
    }
  }
  return { regressions, tolerated, informational }
}

/**
 * Render a violation array as a compact markdown summary for inclusion
 * in a Playwright assertion message or CI log.
 */
export function formatViolations(violations: AxeViolation[]): string {
  if (violations.length === 0) return ""
  return violations
    .map((v) => {
      const targets = v.nodes
        .slice(0, 3)
        .map((n) => `      ${n.target?.join(" ") ?? "<unknown>"}`)
        .join("\n")
      const extra = v.nodes.length > 3 ? `\n      … and ${v.nodes.length - 3} more` : ""
      return `  - [${v.impact}] ${v.id}: ${v.help}\n${targets}${extra}`
    })
    .join("\n")
}
