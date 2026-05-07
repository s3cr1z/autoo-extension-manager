---
name: testing-extension-options
description: Test Chrome extension Options-page flows end-to-end in the local unpacked Extension Manager build. Use when verifying Options routes such as Rules, Settings, Groups, Scenes, Management, or History.
---

# Testing Extension Options UI

## Devin Secrets Needed

- None for local unpacked-extension Options-page testing.

## Setup

1. Build the Chrome extension from the repo root:
   ```bash
   npm run build
   ```
2. Load the unpacked extension into Devin's browser using the built `build/` directory.
   - With the browser tool, restart Chrome with `extensions` set to the absolute `build/` path.
   - If you need the extension ID manually, open `chrome://extensions/`, click `Details` for `Extension Manager`, and read the `id=` query param.
3. Open Options routes directly with:
   ```text
   chrome-extension://<extension-id>/options.html#/<route>
   ```
   Examples: `#/rule`, `#/setting`, `#/group`, `#/scene`, `#/management`, `#/history`.

## Useful Code Paths

- Options UI entrypoint: `src/manifest.json` (`options_ui.page`).
- Options route declarations: `src/pages/Options/Options.jsx`.
- Navigation labels/route links: `src/pages/Options/navigation/Navigation.jsx`.
- Playwright extension loading fixture: `tests/fixtures/extension.ts`.
- Storage/theme helpers for automated tests: `tests/fixtures/theme.ts`.

## Recording Guidance

1. Finish build/load/setup before starting the recording.
2. Maximize Chrome before recording:
   ```bash
   sudo apt-get install -y wmctrl 2>/dev/null || true
   wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz || true
   ```
3. Use annotations for setup, test start, and each concrete assertion.
4. Capture screenshots for before/after states used in the final report.

## Rules Empty-State Flow Notes

- A fresh extension profile defaults `ruleConfig` to `[]`, so the Rules page should start empty unless storage was changed in the same browser profile.
- Route: `chrome-extension://<extension-id>/options.html#/rule`.
- In the empty Rules state, verify the user-facing entrypoint remains visible (`Add`) and the standalone EmptyState panel is shown.
- After clicking `Add`, the editor itself also contains an `Add Matching Conditions` trigger button. Do not assert that this phrase disappears globally; instead verify the standalone centered empty-state panel is gone while the editor sections are visible.
- Clicking `Cancel` should restore the empty-state panel and `Add` button without reloading.
