import { styled } from "styled-components"

const Style = styled.div`
  margin-right: var(--em-space-5, 20px);

  .ant-table-cell {
    font-size: var(--em-font-size-base, 14px);
  }

  .error-text {
    font-weight: var(--em-font-weight-bold, 700);
    color: var(--em-color-danger);
  }

  .rule-row-selected {
    animation: flashing 1s infinite;
  }

  @keyframes flashing {
    0% {
      background-color: var(--em-flash-success-transparent);
    }
    50% {
      background-color: var(--em-flash-success);
    }
    100% {
      background-color: var(--em-flash-success-transparent);
    }
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: var(--em-space-3, 10px);
    margin-top: var(--em-space-3, 10px);
    margin-bottom: var(--em-space-5, 20px);

    button {
      width: 100px;
    }
  }
`

export default Style
