import React, { Suspense, lazy, memo, useCallback, useEffect, useRef, useState } from "react"

import { MenuOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons"
import Icon from "@ant-design/icons/lib/components/Icon"
import { Space, message } from "antd"
import _ from "lodash"

import EdgeIcon from ".../assets/img/Microsoft_Store.svg"
import ChromeWebStoreIcon from ".../assets/img/chrome-web-store-icon.svg"
import DarkIcon from ".../assets/img/design-devin/Dark.svg"
import LightIcon from ".../assets/img/design-devin/Light.svg"
import storage from ".../storage/sync"
import { isEdgePackage } from ".../utils/channelHelper"
import { getLang } from ".../utils/utils"
import Style, { SearchStyle } from "./HeaderStyle"
import GroupDropdown from "./header/GroupDropdown"
import SceneDropdown from "./header/SceneDropdown"

// import MoreOperationDropdown from "./header/MoreOperationDropdown"
const LazyMoreOperationDropdown = lazy(() => import("./header/MoreOperationDropdown"))

const Header = memo((props) => {
  const {
    activeCount,
    totalCount,
    options,
    onGroupChanged,
    onLayoutChanged,
    onSearch,
    isDarkMode
  } = props

  const [messageApi, contextHolder] = message.useMessage()

  // Whether to render the More Operations menu (delayed for first paint)
  const [isShowOperations, setIsShowOperations] = useState(false)
  // Whether the search bar is visible
  const [isShowSearch, setIsShowSearch] = useState(options.setting.isShowSearchBarDefault)
  // Layout style: list | grid
  const [layout, setLayout] = useState(options.setting.layout)

  const [searchText, setSearchText] = useState("")
  const searchInputRef = useRef(null)

  useEffect(() => {
    setIsShowOperations(true)
  }, [])

  useEffect(() => {
    if (isShowSearch) {
      searchInputRef.current?.focus()
    }

    if (isShowSearch) {
      // 48px header + ~36px search row
      document.documentElement.style.setProperty("--header-height", `84px`)
    } else {
      document.documentElement.style.setProperty("--header-height", `48px`)
    }
  }, [isShowSearch])

  const saveLayout = (layout) => {
    storage.options.getAll().then((options) => {
      const setting = { ...options.setting, layout: layout }
      storage.options.set({ setting: setting })
    })
  }

  const onSearchClick = () => {
    const show = !isShowSearch
    setIsShowSearch(show)
    if (!show) {
      setSearchText("")
      onSearch?.("")
    }
  }

  const onLayoutClick = () => {
    if (!layout || layout === "list") {
      setLayout("grid")
      onLayoutChanged("grid")
      saveLayout("grid")
    } else {
      setLayout("list")
      onLayoutChanged("list")
      saveLayout("list")
    }
  }

  const onSettingClick = useCallback((e) => {
    chrome.management.getSelf((self) => {
      chrome.tabs.create({ url: self.optionsUrl })
    })
  }, [])

  const onSearchTextChange = (e) => {
    const text = e.target.value
    setSearchText(text)
    throttleSearch(text)
  }

  const throttleSearch = _.throttle((text) => {
    onSearch?.(text)
  }, 500)

  useEffect(() => {
    const onKeydown = (e) => {
      // Allow Escape to close the search bar regardless of focus, since the
      // input lives inside the popup (focus traps don't apply here).
      if (e.key === "Escape" && isShowSearch) {
        setIsShowSearch(false)
        setSearchText("")
        onSearch?.("")
        e.preventDefault()
        return
      }

      switch (e.key) {
        case "f":
          if (!isShowSearch) {
            setIsShowSearch(true)
            e.preventDefault()
          }
          return
        case "s":
          if (isShowSearch) {
            return
          }
          onSettingClick(e)
          e.preventDefault()
          return
        default:
          return
      }
    }

    document.addEventListener("keydown", onKeydown)
    return () => {
      document.removeEventListener("keydown", onKeydown)
    }
  }, [isShowSearch, onSearch, onSettingClick])

  /**
   * 应用商店搜索
   */
  const onStoreSearch = () => {
    if (!options.setting.isSupportSearchAppStore) {
      return
    }

    if (!searchText || searchText.trim() === "") {
      return
    }

    const source = options.setting.extensionSearchSource
    if (source === "crxsoso") {
      chrome.tabs.create({
        url: `https://www.crxsoso.com/search?keyword=${searchText.trim()}`
      })
    } else {
      if (isEdgePackage()) {
        chrome.tabs.create({
          url: `https://microsoftedge.microsoft.com/addons/search/${searchText.trim()}`
        })
      } else {
        chrome.tabs.create({ url: `https://chromewebstore.google.com/search/${searchText.trim()}` })
      }
    }
  }

  /**
   * 构建应用商店搜索的按钮图标
   */
  const buildStoreSearchIcon = () => {
    if (!options.setting.isSupportSearchAppStore) {
      return
    }
    if (!searchText || searchText.trim() === "") {
      return null
    }

    const altText = isEdgePackage()
      ? "Search Microsoft Edge Add-ons store"
      : "Search Chrome Web Store"

    return isEdgePackage() ? (
      <img
        src={EdgeIcon}
        className="store-icon edge-store-icon"
        alt={altText}
        role="button"
        tabIndex={0}
        onClick={(e) => onStoreSearch()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onStoreSearch()
          }
        }}
      />
    ) : (
      <img
        src={ChromeWebStoreIcon}
        className="store-icon chrome-store-icon"
        alt={altText}
        role="button"
        tabIndex={0}
        onClick={(e) => onStoreSearch()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onStoreSearch()
          }
        }}
      />
    )
  }

  const searchLabel = getLang("setting_popup_setting_search") || "Search extensions"
  const layoutLabel =
    layout === "grid"
      ? getLang("popup_layout_switch_to_list") || "Switch to list view"
      : getLang("popup_layout_switch_to_grid") || "Switch to grid view"
  const settingLabel = getLang("setting_title") || "Open settings"
  const moreLabel = getLang("more_operation") || "More operations"

  return (
    <>
      {contextHolder}
      <Style as="header" role="banner">
        <div className="left">
          <img src={isDarkMode ? DarkIcon : LightIcon} alt="Extension Manager logo" />
          <h2 aria-live="polite" aria-label={`${activeCount} of ${totalCount} extensions enabled`}>
            {activeCount}/{totalCount}
          </h2>
        </div>

        {isShowOperations && (
          <div className="right" role="toolbar" aria-label="Popup actions">
            <SceneDropdown className="dropdown" options={options}></SceneDropdown>

            <GroupDropdown
              className="dropdown"
              options={options}
              onGroupChanged={onGroupChanged}></GroupDropdown>

            <Space
              className="search setting-icon"
              role="button"
              tabIndex={0}
              aria-label={searchLabel}
              aria-pressed={isShowSearch}
              onClick={onSearchClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSearchClick()
                }
              }}>
              <SearchOutlined />
            </Space>

            <Space
              className="layout setting-icon"
              role="button"
              tabIndex={0}
              aria-label={layoutLabel}
              onClick={onLayoutClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onLayoutClick()
                }
              }}>
              <Icon component={LayoutSvg}></Icon>
            </Space>

            <Space
              className="setting setting-icon"
              role="button"
              tabIndex={0}
              aria-label={settingLabel}
              onClick={(e) => onSettingClick(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSettingClick(e)
                }
              }}>
              <SettingOutlined />
            </Space>

            <Suspense
              fallback={
                <span aria-label={moreLabel} role="img">
                  <MenuOutlined />
                </span>
              }>
              <LazyMoreOperationDropdown
                className="dropdown more-operation"
                options={options}
                messageApi={messageApi}
              />
            </Suspense>
          </div>
        )}
      </Style>

      {isShowSearch && (
        <SearchStyle role="search" aria-label={searchLabel}>
          <input
            type="search"
            placeholder={searchLabel}
            value={searchText}
            aria-label={searchLabel}
            onChange={(e) => onSearchTextChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onStoreSearch()
              }
            }}
            ref={searchInputRef}></input>
          {buildStoreSearchIcon()}
        </SearchStyle>
      )}
    </>
  )
})

