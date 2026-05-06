import "../../wdyr"

import React from "react"
import { createRoot } from "react-dom/client"

import "antd/dist/reset.css"

import { message } from "antd"

import "./index.css"

import { ThemeProvider } from ".../design-system/ThemeProvider"
import storage from ".../storage/sync"
import { isEdgePackage, isEdgeRuntime } from ".../utils/channelHelper"
import analytics from ".../utils/googleAnalyze"
import { getLang } from ".../utils/googleAnalyzeHelper"
import { ExtensionIconBuilder } from "../Background/extension/ExtensionIconBuilder"
import Popup from "./Components/Popup"
import { prepare } from "./prepare"

const container = document.getElementById("app-container")
const root = createRoot(container)

const storageViewApi = storage.helper.view.getApi()
storageViewApi.message = message

prepare().then((props) => {
  const settingMode = props.options.setting.darkMode ?? "system"
  let isDarkMode = settingMode === "dark"
  if (settingMode === "system") {
    isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  props.params.isDarkMode = isDarkMode

  root.render(
    <ThemeProvider isDarkMode={isDarkMode}>
      <Popup
        style={{ height: "100%" }}
        originExtensions={props.extensions}
        options={props.options}
        params={props.params}
      />
    </ThemeProvider>
  )

  fireEvent(props)
})

ExtensionIconBuilder.build()

function fireEvent(props) {
  const firePopupOpen = async () => {
    const version = chrome.runtime.getManifest().version
    const ul = await getLang()
    analytics.fireEvent("page_view_popup", {
      browser: isEdgeRuntime() ? "edge" : "chrome",
      package: isEdgePackage() ? "edge" : "chrome",
      version: version,
      layout: props.options.setting.layout,
      display: props.options.setting.isDisplayByGroup ? "byGroup" : "byEnabled",
      action: props.options.setting.isRaiseEnableWhenSwitchGroup ? "raise" : "normal",
      menuDisplay: props.options.setting.isMenuDisplayByRightClick ? "rightClick" : "hover",
      lang: ul
    })
  }
  // Fire a page view event on load
  if (document.readyState === "complete") {
    firePopupOpen()
  } else {
    window.addEventListener("load", firePopupOpen, {
      once: true
    })
  }
}
