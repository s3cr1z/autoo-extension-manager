import { message } from "antd"

/**
 * Design-system Toast — re-exports `antd/message` so callers can import a
 * single toast helper from the design system. AntD's message API already
 * adds an `aria-live` polite region under the hood, so this is mostly a
 * naming-consistency wrapper.
 */
const Toast = message
export default Toast
