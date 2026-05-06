import type { Page } from "@playwright/test"
import LZString from "lz-string"

/**
 * The popup and options pages read `darkMode` from
 * `chrome.storage.sync` (key `setting`). Tests need a deterministic theme
 * so screenshots don't drift with the host OS preference; this helper
 * patches the stored setting and reloads.
 *
 * Modes:
 *   - `"light"` — force `darkMode: "light"`
 *   - `"dark"`  — force `darkMode: "dark"`
 *   - `"system"` — clear the override (uses CSS `prefers-color-scheme`)
 */
export type ThemeMode = "light" | "dark" | "system"

export async function setTheme(page: Page, mode: ThemeMode): Promise<void> {
  await mergeSetting(page, { darkMode: mode })
  await page.reload({ waitUntil: "domcontentloaded" })
}

/**
 * Merge a partial `setting` object into the same storage layout the
 * extension uses (LargeSyncStorage's LZString-compressed split-key
 * scheme — see `src/storage/utils/LargeSyncStorage.js`) and bust the
 * popup's localforage `TempCache` so the next reload picks the new
 * value up.
 *
 * Why the indirection?
 *   The popup doesn't read `chrome.storage.sync.setting` directly; it
 *   reads `LS__setting.0` + `LS__setting.meta`, decompresses, and falls
 *   back to defaults if the meta key is missing. Writing a plain
 *   `setting` key has no effect.
 */
export async function mergeSetting(page: Page, patch: Record<string, unknown>): Promise<void> {
  // Read current setting (decompress whatever the extension wrote).
  const current = await readSetting(page)
  const merged = { ...current, ...patch }
  const compressed = compressForLargeSync("setting", merged)

  await page.evaluate(async (entries: Record<string, unknown>) => {
    await chrome.storage.sync.set(entries)
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("TempCache/"))
      .forEach((k) => window.localStorage.removeItem(k))
  }, compressed)
}

async function readSetting(page: Page): Promise<Record<string, unknown>> {
  const compressed = await page.evaluate(async () => chrome.storage.sync.get(null))
  const meta = compressed["LS__setting.meta"] as { max: number } | undefined
  if (!meta) return {}
  let joined = ""
  for (let i = 0; i < meta.max; i++) {
    const chunk = compressed[`LS__setting.${i}`] as string | undefined
    if (typeof chunk !== "string") return {}
    joined += chunk
  }
  try {
    return JSON.parse(LZString.decompressFromBase64(joined) || "{}") as Record<string, unknown>
  } catch {
    return {}
  }
}

/**
 * Produce the `{ "LS__setting.0": ..., "LS__setting.meta": ... }` shape
 * expected by `LargeSyncStorage.reconstruct`. Mirrors
 * `LargeSyncStorage.split` for a single key whose value comfortably fits
 * in one chunk (true for the Settings object — well under the 8KB
 * `QUOTA_BYTES_PER_ITEM` limit).
 */
function compressForLargeSync(key: string, value: unknown): Record<string, unknown> {
  const str = LZString.compressToBase64(JSON.stringify(value))
  const result: Record<string, unknown> = {}
  result[`LS__${key}.0`] = str
  result[`LS__${key}.meta`] = {
    key,
    min: 0,
    max: 1,
    hash: basicHash(str),
    largeSyncversion: "0.1.0"
  }
  return result
}

/**
 * `basicHash` from `LargeSyncStorage.js`. Used so the meta entry's hash
 * matches what the extension's own `set()` would have written.
 */
function basicHash(str: string): number {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

/**
 * Wait for the popup or options app to finish its initial render so
 * screenshots aren't taken mid-mount.
 */
export async function waitForReady(page: Page): Promise<void> {
  // Both surfaces mount React into `#app-container`; once it has any
  // child element the initial render has happened.
  await page.locator("#app-container *").first().waitFor({ state: "attached", timeout: 10_000 })
  // Give styled-components / antd one frame to apply tokens.
  await page.waitForTimeout(150)
}
