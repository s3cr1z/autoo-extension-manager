import React, { memo, useEffect, useRef, useState } from "react"

import {
  DeleteOutlined,
  HomeOutlined,
  LockOutlined,
  SettingOutlined,
  ToolOutlined,
  UnlockOutlined
} from "@ant-design/icons"
import { Space, message } from "antd"
import classNames from "classnames"

import Badge from ".../design-system/components/Badge"
import { ManualEnableCounter } from ".../storage/local/ManualEnableCounter"
import { isDevRuntime } from ".../utils/channelHelper"
import { getHomepageUrl, getIcon, getOriginSettingUrl } from ".../utils/extensionHelper.js"
import { getLang } from ".../utils/utils"
import { isStringEmpty } from ".../utils/utils.js"
import { useExtensionItemPin } from "../../hooks/useExtensionItemPin"
import { ExtensionGridItemStyle } from "./ExtensionGridItemStyle"

const manualEnableCounter = new ManualEnableCounter()

const ExtensionGridItem = memo(({ item, options, enabled, onItemMove }) => {
  const [messageApi, contextHolder] = message.useMessage()

  // 扩展存在设置页面
  const existOptionPage = !isStringEmpty(item.optionsUrl)
  // 扩展存在 Home 页面
  const existHomePage = !isStringEmpty(item.homepageUrl)

  // 扩展是否可用
  const [itemEnable, setItemEnable] = useState(enabled ?? item.enabled)
  // 扩展是否在固定分组中
  const [itemPined, setItemPined] = useExtensionItemPin(item, options)

  // 是否启用了切换分组时，执行启用/禁用扩展的操作。如果没有打开这个功能，则没必要显示锁的标记
  const canLock = options.setting.isRaiseEnableWhenSwitchGroup ?? false

  useEffect(() => {
    setItemEnable(item.enabled)
  }, [item, enabled])

  // 交互状态：鼠标是否 hover
  const [isMouseEnter, setIsMouseEnter] = useState(false)
  // 交互状态：鼠标右键是否点击
  const [isMouseRightClick, setIsMouseRightClick] = useState(false)
  // 交互状态：菜单是否显示
  const [isMenuShow, setIsMenuShow] = useState(false)
  // UI 状态：菜单显示的位置
  const [isMenuOnRight, setIsMenuOnRight] = useState(true)

  // 是否显示 APP 名称
  const isShowAppNameInGirdView = options.setting.isShowAppNameInGirdView ?? true
  // 禁用扩展使用灰色
  const grayStyleOfDisable = options.setting.isGaryStyleOfDisableInGridView ?? false
  // 固定分组扩展的小圆点
  const isShowDotOfFixedExtension = options.setting.isShowDotOfFixedExtension ?? true
  // 菜单显示的方式，false: hover 显示，true: 鼠标右键点击显示
  const menuDisplayByRightClick = options.setting.isMenuDisplayByRightClick ?? false

  const containerRef = useRef(null)
  const menuRef = useRef(null)
  const tooltipRef = useRef(null)
  // tooltip 固定定位的坐标
  const [tooltipStyle, setTooltipStyle] = useState({})

  const checkMenuPosition = () => {
    const containerRect = containerRef.current.getBoundingClientRect()
    const menuRect = menuRef.current.getBoundingClientRect()
    const rightSpace = window.innerWidth - containerRect.right

    if (rightSpace < menuRect.width) {
      setIsMenuOnRight(false)
    } else {
      setIsMenuOnRight(true)
    }
  }

  const checkTooltipPosition = () => {
    if (!tooltipRef.current || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const tooltipEl = tooltipRef.current
    // 先临时显示以获取尺寸
    tooltipEl.style.visibility = "hidden"
    tooltipEl.style.display = "block"
    const tooltipRect = tooltipEl.getBoundingClientRect()
    tooltipEl.style.visibility = ""
    tooltipEl.style.display = ""

    const margin = 6
    const arrowSize = 5
    const style = {}

    // 垂直方向：优先显示在下方，空间不足则显示在上方
    const bottomSpace = window.innerHeight - containerRect.bottom
    if (bottomSpace < tooltipRect.height + margin + arrowSize) {
      style.top = containerRect.top - tooltipRect.height - arrowSize - margin
      style.arrowVertical = "bottom" // 箭头在 tooltip 下方
    } else {
      style.top = containerRect.bottom + arrowSize + margin
      style.arrowVertical = "top" // 箭头在 tooltip 上方
    }

    // 水平方向：优先居中，空间不足则偏移
    const centerX = containerRect.left + containerRect.width / 2
    let left = centerX - tooltipRect.width / 2
    if (left < margin) {
      left = margin
    } else if (left + tooltipRect.width > window.innerWidth - margin) {
      left = window.innerWidth - margin - tooltipRect.width
    }
    style.left = left

    // 箭头水平位置（相对 tooltip 左边距）
    style.arrowLeft = Math.max(8, Math.min(centerX - left, tooltipRect.width - 8))

    setTooltipStyle(style)
  }

  useEffect(() => {
    checkMenuPosition()
    checkTooltipPosition()
  }, [isMouseEnter, isMouseRightClick])

  const handleItemMouseEnter = () => {
    setIsMouseEnter(true)
  }

  const handleItemMouseLeave = () => {
    setTimeout(() => {
      setIsMouseEnter(false)
      setIsMouseRightClick(false)
    }, 60) // 鼠标从 item 移动到 menu 上，需要一点时间
  }

  const handleMenuMouseEnter = () => {
    setIsMenuShow(true)
  }

  const handleMenuMouseLeave = () => {
    setIsMenuShow(false)
    setIsMouseRightClick(false)
  }

  const handleItemMouseClick = (e) => {
    if (e.button === 2) {
      setIsMouseRightClick(true)
    }
  }

  const handleContextMenu = (e) => {
    // 在扩展 Item 上，禁用默认的右键菜单，其它地方不禁用
    e.preventDefault()
  }

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.addEventListener("contextmenu", handleContextMenu)
      return () => {
        el.removeEventListener("contextmenu", handleContextMenu)
      }
    }
  }, [])

  /**
   * 打开扩展设置页面
   */
  const handleSettingButtonClick = (e, item) => {
    if (existOptionPage) {
      if (!item.enabled) {
        messageApi.info(getLang("extension_not_enable"))
        return
      }
      chrome.tabs.create({ url: item.optionsUrl })
    }
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

  /**
   * 删除扩展
   */
  const confirmDeleteExtension = (e, item) => {
    chrome.management.uninstall(item.id)
    setIsMouseEnter(false)
  }

  /**
   * 固定/解除固定扩展（是否放在固定分组中）
   */
  const handlePinButtonClick = (e, item) => {
    setItemPined(!itemPined)
  }

  const onItemClick = () => {
    if (itemEnable) {
      chrome.management.setEnabled(item.id, false)
      setItemEnable(false)
      item.enabled = false
      onItemMove?.(item)
      messageApi.info(`${getLang("disable_extension")} ${item.name}`)
    } else {
      chrome.management.setEnabled(item.id, true)
      setItemEnable(true)
      item.enabled = true
      onItemMove?.(item)
      messageApi.info(`${getLang("enable_extension")} ${item.name}`)
      manualEnableCounter.count(item.id)
    }
  }

  return (
    <ExtensionGridItemStyle
      ref={containerRef}
      onMouseEnter={handleItemMouseEnter}
      onMouseLeave={handleItemMouseLeave}
      onMouseUpCapture={handleItemMouseClick}
      animation_delay={menuDisplayByRightClick ? 0 : 0.3}>
      {contextHolder}
      {/* Extension display */}
      <div
        className={classNames([
          "grid-display-item",
          { "grid-display-item-scale": isMouseEnter || isMenuShow }
        ])}
        role="button"
        tabIndex={0}
        aria-label={`${itemEnable ? "Disable" : "Enable"} ${item.name}`}
        aria-pressed={itemEnable}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onItemClick()
          } else if (e.key === "Escape" && (isMenuShow || isMouseEnter)) {
            setIsMouseEnter(false)
            setIsMenuShow(false)
            setIsMouseRightClick(false)
          }
        }}
        onClick={onItemClick}>
        <div
          className={classNames([
            "grid-display-item-box",
            { "grid-item-disable": !itemEnable && grayStyleOfDisable }
          ])}>
          <img src={getIcon(item, 128)} alt="icon" />
          {isShowAppNameInGirdView && (
            <span
              className={classNames([
                "grid-display-item-title",
                {
                  "grid-display-item-title-gray": !itemEnable
                }
              ])}>
              {getExtItemDisplayName(item)}
            </span>
          )}
        </div>
        {itemPined && isShowDotOfFixedExtension && (
          <Badge
            tone="success"
            className="item-pined-dot"
            srLabel={getLang("fixed_extension_dot_tip") || "Pinned"}
          />
        )}
      </div>

      {/* 名称 tooltip（fixed 定位，脱离层叠上下文） */}
      <div
        ref={tooltipRef}
        className={classNames([
          "grid-name-tooltip",
          { "grid-name-tooltip-show": isMouseEnter || isMenuShow }
        ])}
        style={
          tooltipStyle.top !== undefined ? { top: tooltipStyle.top, left: tooltipStyle.left } : {}
        }>
        {/* 箭头 */}
        <span
          className={classNames([
            "tooltip-arrow",
            tooltipStyle.arrowVertical === "bottom" ? "tooltip-arrow-bottom" : "tooltip-arrow-top"
          ])}
          style={tooltipStyle.arrowLeft !== undefined ? { left: tooltipStyle.arrowLeft } : {}}
        />
        {item.name}
      </div>

      {/* Hover/right-click operation menu */}
      <div
        className={classNames([
          "operation-menu",
          {
            "menu-right": isMenuOnRight,
            "menu-left": !isMenuOnRight,
            "menu-on": (menuDisplayByRightClick ? isMouseRightClick : isMouseEnter) || isMenuShow,
            "operation-menu-disable": !itemEnable
          }
        ])}
        role="menu"
        aria-label={`${item.name} ${getLang("actions") || "actions"}`}
        onKeyDown={(e) => {
          const focusableItems = Array.from(
            menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])') ?? []
          )
          const currentIndex = focusableItems.indexOf(document.activeElement)
          if (e.key === "Escape") {
            setIsMouseEnter(false)
            setIsMenuShow(false)
            setIsMouseRightClick(false)
            containerRef.current?.querySelector(".grid-display-item")?.focus()
            e.preventDefault()
          } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            focusableItems[(currentIndex + 1) % focusableItems.length]?.focus()
            e.preventDefault()
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            focusableItems[
              (currentIndex - 1 + focusableItems.length) % focusableItems.length
            ]?.focus()
            e.preventDefault()
          }
        }}
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMenuMouseLeave}
        ref={menuRef}>
        <h3 className="operation-menu-title">{item.name}</h3>
        <div className="operation-menu-items">
          {canLock && (
            <Space
              className="operation-menu-item"
              role="menuitem"
              tabIndex={0}
              aria-label={
                itemPined
                  ? getLang("unpin_extension") || "Unpin from current group"
                  : getLang("pin_extension") || "Pin to current group"
              }
              onClick={(e) => handlePinButtonClick(e, item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handlePinButtonClick(e, item)
                }
              }}>
              {itemPined ? <LockOutlined /> : <UnlockOutlined />}
            </Space>
          )}
          <Space
            className={classNames({
              "operation-menu-item-disabled": !existOptionPage,
              "operation-menu-item": existOptionPage
            })}
            role="menuitem"
            tabIndex={existOptionPage ? 0 : -1}
            aria-label={`${getLang("setting_title") || "Settings"}: ${item.name}`}
            aria-disabled={!existOptionPage}
            onClick={(e) => handleSettingButtonClick(e, item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleSettingButtonClick(e, item)
              }
            }}>
            <SettingOutlined />
          </Space>
          <Space
            className="operation-menu-item"
            role="menuitem"
            tabIndex={0}
            aria-label={`${getLang("delete") || "Delete"}: ${item.name}`}
            onClick={(e) => confirmDeleteExtension(e, item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                confirmDeleteExtension(e, item)
              }
            }}>
            <DeleteOutlined />
          </Space>
          <Space
            className={classNames({
              "operation-menu-item-disabled": !existHomePage,
              "operation-menu-item": existHomePage
            })}
            role="menuitem"
            tabIndex={existHomePage ? 0 : -1}
            aria-label={`${getLang("home_page") || "Open homepage"}: ${item.name}`}
            aria-disabled={!existHomePage}
            onClick={(e) => handleHomeButtonClick(e, item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleHomeButtonClick(e, item)
              }
            }}>
            <HomeOutlined />
          </Space>
          <Space
            className="operation-menu-item"
            role="menuitem"
            tabIndex={0}
            aria-label={`${getLang("chrome_extension_setting") || "Browser settings"}: ${
              item.name
            }`}
            onClick={(e) => handleOriginSettingButtonClick(e, item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleOriginSettingButtonClick(e, item)
              }
            }}>
            <ToolOutlined />
          </Space>
        </div>
      </div>
    </ExtensionGridItemStyle>
  )
})

export default ExtensionGridItem

function getExtItemDisplayName(item) {
  try {
    if (item.__attach__?.alias) {
      return item.__attach__.alias
    }

    if (item.name.indexOf("-") > 0) {
      return item.name.split("-")[0].trim()
    }

    if (item.name.indexOf(":") > 0) {
      return item.name.split(":")[0].trim()
    }

    if (item.name.indexOf("：") > 0) {
      return item.name.split("：")[0].trim()
    }

    return item.name.trim()
  } catch (error) {
    console.error("尝试中扩展数据中获取短名称失败", item, error)
    return item.name
  }
}
