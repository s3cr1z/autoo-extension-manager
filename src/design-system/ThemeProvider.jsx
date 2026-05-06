import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

import { ConfigProvider, theme as antdTheme } from "antd"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { applyCssVariables, darkTheme, lightTheme } from "./tokens"

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
  // same tokens. Cleanup removes them on unmount or theme switch.
  useEffect(() => {
    const cleanup = applyCssVariables(theme)
    if (applyBodyBackground && typeof document !== "undefined") {
      document.body.style.backgroundColor = theme.em_bg_primary
      document.body.style.color = theme.em_text_primary
    }
    return cleanup
  }, [theme, applyBodyBackground])

  const ctx = useMemo(
    () => ({ isDarkMode: resolvedDark, mode, theme }),
    [resolvedDark, mode, theme]
  )

  const antdConfig = useMemo(
    () => ({
      algorithm: resolvedDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: theme.em_color_primary,
        borderRadius: 6,
        ...(antdToken || {})
      }
    }),
    [resolvedDark, theme.em_color_primary, antdToken]
  )

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
