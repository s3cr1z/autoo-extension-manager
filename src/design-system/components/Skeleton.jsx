import React from "react"

import { Skeleton as AntSkeleton } from "antd"

/**
 * Design-system Skeleton — re-exports `antd/Skeleton` for convenience and
 * exposes a small `<RowSkeleton />` helper that approximates the height of
 * a popup extension list row, so we can show a placeholder while
 * `prepare()` resolves.
 */
function Skeleton(props) {
  return <AntSkeleton active {...props} />
}

export function RowSkeleton({ rows = 6 }) {
  return (
    <div
      role="status"
      aria-label="Loading extensions"
      style={{ padding: "var(--em-space-2, 8px)" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--em-space-2, 8px)",
            height: 36,
            padding: "0 var(--em-space-2, 8px)"
          }}>
          <AntSkeleton.Avatar active size={24} shape="square" />
          <AntSkeleton.Input active size="small" style={{ flex: 1, minWidth: 0 }} />
        </div>
      ))}
    </div>
  )
}

export default Skeleton
