/**
 * Typography tokens.
 *
 * Font stack matches the existing `body` rule in src/pages/Popup/index.css.
 */

export const fontFamily = {
  base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  mono: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace'
}

export const fontSize = {
  xs: "11px",
  sm: "12px",
  base: "14px",
  lg: "16px",
  xl: "18px",
  "2xl": "24px"
}

export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75
}

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
}

export const typography = { fontFamily, fontSize, lineHeight, fontWeight }
