import React, { memo, useEffect, useState } from "react"

import {
  DeleteOutlined,
  HomeOutlined,
  LockOutlined,
  SettingOutlined,
  ToolOutlined,
  UnlockOutlined
} from "@ant-design/icons"
import { message } from "antd"
import classNames from "classnames"

import "./ExtensionListItem.css"

import { Badge, IconButton, Switch } from ".../design-system"
import { ManualEnableCounter } from ".../storage/local/ManualEnableCounter"
import { getHomepageUrl, getIcon, getOriginSettingUrl } from ".../utils/extensionHelper.js"
import { getLang } from ".../utils/utils"
import { isStringEmpty } from ".../utils/utils.js"
import { useExtensionItemPin } from "../../hooks/useExtensionItemPin"

const manualEnableCounter = new ManualEnableCounter()

/**
 * 扩展列表项
 */
const ExtensionListItem = memo(({ item, enabled, options, onItemEnableChanged }) => {
  const [messageApi, contextHolder] = message.useMessage()

  const [isHover, setIsHover] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [isShowOperationButton, setIsShowOperationButton] = useState(false)

  const [itemEnable, setItemEnable] = useState(enabled ?? item.enabled)
  const existOptionPage = !isStringEmpty(item.optionsUrl)
  const existHomePage = !isStringEmpty(item.homepageUrl)

  // 是否在固定分组
  const [itemPined, setItemPined] = useExtensionItemPin(item, options)
  // 固定分组的小圆点
  const isShowDotOfFixedExtension = options.setting.isShowDotOfFixedExtension ?? true

  // 是否启用了切换分组时，执行启用/禁用扩展的操作。如果没有打开这个功能，则没必要显示锁的标记
  const canLock = options.setting.isRaiseEnableWhenSwitchGroup ?? false

  // 在切换分组可以控制扩展的开启或关闭时，这里需要主动更新 enabled，否则 UI 显示会有问题
  useEffect(() => {
    setItemEnable(item.enabled)
  }, [item, enabled])

  useEffect(() => {
    const showButtonAlways = options.setting?.isShowItemOperationAlways ?? false
    setIsShowOperationButton(showButtonAlways)
  }, [options])

  const onSwitchChange = async (checked, item) => {
    await chrome.management.setEnabled(item.id, checked)
    setItemEnable(checked)
    item.enabled = checked
    if (checked) {
      manualEnableCounter.count(item.id)
    }
    onItemEnableChanged?.(item)
  }

  // 扩展名称被点击，则执行扩展启用与禁用
  const onItemNameClick = () => {
    onSwitchChange(!item.enabled, item)
  }

  const onItemMouseOver = (e) => {
    if (e.type === "mouseenter") {
      setIsHover(true)
    } else if (e.type === "mouseleave" && !isInteractive) {
      setIsHover(false)
    }
  }

  const confirmDeleteExtension = (e, item) => {
    chrome.management.uninstall(item.id)
    setIsInteractive(false)
    setIsHover(false)
  }

  const cancelDeleteExtension = (e, item) => {
    setIsInteractive(false)
    setIsHover(false)
  }

  /**
   * 打开扩展设置页面
   */
  const handleSettingButtonClick = (e, item) => {
    if (!item.enabled) {
      messageApi.info(getLang("extension_not_enable"))
      return
    }
    chrome.tabs.create({ url: item.optionsUrl })
  }

  /**
   * 打开扩展主页
   */
  const handleHomeButtonClick = (e, item) => {
    const url = getHomepageUrl(item, options.setting.isHomeLinkToStore)
    if (url) {
      chrome.tabs.create({ url })
    }
  }

  /**
   * 打开浏览器自带的扩展设置页面
   */
  const handleOriginSettingButtonClick = (e, item) => {
    const url = getOriginSettingUrl(item)
    if (url) {
      chrome.tabs.create({ url })
    }
  }

  // 如果存在别名，则显示别名
  const showName = item.__attach__?.alias ? item.__attach__?.alias : item.name

  const enableLabel = `${
    itemEnable ? getLang("disable_extension") : getLang("enable_extension")
  } ${showName}`
  const pinnedLabel = getLang("fixed_extension_dot_tip")

  return (
    <div
      onMouseEnter={(e) => onItemMouseOver(e)}
      onMouseLeave={(e) => onItemMouseOver(e)}
      className={classNames([
        "list-item-container",
        { "is-enable": itemEnable, "not-enable": !itemEnable, "item-is-top": item.__top__ }
      ])}>
      {contextHolder}

      <div className="list-item-img-box">
        <img src={getIcon(item, 128)} alt={showName} />
        {itemPined && isShowDotOfFixedExtension && (
          <Badge tone="success" srLabel={pinnedLabel} className="list-item-fix-dot" />
        )}
      </div>

      <span
        className="ext-name"
        role="button"
        tabIndex={0}
        aria-label={enableLabel}
        onClick={(e) => onItemNameClick(e, item)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onItemNameClick(e, item)
          }
        }}>
        {showName}
      </span>
      {buildOperationButton(isHover || isShowOperationButton)}
    </div>
  )

  function buildOperationButton(isHover) {
    if (!isHover) {
      return null
    } else {
      const switchLabel = `${
        itemEnable ? getLang("disable_extension") : getLang("enable_extension")
      } ${showName}`
      const lockLabel = itemPined ? getLang("unpin_extension") : getLang("pin_extension")
      const settingLabel = `${getLang("setting_title")}: ${showName}`
      const deleteLabel = `${getLang("delete")}: ${showName}`
      const homeLabel = `${getLang("a11y_open_homepage")}: ${showName}`
      const toolLabel = `${getLang("a11y_browser_settings")}: ${showName}`
      return (
        <div className="li-operation">
          <Switch
            className="switch"
            size="small"
            checked={itemEnable}
            aria-label={switchLabel}
            onChange={(e) => onSwitchChange(e, item)}></Switch>

          {canLock && (
            <IconButton
              tooltip={lockLabel}
              aria-label={lockLabel}
              icon={itemPined ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => setItemPined(!itemPined)}
            />
          )}

          <IconButton
            disabled={!existOptionPage}
            tooltip={settingLabel}
            aria-label={settingLabel}
            icon={<SettingOutlined />}
            onClick={(e) => handleSettingButtonClick(e, item)}
          />

          <IconButton
            tooltip={deleteLabel}
            aria-label={deleteLabel}
            icon={<DeleteOutlined />}
            onClick={(e) => confirmDeleteExtension(e, item)}
          />

          <IconButton
            disabled={!existHomePage}
            tooltip={homeLabel}
            aria-label={homeLabel}
            icon={<HomeOutlined />}
            onClick={(e) => handleHomeButtonClick(e, item)}
          />

          <IconButton
            tooltip={toolLabel}
            aria-label={toolLabel}
            icon={<ToolOutlined />}
            onClick={(e) => handleOriginSettingButtonClick(e, item)}
          />
        </div>
      )
    }
  }
})

export default ExtensionListItem
