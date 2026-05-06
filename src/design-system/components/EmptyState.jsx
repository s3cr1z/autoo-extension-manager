import React from "react"

import { Empty } from "antd"

/**
 * Design-system EmptyState — thin wrapper over `antd/Empty` for "no data"
 * presentations across popup search, options lists, history view, etc.
 *
 * Props:
 *  - title: short headline (defaults to "No results")
 *  - description: optional subtitle
 *  - icon: optional icon ReactNode (defaults to AntD's image)
 *  - children: optional CTA buttons rendered below the description
 */
function EmptyState({ title = "No results", description, icon, children, ...rest }) {
  const desc = (
    <div role="status" aria-live="polite" style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 600, fontSize: "var(--em-font-size-base, 14px)" }}>{title}</div>
      {description && (
        <div
          style={{
            color: "var(--em-text-secondary)",
            marginTop: "var(--em-space-1, 4px)",
            fontSize: "var(--em-font-size-sm, 12px)"
          }}>
          {description}
        </div>
      )}
    </div>
  )

  return (
    <Empty image={icon ?? Empty.PRESENTED_IMAGE_SIMPLE} description={desc} {...rest}>
      {children}
    </Empty>
  )
}

export default EmptyState
