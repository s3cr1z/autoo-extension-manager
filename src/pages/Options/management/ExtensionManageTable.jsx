import React from "react"

import { RowSkeleton } from ".../design-system"
import analytics from ".../utils/googleAnalyze.js"
import ExtensionManage from "./ExtensionManage.jsx"
import { useInit } from "./hooks/useInit.js"

const ExtensionManageTable = () => {
  const [extensions, options] = useInit((exts, allOptions) => {
    if (!allOptions) {
      return
    }
    analytics.fireEvent("alias_setting_open", {
      totalCount: allOptions.management.extensions.length
    })
  })

  if (!options) {
    return <RowSkeleton rows={8} />
  }

  return <ExtensionManage extensions={extensions} options={options}></ExtensionManage>
}

export default ExtensionManageTable
