import { styled } from "styled-components"

const Style = styled.div`
  .operation-box {
    display: inline-block;
    margin-top: var(--em-space-3, 10px);
    margin-bottom: var(--em-space-5, 20px);
    padding: var(--em-space-3, 12px) 0 0;
    border-top: 1px solid var(--em-border-default, ${(props) => props.theme.border3});

    & > button {
      width: 100px;
      margin-top: var(--em-space-3, 10px);
      margin-right: var(--em-space-3, 10px);
    }
  }
`

export default Style
