import React, { memo } from "react"

import { CopyOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"
import { Popconfirm } from "antd"
import { styled } from "styled-components"

import { IconButton, Switch } from ".../design-system"
import { getLang } from ".../utils/utils"

const OperationView = memo((props) => {
  const { record, onEdit, onDuplicate, onDelete, onEnabled } = props
  return (
    <Style>
      <div className="operation">
        <IconButton
          tooltip={getLang("edit") || "Edit"}
          icon={<FormOutlined />}
          onClick={() => onEdit?.(record)}
        />
        <IconButton
          tooltip={getLang("duplicate") || "Duplicate"}
          icon={<CopyOutlined />}
          onClick={() => onDuplicate?.(record)}
        />

        <Popconfirm
          title={getLang("rule_action_delete_action")}
          description="Are you sure to delete this rule?"
          onConfirm={() => onDelete?.(record)}
          okText="Yes"
          cancelText="Cancel">
          <IconButton tooltip={getLang("delete") || "Delete"} icon={<DeleteOutlined />} />
        </Popconfirm>

        <Switch
          size="small"
          aria-label={`${record.enable ? "Disable" : "Enable"} rule`}
          checked={record.enable}
          onChange={(e) => onEnabled?.(record, e)}></Switch>
      </div>
    </Style>
  )
})

export default OperationView

const Style = styled.div`
  font-size: 20px;

  .operation {
    display: flex;
    align-items: center;

    & > * {
      margin-right: 10px;
    }
  }
`
