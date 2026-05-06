import { styled } from "styled-components"

export const ExtensionManageStyle = styled.div`
  .extension-manage-tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--em-space-2, 10px);
    margin-bottom: var(--em-space-3, 10px);
  }

  .extension-manage-tools-left {
    display: flex;
    align-items: baseline;
    gap: var(--em-space-2, 10px);

    .search {
      width: 300px;
    }

    .settings-checkbox {
      margin: 0;
    }
  }

  .extension-manage-tools-right {
    display: flex;
    align-items: baseline;
    gap: var(--em-space-3, 12px);

    margin-right: var(--em-space-6, 24px);
  }

  .ant-table-wrapper {
    margin-right: var(--em-space-1, 5px);
  }

  .column-index {
    display: inline-block;
    width: 100%;
    text-align: center;
  }

  .ant-table-expanded-row .ant-table-cell {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .ant-form-item {
    margin-bottom: 8px;
  }

  .column-hidden {
    display: none;
  }

  /* 控制文本换行最多不超过2行 */
  .text-wrap-max-two-line {
    min-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`
