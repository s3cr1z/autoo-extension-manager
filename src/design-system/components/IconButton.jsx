import React, { forwardRef } from "react"

import { Button as AntButton, Tooltip } from "antd"

/**
 * Design-system IconButton — wraps `antd/Button type="text"` to provide
 * consistent sizing, an accessible name (via `tooltip` -> `aria-label` if
 * caller didn't supply one) and a focus-visible outline.
 *
 * Props:
 *  - tooltip: string. Shown as a tooltip and (if `aria-label` is not given)
 *      used as the button's accessible name.
 *  - icon: ReactNode (required). The icon element to render.
 *  - size: "small" | "middle" | "large" (default "middle"; matches AntD).
 *  - All other AntD Button props are forwarded.
 */
const IconButton = forwardRef(function IconButton(
  { tooltip, icon, "aria-label": ariaLabel, children, type = "text", ...rest },
  ref
) {
  const accessibleName =
    ariaLabel || tooltip || (typeof children === "string" ? children : undefined)

  const button = (
    <AntButton ref={ref} type={type} icon={icon} aria-label={accessibleName} {...rest}>
      {children}
    </AntButton>
  )

  if (tooltip) {
    return (
      <Tooltip title={tooltip} mouseEnterDelay={0.4}>
        {button}
      </Tooltip>
    )
  }
  return button
})

export default IconButton
