import React, { memo, useEffect, useState } from "react"

import { QuestionCircleOutlined } from "@ant-design/icons"
import { Radio, Slider, Switch } from "antd"

import { getLang } from ".../utils/utils"

const ViewOtherSetting = memo(({ setting, onSettingChange }) => {
  // Popup 暗色模式
  const [darkMode, setDarkMode] = useState("system")
  // Popup 缩放比例
  const [zoomRatio, setZoomRatio] = useState(100)
  const [useNewUI, setUseNewUI] = useState(true)

  useEffect(() => {
    const initDarkMode = setting.darkMode ?? "system"
    setDarkMode(initDarkMode)
    const ratio = setting.zoomRatio ?? 100
    setZoomRatio(ratio)
    setUseNewUI(setting.useNewUI ?? true)
  }, [setting])

  return (
    <div>
      {/* 暗色模式 */}
      <div className="setting-item">
        <span>{getLang("setting_dark_mode_title")}</span>
        <Radio.Group
          size="small"
          onChange={(e) => {
            onSettingChange(e.target.value, setDarkMode, "darkMode")
          }}
          value={darkMode}>
          <Radio value="light">{getLang("setting_dark_mode_light")}</Radio>
          <Radio value="dark">{getLang("setting_dark_mode_dark")}</Radio>
          <Radio value="system">{getLang("setting_dark_mode_system")}</Radio>
        </Radio.Group>
      </div>

      {/* 缩放比例 */}
      <div className="setting-item">
        <span>{getLang("setting_popup_scale_title")}</span>
        <Slider
          ariaLabelForHandle={getLang("setting_popup_scale_title")}
          style={{ width: 100, margin: "0 10px 0 0" }}
          defaultValue={100}
          value={zoomRatio}
          onChange={(value) => onSettingChange(value, setZoomRatio, "zoomRatio")}
          min={10}
          max={100}
          step={1}
        />
      </div>

      <div className="setting-item">
        <span>{getLang("setting_use_new_ui") || "Use new UI"}</span>
        <Switch
          size="small"
          aria-label={getLang("setting_use_new_ui") || "Use new UI"}
          checked={useNewUI}
          onChange={(value) => onSettingChange(value, setUseNewUI, "useNewUI")}
        />
      </div>
    </div>
  )
})

export default ViewOtherSetting
