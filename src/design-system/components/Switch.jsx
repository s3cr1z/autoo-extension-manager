import React, { forwardRef } from "react"

import { Switch as AntSwitch } from "antd"

/**
 * Design-system Switch — wraps `antd/Switch` and ensures every instance has
 * an `aria-label` (callers can override). Without this, screen readers
 * announce switches as just "switch" with no context.
 */
const Switch = forwardRef(function Switch({ "aria-label": ariaLabel, label, ...rest }, ref) {
  const computedAria = ariaLabel || label
  return <AntSwitch ref={ref} aria-label={computedAria} {...rest} />
})

export default Switch