export default Header

const LayoutSvg = () => (
  <svg
    t="1692520761982"
    viewBox="0 0 1124 1124"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="4835"
    fill="currentColor"
    aria-hidden="true"
    width="1em"
    height="1em">
    <path
      d="M896 298.666667H128a128 128 0 0 1-128-128V128a128 128 0 0 1 128-128h768a128 128 0 0 1 128 128v42.666667a128 128 0 0 1-128 128zM128 85.333333a42.666667 42.666667 0 0 0-42.666667 42.666667v42.666667a42.666667 42.666667 0 0 0 42.666667 42.666666h768a42.666667 42.666667 0 0 0 42.666667-42.666666V128a42.666667 42.666667 0 0 0-42.666667-42.666667zM213.333333 1024H128a128 128 0 0 1-128-128v-384a128 128 0 0 1 128-128h85.333333a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128zM128 469.333333a42.666667 42.666667 0 0 0-42.666667 42.666667v384a42.666667 42.666667 0 0 0 42.666667 42.666667h85.333333a42.666667 42.666667 0 0 0 42.666667-42.666667v-384a42.666667 42.666667 0 0 0-42.666667-42.666667zM896 1024h-341.333333a128 128 0 0 1-128-128v-384a128 128 0 0 1 128-128h341.333333a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128z m-341.333333-554.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v384a42.666667 42.666667 0 0 0 42.666667 42.666667h341.333333a42.666667 42.666667 0 0 0 42.666667-42.666667v-384a42.666667 42.666667 0 0 0-42.666667-42.666667z"
      p-id="4836"></path>
  </svg>
)
