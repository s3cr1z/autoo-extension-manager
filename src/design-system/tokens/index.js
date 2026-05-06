/**
 * Unified design-system token exports.
 *
 * `lightTheme` / `darkTheme` are SUPERSETS of the legacy theme objects that
 * used to live inline in Popup/index.jsx and Options/Options.jsx. They keep
 * every legacy key (e.g. `bg`, `fg`, `nav_link`) while adding new `em_*`
 * tokens, so existing styled-components keep rendering unchanged.
 */
import { darkTheme as colorsDark, lightTheme as colorsLight, palette } from "./colors"
import { radius, shadow } from "./elevation"
import { duration, easing, transition } from "./motion"
import { spacing } from "./spacing"
import { fontFamily, fontSize, fontWeight, lineHeight } from "./typography"

const sharedTokens = {
  em_radius_sm: radius.sm,
  em_radius_md: radius.md,
  em_radius_lg: radius.lg,
  em_radius_xl: radius.xl,
  em_radius_full: radius.full,

  em_space_1: spacing[1],
  em_space_2: spacing[2],
  em_space_3: spacing[3],
  em_space_4: spacing[4],
  em_space_5: spacing[5],
  em_space_6: spacing[6],
  em_space_8: spacing[8],
  em_space_10: spacing[10],
  em_space_12: spacing[12],

  em_font_family: fontFamily.base,
  em_font_family_mono: fontFamily.mono,
  em_font_size_xs: fontSize.xs,
  em_font_size_sm: fontSize.sm,
  em_font_size_base: fontSize.base,
  em_font_size_lg: fontSize.lg,
  em_font_size_xl: fontSize.xl,
  em_font_size_2xl: fontSize["2xl"],
  em_line_height_tight: lineHeight.tight,
  em_line_height_normal: lineHeight.normal,
  em_line_height_relaxed: lineHeight.relaxed,
  em_font_weight_normal: fontWeight.normal,
  em_font_weight_medium: fontWeight.medium,
  em_font_weight_semibold: fontWeight.semibold,
  em_font_weight_bold: fontWeight.bold,

  em_duration_fast: duration.fast,
  em_duration_normal: duration.normal,
  em_duration_slow: duration.slow,
  em_easing_ease_out: easing.easeOut,
  em_easing_ease_in_out: easing.easeInOut,
  em_easing_ease_in: easing.easeIn,
  em_transition_hover: transition.hover
}

export const lightTheme = { ...colorsLight, ...sharedTokens }
export const darkTheme = { ...colorsDark, ...sharedTokens }

export { palette, radius, shadow, spacing, fontFamily, fontSize, fontWeight, lineHeight }
export { duration, easing, transition }

/**
 * Generate CSS custom-property declarations from a theme object.
 *
 * Each `em_foo_bar` key is exported as `--em-foo-bar`. Non-string values are
 * stringified. This is what `ThemeProvider` writes onto `documentElement`
 * so plain CSS files (Popup/index.css, Options.css, ExtensionListItem.css)
 * can reference the same tokens via `var(--em-color-primary)`.
 */
export function cssVariables(theme) {
  const lines = []
  for (const [key, value] of Object.entries(theme)) {
    if (!key.startsWith("em_")) continue
    if (value == null) continue
    if (typeof value === "object") continue
    const cssKey = "--" + key.replace(/_/g, "-")
    lines.push(`${cssKey}: ${value};`)
  }
  return lines.join("\n")
}

/**
 * Apply a theme's CSS custom properties to a target element (defaults to
 * `documentElement`). Returns a cleanup function that removes the props.
 */
export function applyCssVariables(theme, target) {
  const el = target || (typeof document !== "undefined" ? document.documentElement : null)
  if (!el) return () => {}
  const applied = []
  for (const [key, value] of Object.entries(theme)) {
    if (!key.startsWith("em_")) continue
    if (value == null) continue
    if (typeof value === "object") continue
    const cssKey = "--" + key.replace(/_/g, "-")
    el.style.setProperty(cssKey, String(value))
    applied.push(cssKey)
  }
  return () => {
    for (const k of applied) el.style.removeProperty(k)
  }
}
