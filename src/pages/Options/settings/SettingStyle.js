import styled from "styled-components"

export const SettingStyle = styled.div`
  padding-bottom: var(--em-space-6, 24px);
  max-width: 720px;

  .container {
    width: 100%;
    max-width: 720px;
    padding: var(--em-space-4, 16px) var(--em-space-5, 20px);

    background: var(--em-bg-elevated);
    border: 1px solid var(--em-border-default, ${(props) => props.theme.border2});
    border-radius: var(--em-radius-lg, 8px);
    box-shadow: var(--em-shadow-sm);
  }

  .setting-sub-title {
    margin: var(--em-space-2, 10px) 0;
    font-size: var(--em-font-size-xl, 18px);
    font-weight: var(--em-font-weight-semibold, 600);
    color: var(--em-text-primary, ${(props) => props.theme.fg2});
  }

  .setting-space-title {
    display: flex;
    align-items: center;
    margin: var(--em-space-3, 12px) 0 var(--em-space-1, 4px) 0;
    font-size: var(--em-font-size-sm, 12px);
    font-weight: var(--em-font-weight-semibold, 600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--em-text-secondary, ${(props) => props.theme.fg5});

    &::before,
    &::after {
      content: "";
      flex: 1 0 auto;
      height: 1px;
      background-color: var(--em-border-subtle);
    }

    &::before {
      margin-right: var(--em-space-2, 8px);
      max-width: var(--em-space-3, 12px);
    }

    &::after {
      margin-left: var(--em-space-2, 8px);
    }
  }

  .setting-item {
    display: flex;
    align-items: center;
    gap: var(--em-space-2, 8px);
    margin: var(--em-space-1, 5px) var(--em-space-2, 10px);
    padding: var(--em-space-1, 5px) 0 var(--em-space-2, 8px) 0;

    border-bottom: 1px solid
      var(--em-border-subtle, ${(props) => props.theme.setting_border_bottom});

    span {
      flex: 1 1 auto;
      font-size: var(--em-font-size-base, 14px);
    }

    span.anticon {
      padding-top: 1px;
      margin-left: var(--em-space-1, 4px);
    }
  }

  .import-export-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--em-space-2, 10px);
    margin-top: var(--em-space-5, 20px);
  }
`
