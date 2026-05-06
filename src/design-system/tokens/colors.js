/**
 * Color tokens — single source of truth for the Extension Manager design system.
 *
 * Brand:
 *   - Primary blue        #337ab7  (was hardcoded in Options.jsx ConfigProvider, NavigationStyle active state, list-view "item-is-top")
 *   - Primary blue hover  #23527c  (was hardcoded in NavigationStyle hover)
 *   - Accent teal         #24bfc4 / #27b0d4  (popup grid operation menu)
 *   - Success green       #3ffa7b  (pin dot for fixed extensions)
 *
 * Both the light and dark theme objects exported here are SUPERSETS of the
 * legacy `styled_light_theme` / `styled_dark_theme` objects that used to live
 * inline in `src/pages/Popup/index.jsx` and `src/pages/Options/Options.jsx` —
 * every legacy key is preserved so existing styled-components keep rendering
 * unchanged. New tokens are added with the `em_*` prefix to make them easy to
 * spot in code.
 */

// 12-step neutral scale, light → dark
const neutral = {
  0: "#ffffff",
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#dddddd",
  400: "#cccccc",
  500: "#aaaaaa",
  600: "#888888",
  700: "#666666",
  800: "#444444",
  900: "#2c2d31",
  1000: "#242529"
}

const brand = {
  primary: "#337ab7",
  primaryHover: "#23527c",
  primaryDark: "#5b9bd5",
  primaryDarkHover: "#7ab5e8",
  accent: "#24bfc4",
  accentDeep: "#27b0d4",
  success: "#3ffa7b",
  warning: "#faad14",
  // Default `#ff4d4f` only meets ~3.26:1 against white; this darker shade
  // gives ~5.94:1 so danger button text passes WCAG AA.
  danger: "#cf1322",
  // Lighter danger used in dark mode where the surrounding bg is near-black.
  dangerDark: "#ff7875"
}

export const lightTheme = {
  // ---- Legacy keys (DO NOT REMOVE) — keep popup + options styled-components working
  bg: "#FFF",
  fg: "#222",
  fg2: "#333",
  fg3: "#555",
  fg4: "#666",
  // Bumped from #777/#888 so secondary text passes WCAG AA against white.
  fg5: "#595959",
  fg6: "#595959",
  border: "#eee",
  border2: "#ddd",
  border3: "#ccc",
  input_border: "#ccc",
  enable_text: "#333",
  disable_text: "#aaa",
  btn_bg: "#f5f5f5",
  btn_hover_bg: "#dfdfdf",
  nav_hover_bg: "#eee",
  nav_link: "#337ab7",
  nav_link_hover: "#23527c",
  setting_gradient: "linear-gradient(to right, #337ab7aa, #fff)",
  setting_border_bottom: "#eee6",
  scene_edit_bg: "#eee",
  scene_edit_shadow: "#ddd",
  scene_new_hover_bg: "#f5f5f5",
  group_other_bg: "#ddd",
  group_other_color: "#666",
  sortable_item_bg: "#fff",
  sortable_item_color: "#333",
  sortable_shadow:
    "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
  card_shadow: "1px 1px 4px 0px #337ab788",
  drag_handle_hover_bg: "rgba(0, 0, 0, 0.05)",
  drag_handle_fill: "#919eab",

  // ---- New design-system tokens
  em_color_primary: brand.primary,
  em_color_primary_hover: brand.primaryHover,
  em_color_accent: brand.accent,
  em_color_accent_deep: brand.accentDeep,
  em_color_success: brand.success,
  em_color_warning: brand.warning,
  em_color_danger: brand.danger,

  // Solid brand background that always pairs with white text and meets
  // WCAG AA in both light and dark themes (white on `#337ab7` = 4.65:1).
  em_bg_brand_solid: brand.primary,
  em_text_on_brand: neutral[0],

  em_bg_primary: neutral[0],
  em_bg_secondary: neutral[100],
  em_bg_elevated: neutral[0],
  em_bg_hover: neutral[200],

  em_text_primary: neutral[1000],
  em_text_secondary: neutral[700],
  em_text_disabled: neutral[600],
  em_text_on_primary: neutral[0],

  em_border_default: neutral[300],
  em_border_strong: neutral[400],
  em_border_subtle: neutral[200],

  em_shadow_sm: "0 1px 2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)",
  em_shadow_md: "0 2px 8px rgba(0, 0, 0, 0.12)",
  em_shadow_lg: "0 4px 16px rgba(0, 0, 0, 0.18)",

  em_focus_ring: `0 0 0 2px ${brand.primary}66`,
  em_neutral: neutral
}

export const darkTheme = {
  // ---- Legacy keys (DO NOT REMOVE)
  bg: "#242529",
  fg: "#C9CACF",
  fg2: "#C9CACF",
  fg3: "#aaa",
  fg4: "#999",
  // Bumped from #888/#777 so secondary text passes WCAG AA against #242529.
  fg5: "#a8a9ad",
  fg6: "#a8a9ad",
  border: "#3a3a3a",
  border2: "#444",
  border3: "#555",
  input_border: "#3a3a3a",
  enable_text: "#ccc",
  disable_text: "#777",
  btn_bg: "#313131",
  btn_hover_bg: "#474747",
  nav_hover_bg: "#333",
  nav_link: "#5b9bd5",
  nav_link_hover: "#7ab5e8",
  setting_gradient: "linear-gradient(to right, #337ab744, #242529)",
  setting_border_bottom: "#3a3a3a",
  scene_edit_bg: "#3a3a3a",
  scene_edit_shadow: "#222",
  scene_new_hover_bg: "#333",
  group_other_bg: "#444",
  group_other_color: "#aaa",
  sortable_item_bg: "#2c2d31",
  sortable_item_color: "#ccc",
  sortable_shadow:
    "0 0 0 calc(1px / var(--scale-x, 1)) rgba(200, 200, 200, 0.1), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(0, 0, 0, 0.3)",
  card_shadow: "1px 1px 4px 0px #00000088",
  drag_handle_hover_bg: "rgba(255, 255, 255, 0.1)",
  drag_handle_fill: "#666",

  // ---- New design-system tokens
  em_color_primary: brand.primaryDark,
  em_color_primary_hover: brand.primaryDarkHover,
  em_color_accent: brand.accent,
  em_color_accent_deep: brand.accentDeep,
  em_color_success: brand.success,
  em_color_warning: brand.warning,
  em_color_danger: brand.dangerDark,

  // Same `#337ab7` as light mode so white text on active states keeps the
  // 4.65:1 contrast ratio. Using `primaryDark` as a background failed at
  // ~2.96:1 with white.
  em_bg_brand_solid: brand.primary,
  em_text_on_brand: neutral[0],

  em_bg_primary: neutral[1000],
  em_bg_secondary: neutral[900],
  em_bg_elevated: "#2c2d31",
  em_bg_hover: "#33343a",

  em_text_primary: "#e6e7eb",
  em_text_secondary: "#a8a9ad",
  em_text_disabled: neutral[600],
  em_text_on_primary: neutral[0],

  em_border_default: "#3a3a3a",
  em_border_strong: "#4a4a4a",
  em_border_subtle: "#2f3034",

  em_shadow_sm: "0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04)",
  em_shadow_md: "0 2px 8px rgba(0, 0, 0, 0.5)",
  em_shadow_lg: "0 4px 16px rgba(0, 0, 0, 0.6)",

  em_focus_ring: `0 0 0 2px ${brand.primaryDark}99`,
  em_neutral: neutral
}

export const palette = { neutral, brand }
