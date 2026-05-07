import styled from "styled-components"

export const AboutStyle = styled.div`
  .header-icon {
    display: flex;
    align-items: center;

    margin-top: var(--em-space-8, 30px);
    margin-bottom: var(--em-space-12, 50px);

    img {
      width: 64px;
      height: 64px;
    }

    .header-icon-text {
      margin-left: var(--em-space-5, 20px);
      h3 {
        font-size: var(--em-font-size-xl, 18px);
        margin-bottom: var(--em-space-1, 4px);
      }
      span {
        font-size: var(--em-font-size-base, 14px);
      }
    }
  }

  .content-button {
    display: flex;
    flex-wrap: wrap;
    gap: var(--em-space-2, 10px);
  }

  .footer {
    display: flex;
    flex-direction: column;

    margin-top: var(--em-space-12, 48px);

    .version {
      font-size: var(--em-font-size-base, 14px);
      margin-bottom: var(--em-space-3, 12px);
    }

    .version-update {
      width: 500px;
      margin-bottom: var(--em-space-3, 12px);
    }

    .ant-tag-has-color {
      padding: 0px 5px 1px 5px;
    }

    .badges-tag {
      &:hover {
        cursor: pointer;
      }

      &:focus-visible {
        outline: 2px solid var(--em-color-primary);
        outline-offset: 2px;
      }
    }
  }

  .footer-storage {
    display: inline-flex;
    align-items: center;

    margin-top: var(--em-space-5, 20px);
    padding-top: var(--em-space-1, 5px);
    border-top: 1px solid var(--em-border-default, ${(props) => props.theme.border3});

    .storage-detail-tip-icon {
      margin-left: var(--em-space-1, 5px);
      &:hover {
        color: var(--em-text-secondary, ${(props) => props.theme.fg6});
      }

      &:focus-visible {
        outline: 2px solid var(--em-color-primary);
        outline-offset: 2px;
      }
    }
  }
`
