# Testing

This repo uses [Playwright](https://playwright.dev/) for end-to-end visual
regression and accessibility testing of the extension's two UI surfaces
(Popup and Options page).

The suite lives in `tests/`:

```
tests/
├── playwright.config.ts        # config: workers, viewport, snapshot path
├── tsconfig.json               # commonjs/Node typing for the suite
├── fixtures/
│   ├── extension.ts            # loads build/ + helper extensions, exposes extensionId
│   └── theme.ts                # forces darkMode via chrome.storage.sync, waits for mount
├── extensions/                 # tiny no-op extensions used to populate the popup
│   ├── noop1/manifest.json
│   └── noop2/manifest.json
├── visual/
│   ├── popup.spec.ts           # list/grid × light/dark + search-open + empty results
│   └── options.spec.ts         # 7 routes × 2 themes
└── a11y/
    ├── popup.a11y.spec.ts      # axe-core scan, light + dark + search-open
    └── options.a11y.spec.ts    # axe-core scan per route, light + dark
```

## Quick start

```bash
# 1. Install deps and the Playwright browser binary
npm ci
npx playwright install chromium

# 2. Build the extension (the suite loads `build/` as an unpacked extension)
npm run build

# 3. Run the whole suite
npx playwright test --config=tests/playwright.config.ts
# or, equivalently:
npm run test:e2e

# Only the visual half
npm run test:visual

# Only the a11y half
npm run test:a11y
```

## Updating screenshot baselines

Visual regression specs compare against PNGs in
`tests/__screenshots__/`. To regenerate them after an intentional UI
change:

```bash
npm run test:update-snapshots
```

Inspect the `git diff` carefully — every changed pixel becomes the new
baseline. Commit only the screenshots that match what you intended to
change.

## Why the extension has to be loaded

The popup and options pages call `chrome.management.getAll()`,
`chrome.storage.sync`, and other extension-only APIs. Loading
`popup.html` directly in a plain page would surface `undefined` and
crash the React tree. The `extension` fixture (in
`tests/fixtures/extension.ts`) handles this by spawning a persistent
Chromium context with `--load-extension=build/`, plus two no-op helper
extensions (`tests/extensions/noop{1,2}`) so the popup has list items to
render.

The fixture exposes:

| Fixture        | Description                                            |
| -------------- | ------------------------------------------------------ |
| `context`      | Persistent `BrowserContext` with the extension loaded. |
| `extensionId`  | Chromium-assigned ID for `auto-extension-manager`.     |
| `extensionURL` | `chrome-extension://<id>` shorthand for `goto()`.      |

Additional helpers in `tests/fixtures/theme.ts`:

| Helper         | Description                                                                               |
| -------------- | ----------------------------------------------------------------------------------------- |
| `setTheme`     | Writes `setting.darkMode` into `chrome.storage.sync` and reloads.                         |
| `waitForReady` | Waits for `#app-container` to mount and gives styled-components/antd one frame to settle. |

## CI

The suite is designed to run inside the official Playwright Docker image
so font rendering matches the captured baselines byte-for-byte. The
intended GitHub Actions workflow is below — copy it to
`.github/workflows/test.yml`:

```yaml
name: tests

on:
  pull_request:
    branches: [master]
  push:
    branches: [master]

jobs:
  e2e:
    name: visual + a11y (Playwright)
    runs-on: ubuntu-22.04
    container:
      image: mcr.microsoft.com/playwright:v1.59.1-jammy
      options: --user 1001
    timeout-minutes: 25
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npx playwright test --config=tests/playwright.config.ts
        env:
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1"
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 14
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-test-results
          path: test-results
          retention-days: 14
```

Pin the container tag to the same minor as `@playwright/test` in
`package.json` (`v1.59.1-jammy` at the time of writing). When upgrading
Playwright, bump both in the same commit.

Both `playwright-report/` and `test-results/` are git-ignored.

## Manual checklists

The automated suite only covers what's cheap to script. The plan
documents two additional manual checklists worth running before each
release.

### Functional regression (Phase 6.3)

Verify these flows still behave identically to the previous build:

- [ ] Enable / disable an extension via the **popup list toggle**.
- [ ] Enable / disable an extension via the **popup grid menu**.
- [ ] Search extensions in the popup (open with `f`, close with `Esc`).
- [ ] Switch layout (list ↔ grid) via the header icon.
- [ ] Switch the active **group** in the popup.
- [ ] Switch the active **scene / profile** in the popup.
- [ ] Create / edit / delete a **rule** on the Options page.
- [ ] Create / edit / delete a **group** on the Options page.
- [ ] Create / edit / delete a **scene** on the Options page.
- [ ] Import / export the extension list on the Options page.
- [ ] Import / export the full config in Settings.
- [ ] Toggle dark mode in both popup and options.
- [ ] All three locales (`en`, `zh_CN`, `ja`) render correctly.

### Accessibility (Phase 6.2)

- [ ] All interactive elements reachable via Tab and Shift-Tab.
- [ ] Visible focus indicators on every focusable element.
- [ ] Screen reader (VoiceOver / NVDA) announces all state changes
      (toggles, dropdown open/close, search results count).
- [ ] All text passes WCAG AA contrast in both light and dark modes.
- [ ] No keyboard traps (you can always Tab out of dropdowns and modals).
- [ ] Logical tab order matches visual order.

## A11y baseline

Automated axe scans are tag-filtered to WCAG 2.1 A + AA. The plumbing in
`tests/fixtures/axe.ts` partitions every scan's violations three ways:

| Category        | Behaviour                                                         |
| --------------- | ----------------------------------------------------------------- |
| `regressions`   | Fail the test. Critical/serious violations not in the allowlist.  |
| `tolerated`     | Logged but allowed. Critical/serious violations on the allowlist. |
| `informational` | Logged but allowed. Moderate or minor violations.                 |

The allowlist lives at `tests/a11y/known-issues.json`. The current
entries — established when the suite landed — are:

- **`color-contrast`** — A handful of text/background pairs (mostly
  Ant Design's secondary text and the disabled state on switches) miss
  WCAG AA contrast in dark mode. Tracked for follow-up in the design
  system rather than the test scaffolding.
- **`aria-input-field-name`** — The settings page renders Ant Design
  switches without explicit `aria-label`s; the visible row text is
  associated visually but not programmatically. To be fixed by piping
  every Switch through `src/design-system/components/Switch.jsx`, which
  already warns in dev when no accessible name is supplied.
- **`button-name`** — Same Settings switches as above also trigger axe's
  `button-name` rule because Ant Design renders the switch as a native
  `<button>`. Same fix.
- **`role-img-alt`** — Several Ant Design icon components render with
  `role="img"` but no `aria-label`. They're decorative, but axe can't
  prove that without `aria-hidden="true"`. Fix is mechanical: audit and
  add `aria-hidden` or `aria-label`.

When a real fix lands, remove the rule ID from `known-issues.json`.
The next CI run will then enforce the cleanup. New entries should always
link a tracking follow-up (issue or PR).

### Performance (Phase 6.4)

```bash
# Bundle size delta
git checkout master && npm ci && npm run build && du -sb build > /tmp/before.txt
git checkout - && npm ci && npm run build && du -sb build > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt
```

Acceptance criteria: bundle size increase under 15 KB gzipped.

For popup open-to-interactive time, attach a Playwright trace:

```bash
PLAYWRIGHT_TRACE=1 npx playwright test --config=tests/playwright.config.ts tests/visual/popup.spec.ts
npx playwright show-trace test-results/<run>/trace.zip
```

The relevant metric is `firstMeaningfulPaint` in the trace timeline.
Acceptance criteria: no more than a 50 ms regression vs. the pre-modernisation
baseline.
