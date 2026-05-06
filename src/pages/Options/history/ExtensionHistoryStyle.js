import { styled } from "styled-components"

const Style = styled.div`
  .history-manage-tools {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--em-space-2, 10px);

    margin-bottom: var(--em-space-3, 10px);
  }

  .history-manage-tools-left {
    display: flex;
    align-items: baseline;
    gap: var(--em-space-2, 10px);

    .search {
      width: 300px;
    }
  }

  .history-manage-tools-right {
    margin: 0 var(--em-space-5, 20px) 0 0;

    display: flex;
    gap: var(--em-space-2, 10px);
  }

  .setting-operation-item {
    margin: 0 0 0 var(--em-space-2, 10px);
  }

  .ant-table-wrapper {
    margin-right: var(--em-space-1, 5px);
  }

  .column-index {
    display: inline-block;
    width: 100%;
    padding-left: 2px;
  }

  .column-name {
    display: inline-block;
    position: relative;
    width: 100%;
  }

  .column-name-title {
    display: flex;
    align-items: center;

    img {
      margin-right: 5px;
    }
  }

  .column-name:hover .column-name-solo {
    display: block;
  }

  .column-name-solo {
    display: none;
    position: absolute;
    top: -2px;
    right: 2px;
    font-size: var(--em-font-size-lg, 16px);
    color: var(--em-color-primary, ${(props) => props.theme.nav_link});

    & > .ant-space:nth-child(1) {
      margin-right: var(--em-space-3, 12px);
    }

    :hover {
      color: var(--em-color-danger, #9e1068);
    }
  }

  .column-remark-link {
    margin: 0 0.2rem;
  }
`

export default Style
