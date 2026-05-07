import React, { memo } from "react"

import classNames from "classnames"
import styled from "styled-components"

import { isEdgeRuntime } from ".../utils/channelHelper"

/**
 * 标记扩展的来源渠道
 */
const ExtensionChannelLabel = memo(({ channel }) => {
  if (!channel) {
    return null
  }

  if (!isEdgeRuntime() && channel === "Chrome") {
    return null
  }

  let text = channel
  if (channel === "Development") {
    text = "Dev"
  }

  return (
    <Style>
      <span className={classNames(["column-name-channel", `column-name-channel-${channel}`])}>
        {text}
      </span>
    </Style>
  )
})

export default ExtensionChannelLabel

const Style = styled.span`
  .column-name-channel {
    position: relative;
    left: 8px;

    padding: 1px 5px;
    font-size: 12px;
    border-radius: 5px;
    background-color: var(--em-bg-success-subtle);
  }

  .column-name-channel-Edge {
    background-color: var(--em-bg-info-subtle);
  }

  .column-name-channel-Chrome {
    background-color: var(--em-bg-warning-subtle);
  }

  .column-name-channel-Development {
    background-color: var(--em-bg-danger-subtle);
  }
`
