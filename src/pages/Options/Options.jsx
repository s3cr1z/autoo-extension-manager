import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { Spin } from "antd"

import "./Options.css"
import "./index.css"

import { ThemeProvider } from ".../design-system/ThemeProvider"
import { darkTheme, lightTheme } from ".../design-system/tokens"
import storage from ".../storage/sync"
import About from "./about/About.jsx"
import GroupManagement from "./group/IndexGroup.jsx"
import ExtensionHistoryIndex from "./history/ExtensionHistoryIndex"
import ExtensionManageIndex from "./management/ExtensionManageIndex.jsx"
import ExtensionManageTable from "./management/ExtensionManageTable"
import ExtensionImport from "./management/import/ExtensionImport"
import ExtensionShare from "./management/share/ExtensionShare"
import Navigation from "./navigation/Navigation.jsx"
import RuleSetting from "./rule/RuleSetting.jsx"
import Scene from "./scene/IndexScene.jsx"
import Settings from "./settings/Settings.jsx"

function Options() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [themeReady, setThemeReady] = useState(false)

  useEffect(() => {
    storage.options.getAll().then((options) => {
      const settingMode = options?.setting?.darkMode ?? "system"
      let dark = settingMode === "dark"
      if (settingMode === "system") {
        dark = window.matchMedia("(prefers-color-scheme: dark)").matches
      }
      setIsDarkMode(dark)
      setThemeReady(true)

      // Keep the legacy `--sortable-*` / `--drag-handle-*` CSS variables in sync
      // for the SortableList CSS (these names predate the design system).
      const t = dark ? darkTheme : lightTheme
      const root = document.documentElement
      root.style.setProperty("--sortable-item-bg", t.sortable_item_bg)
      root.style.setProperty("--sortable-item-color", t.sortable_item_color)
      root.style.setProperty("--sortable-shadow", t.sortable_shadow)
      root.style.setProperty("--drag-handle-hover-bg", t.drag_handle_hover_bg)
      root.style.setProperty("--drag-handle-fill", t.drag_handle_fill)
    })
  }, [])

  if (!themeReady) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading settings"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh"
        }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <div className="option-container">
        <div className="option-nav">
          <Navigation></Navigation>
        </div>

        <main className="option-content" aria-label="Settings content">
          <Routes>
            <Route path="/" element={<Navigate to="/about" replace />}></Route>
            <Route path="/about" element={<About />} />
            <Route path="/setting" element={<Settings />} />
            <Route path="/scene" element={<Scene />} />
            <Route path="/group" element={<GroupManagement />} />
            <Route path="/management" element={<ExtensionManageIndex />}>
              <Route index element={<ExtensionManageTable />} />
              <Route path="share" element={<ExtensionShare />} />
              <Route path="import" element={<ExtensionImport />} />
            </Route>
            <Route path="/rule" element={<RuleSetting />} />
            <Route path="/history" element={<ExtensionHistoryIndex />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Options
