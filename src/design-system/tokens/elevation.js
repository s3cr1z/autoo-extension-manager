/**
 * Elevation (shadows) and border-radius tokens.
 *
 * The shadow values intentionally match the `em_shadow_*` keys in colors.js
 * so they stay in sync between light and dark themes — this file is the
 * canonical source for theme-agnostic radii.
 */

export const radius = {
  none: "0px",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  full: "9999px"
}

export const shadow = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)",
  md: "0 2px 8px rgba(0, 0, 0, 0.12)",
  lg: "0 4px 16px rgba(0, 0, 0, 0.18)"
}
