import React, { forwardRef } from "react"

/**
 * Design-system Input — styled native `<input>` that picks up design-system
 * tokens via CSS custom properties. We use a native input (rather than
 * `antd/Input`) because the popup search currently uses a native input and
 * we want a drop-in replacement that adds rounded corners, focus ring and
 * the standard transition.
 *
 * Any caller that wants the AntD-styled input can keep using `antd/Input`.
 */
const Input = forwardRef(function Input({ className, style, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={["em-ds-input", className].filter(Boolean).join(" ")}
      style={style}
      {...rest}
    />
  )
})

export default Input
