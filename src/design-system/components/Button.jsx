import React, { forwardRef } from "react"

import { Button as AntButton } from "antd"

/**
 * Design-system Button — thin wrapper over `antd/Button` that:
 *  - forwards every Antd prop (drop-in replacement)
 *  - forwards refs
 *
 * `<button>` is natively focusable, so we don't need to set tabIndex
 * here; we only forward what the caller passes.
 *
 * Use this anywhere you would have used `<Button>` directly.
 */
const Button = forwardRef(function Button(props, ref) {
  return <AntButton ref={ref} {...props} />
})

export default Button
