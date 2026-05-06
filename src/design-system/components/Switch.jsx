import React, { forwardRef } from "react"

import { Switch as AntSwitch } from "antd"

/**
 * Design-system Switch — wraps `antd/Switch` and accepts either the standard
 * `aria-label` prop or a `label` shorthand and forwards it as the
 * `aria-label`. Callers should always supply one of the two — without it,
 * screen readers announce switches as just "switch" with no context.
 *
 * In development we warn when a Switch is rendered without an accessible
 * name so this is caught early; in production we still let it through to
 * avoid breaking existing call sites.
 */
const Switch = forwardRef(function Switch({ "aria-label": ariaLabel, label, ...rest }, ref) {
  const computedAria = ariaLabel || label
  if (process.env.NODE_ENV !== "production" && !computedAria && !rest["aria-labelledby"]) {
    // eslint-disable-next-line no-console
    console.warn(
      "[design-system/Switch] Rendered without `aria-label`, `label`, or `aria-labelledby`."
    )
  }
  return <AntSwitch ref={ref} aria-label={computedAria} {...rest} />
})

export default Switch
