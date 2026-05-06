import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react"

import { ConfigProvider, theme as antdTheme } from "antd"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { applyCssVariables, darkTheme, lightTheme } from "./tokens"

// Fall back to useEffect during server-side rendering where useLayoutEffect
// would warn. The popup/options always run in the browser, but this keeps
// the provider safe for any future SSR usage.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

/**
 * Resolve a "system" / "light" / "dark" mode preference into a concrete boolean.
 */
function resolveDark(mode) {
  if (mode === "dark") return true
  if (mode === "light") return false
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }
  return false
}

const ThemeContext = createContext({
  isDarkMode: false,
  mode: "system",
  theme: lightTheme
})

/**
 * Centralized theme provider that wraps both Ant Design's `ConfigProvider`
 * and styled-components' `ThemeProvider`, and writes design-system CSS
 * custom properties onto `document.documentElement` so plain CSS files
 * and Ant Design overrides can use the same tokens.
 *
 * Props:
 *  - mode: "light" | "dark" | "system" (default "system")
 *  - isDarkMode: boolean override (takes precedence over `mode` if provided).
 *      Useful for callers that already resolved the preference (e.g.
 *      Popup/index.jsx does this synchronously before rendering).
 *  - antdToken: optional Ant Design design token overrides
 *  - applyBodyBackground: when true, also writes background/color to <body>
 */
export function ThemeProvider({
  children,
  mode = "system",
  isDarkMode: isDarkModeProp,
  antdToken,
  applyBodyBackground = true
}) {
  const [resolvedDark, setResolvedDark] = useState(() =>
    typeof isDarkModeProp === "boolean" ? isDarkModeProp : resolveDark(mode)
  )

  // React to mode / explicit-prop changes.
  useEffect(() => {
    if (typeof isDarkModeProp === "boolean") {
      setResolvedDark(isDarkModeProp)
      return
    }
    setResolvedDark(resolveDark(mode))
  }, [mode, isDarkModeProp])

  // Listen for system preference changes when in "system" mode.
  useEffect(() => {
    if (typeof isDarkModeProp === "boolean") return
    if (mode !== "system") return
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e) => setResolvedDark(e.matches)
    mq.addEventListener?.("change", handler)
    return () => mq.removeEventListener?.("change", handler)
  }, [mode, isDarkModeProp])

  const theme = resolvedDark ? darkTheme : lightTheme

  // Push CSS custom properties onto :root so plain CSS files share the
  // same tokens. Cleanup removes them on unmount or theme switch and also
  // restores any inline body styles we overwrote, so the provider is safe
  // to mount/unmount inside other hosts.
  //
  // Using useLayoutEffect so dark-mode tokens are applied synchronously
  // before paint and we avoid a flash of light-default styles.
  useIsomorphicLayoutEffect(() => {
    const cleanupCssVariables = applyCssVariables(theme)

    let previousBackgroundColor
    let previousColor
    if (applyBodyBackground && typeof document !== "undefined") {
      const { style } = document.body
      previousBackgroundColor = style.backgroundColor
      previousColor = style.color
      style.backgroundColor = theme.em_bg_primary
      style.color = theme.em_text_primary
    }

    return () => {
      if (typeof cleanupCssVariables === "function") {
        cleanupCssVariables()
      }
      if (applyBodyBackground && typeof document !== "undefined") {
        const { style } = document.body
        style.backgroundColor = previousBackgroundColor || ""
        style.color = previousColor || ""
      }
    }
  }, [theme, applyBodyBackground])

  const ctx = useMemo(
    () => ({ isDarkMode: resolvedDark, mode, theme }),
    [resolvedDark, mode, theme]
  )

  const antdConfig = useMemo(() => {
    // Ant Design's `borderRadius` token is numeric (px); pull it from the
    // design-system token so radii stay consistent across the app.
    const radiusFromToken = parseInt(theme.em_radius_md, 10)
    return {
      algorithm: resolvedDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        // Use the brand-solid blue for AntD's primary so primary buttons
        // get white text against `#337ab7` (4.65:1, passes WCAG AA) in
        // both themes. The dark-mode `em_color_primary` (`#5b9bd5`) is
        // intentionally lighter for use as link/icon foreground on a dark
        // page bg, but it would only hit ~2.96:1 with white.
        colorPrimary: theme.em_bg_brand_solid,
        // AntD derives `colorLink` from `colorPrimary` by default. Override
        // it back to the lighter `em_color_primary` so plain `<a>` text and
        // `Typography.Link` stay readable in dark mode (5.5:1 against
        // `#242529`); using brand-solid as the link color would fail
        // (`#337ab7` on `#242529` is only 1.94:1).
        colorLink: theme.em_color_primary,
        colorLinkHover: theme.em_color_primary_hover,
        colorLinkActive: theme.em_color_primary_hover,
        // Override `colorError` so danger buttons and links use our
        // contrast-checked danger token (default `#ff4d4f` on white only
        // hits 3.26:1; `#cf1322` reaches 5.94:1).
        colorError: theme.em_color_danger,
        // Default `colorTextDescription` (`#bfbfbf` light / `#4f4f4f` dark)
        // fails WCAG AA on its own background. Use our secondary text
        // token which is contrast-checked in both themes.
        colorTextDescription: theme.em_text_secondary,
        borderRadius: Number.isFinite(radiusFromToken) ? radiusFromToken : 6,
        ...(antdToken || {})
      },
      components: {
        // The default `Empty` component renders its description in
        // `colorTextDisabled` (`#bfbfbf` / `#4f4f4f`), which fails WCAG
        // AA contrast on its own. Force the description to use the
        // brand's secondary text color in both themes.
        Empty: {
          colorTextDisabled: theme.em_text_secondary
        }
      }
    }
  }, [
    resolvedDark,
    theme.em_bg_brand_solid,
    theme.em_color_primary,
    theme.em_color_primary_hover,
    theme.em_color_danger,
    theme.em_text_secondary,
    theme.em_radius_md,
    antdToken
  ])

  return (
    <ThemeContext.Provider value={ctx}>
      <ConfigProvider theme={antdConfig}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
