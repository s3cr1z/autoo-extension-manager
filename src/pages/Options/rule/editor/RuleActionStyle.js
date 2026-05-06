import { styled } from "styled-components"

const Style = styled.div`
  .action-label {
    font-size: var(--em-font-size-base, 14px);
  }

  .advance-options {
    display: flex;
    & > span {
      margin-right: var(--em-space-1, 5px);
    }
  }

  .hidden-action-mode {
    display: none;
  }

  .advance-option-tips {
    margin-left: var(--em-space-3, 10px);
    font-size: var(--em-font-size-xs, 11px);
    color: var(--em-text-secondary, ${(props) => props.theme.fg5});
  }

  .action-tip-url-match {
    margin: var(--em-space-3, 12px) 0;
  }

  .action-tip-match-type {
    margin: var(--em-space-3, 12px) 0;

    font-size: var(--em-font-size-sm, 12px);
    color: var(--em-text-secondary, ${(props) => props.theme.fg5});
  }

  .action-show-options {
    margin: var(--em-space-4, 16px) 0 0 0;
  }

  .action-refresh-options {
    display: flex;
    margin: var(--em-space-1, 5px) 0 var(--em-space-3, 10px) 0;
  }
`

export default Style
