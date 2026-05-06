import { type BrowserContext, type Worker, test as base, chromium } from "@playwright/test"
import path from "path"

/**
 * Path to the unpacked extension (`build/` produced by `npm run build`).
 *
 * Resolved from the repo root rather than `__dirname` so the fixture works
 * regardless of where Playwright is invoked from.
 */
const EXTENSION_PATH = path.resolve(__dirname, "..", "..", "build")

/**
 * Optional helper extensions used to populate the popup with a few
 * "installed" entries. Without these the popup renders an empty state
 * because Playwright's persistent context only contains
 * `auto-extension-manager` itself, which the popup filters out.
 *
 * Each helper is a tiny MV3 manifest under `tests/extensions/<name>/`.
 */
const HELPER_EXTENSION_PATHS = [
  path.resolve(__dirname, "..", "extensions", "noop1"),
  path.resolve(__dirname, "..", "extensions", "noop2")
]

type Fixtures = {
  /** Persistent Chromium context with the extension loaded. */
  context: BrowserContext
  /** ID assigned to `auto-extension-manager` by Chromium for this run. */
  extensionId: string
  /** URL prefix `chrome-extension://<id>` for convenience. */
  extensionURL: string
}

/**
 * Look up the extension's MV3 service worker. Newer Playwright versions
 * may surface it as `serviceworker` immediately or after a delay, so we
 * try both the synchronous list and the event.
 */
async function getServiceWorker(context: BrowserContext, timeoutMs = 15_000): Promise<Worker> {
  const existing = context.serviceWorkers()
  if (existing.length > 0) return existing[0]
  return await context.waitForEvent("serviceworker", { timeout: timeoutMs })
}

export const test = base.extend<Fixtures>({
  context: async ({}, use) => {
    const loadPaths = [EXTENSION_PATH, ...HELPER_EXTENSION_PATHS].join(",")
    const context = await chromium.launchPersistentContext("", {
      // Headless `--headless=new` supports MV3 service workers, but
      // Playwright's `headless: true` still uses old headless mode for
      // extensions; explicit `headless: false` is the documented path
      // and matches Microsoft's Playwright extension recipe.
      headless: false,
      args: [
        "--headless=new",
        `--disable-extensions-except=${loadPaths}`,
        `--load-extension=${loadPaths}`,
        "--no-sandbox"
      ]
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    const sw = await getServiceWorker(context)
    // URL is `chrome-extension://<id>/<path>`; the host is the ID.
    const id = new URL(sw.url()).host
    await use(id)
  },
  extensionURL: async ({ extensionId }, use) => {
    await use(`chrome-extension://${extensionId}`)
  }
})

export const expect = test.expect
