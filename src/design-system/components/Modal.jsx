import React from "react"

import { Modal as AntModal } from "antd"

/**
 * Design-system Modal — wraps `antd/Modal` so all callers benefit from a
 * consistent default (closable, masked, escape-to-close on by default).
 * AntD's modal already implements focus trap and focus restoration.
 */
function Modal(props) {
  return <AntModal maskClosable closable destroyOnClose keyboard {...props} />
}

export default Modal
