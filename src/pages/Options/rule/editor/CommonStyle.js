import { styled } from "styled-components"

const EditorCommonStyle = styled.div`
  margin-bottom: var(--em-space-6, 24px);

  .editor-step-header {
    position: relative;

    height: 36px;

    &:after {
      content: "";
      display: block;
      width: 100%;
      height: 2px;
      margin: var(--em-space-1, 5px) 0;

      background: var(--em-color-primary, #337ab7);
      border-radius: var(--em-radius-full, 9999px);
    }

    .title {
      font-size: var(--em-font-size-xl, 18px);
      font-weight: var(--em-font-weight-semibold, 600);
      color: var(--em-text-primary, ${(props) => props.theme.fg2});
    }
  }
`

export default EditorCommonStyle
