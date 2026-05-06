/**
 * Motion tokens.
 *
 * Standardize animation durations and easings so micro-interactions feel
 * consistent across popup and options pages.
 */

export const duration = {
  fast: "100ms",
  normal: "200ms",
  slow: "300ms"
}

export const easing = {
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)"
}

export const transition = {
  hover: `background-color ${duration.normal} ${easing.easeOut}, color ${duration.normal} ${easing.easeOut}, border-color ${duration.normal} ${easing.easeOut}`,
  press: `transform ${duration.fast} ${easing.easeOut}`
}
