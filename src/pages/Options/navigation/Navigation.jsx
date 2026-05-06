import React from "react"
import { NavLink } from "react-router-dom"

import {
  FilterFilled,
  FolderOpenFilled,
  FormatPainterFilled,
  ReconciliationFilled,
  ThunderboltFilled,
  ToolFilled
} from "@ant-design/icons"

import analytics from ".../utils/googleAnalyze"
import { getLang } from ".../utils/utils"
import { NavigationStyle } from "./NavigationStyle"

/**
 * Compose className for `react-router-dom` NavLink. The active link gets
 * the `.active` class for styling, and react-router-dom v6 already adds
 * `aria-current="page"` automatically.
 */
function navItemClass({ isActive }) {
  return ["nav-item", isActive ? "active" : null].filter(Boolean).join(" ")
}

function Navigation() {
  const reportEvent = (title) => {
    analytics.firePageViewEvent(title)
  }

  return (
    <NavigationStyle aria-label="Main navigation">
      <NavLink to="">
        <h1>Extension Manager</h1>
      </NavLink>

      <NavLink to="/setting" className={navItemClass} onClick={() => reportEvent("setting")}>
        <ToolFilled />
        <span className="text">{getLang("setting_title")}</span>
      </NavLink>

      <NavLink to="/scene" className={navItemClass} onClick={() => reportEvent("scene")}>
        <ThunderboltFilled />
        <span className="text">{getLang("scene_title")}</span>
      </NavLink>

      <NavLink to="/group" className={navItemClass} onClick={() => reportEvent("group")}>
        <FolderOpenFilled />
        <span className="text">{getLang("group_title")}</span>
      </NavLink>

      <NavLink to="/management" className={navItemClass} onClick={() => reportEvent("management")}>
        <FormatPainterFilled />
        <span className="text">{getLang("management_title")}</span>
      </NavLink>

      <NavLink to="/rule" className={navItemClass} onClick={() => reportEvent("rule")}>
        <FilterFilled />
        <span className="text">{getLang("rule_title")}</span>
      </NavLink>

      <NavLink to="/history" className={navItemClass} onClick={() => reportEvent("history")}>
        <ReconciliationFilled />
        <span className="text">{getLang("history_title")}</span>
      </NavLink>
    </NavigationStyle>
  )
}

export default Navigation
