import React from "react"

import { styled } from "styled-components"

/**
 * Small status indicator dot (e.g. for "pinned/fixed" extensions).
 *
 * Replaces ad-hoc `<i className="list-item-fix-dot">` markup so screen
 * readers can announce the indicator and styling lives in one place.
 *
 * Props:
 *  - tone: "success" (default), "primary", "warning", "danger"
 *  - size: pixel size of the dot (default 10)
 *  - srLabel: accessible name announced by screen readers (e.g. "Pinned")
 *  - position: "absolute" (default) or "static"
 */
const TONE_VARS = {
  success: "var(--em-color-success, #3ffa7b)",
  primary: "var(--em-color-primary, #337ab7)",
  warning: "var(--em-color-warning, #faad14)",
  danger: "var(--em-color-danger, #ff4d4f)"
}

const Dot = styled.span`
  display: inline-block;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: var(--em-radius-full);
  background-color: ${(p) => TONE_VARS[p.$tone] || TONE_VARS.success};
  border: 2px solid var(--em-bg-primary);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  ${(p) => (p.$absolute ? `position: absolute; top: -2px; right: -2px;` : "")}
`

function Badge({ tone = "success", size = 10, srLabel, position = "absolute", className, style }) {
  return (
    <Dot
      $tone={tone}
      $size={size}
      $absolute={position === "absolute"}
      className={className}
      style={style}
      role={srLabel ? "img" : undefined}
      aria-label={srLabel}
    />
  )
}

export default Badge
