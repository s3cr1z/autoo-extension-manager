import styled from "styled-components"

export const NavigationStyle = styled.nav`
  margin-top: var(--em-space-3, 10px);
  margin-left: var(--em-space-5, 20px);
  width: 260px;

  a {
    text-decoration: none;
    color: var(--em-color-primary, ${(props) => props.theme.nav_link});
  }

  h1 {
    color: var(--em-color-primary, ${(props) => props.theme.nav_link});
    margin-bottom: var(--em-space-8, 30px);
    font-size: var(--em-font-size-2xl, 24px);
    font-weight: var(--em-font-weight-bold, 700);
    transition: color var(--em-duration-fast, 150ms) var(--em-easing-ease-out);

    &:hover {
      color: var(--em-color-primary-hover, ${(props) => props.theme.nav_link_hover});
      text-decoration: underline;
    }
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;

    margin-bottom: var(--em-space-1, 6px);
    padding-left: var(--em-space-3, 12px);

    font-size: var(--em-font-size-base, 14px);
    line-height: 40px;
    color: var(--em-color-primary, ${(props) => props.theme.nav_link});

    border-radius: var(--em-radius-md, 6px);
    transition: var(--em-transition-hover);

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 8px;
      bottom: 8px;
      width: 3px;
      border-radius: 0 var(--em-radius-sm, 4px) var(--em-radius-sm, 4px) 0;
      background-color: transparent;
      transition: background-color var(--em-duration-normal, 200ms) var(--em-easing-ease-out);
    }

    &:hover {
      background-color: var(--em-bg-hover, ${(props) => props.theme.nav_hover_bg});
    }

    &.active {
      background-color: var(--em-color-primary, #337ab7);
      color: var(--em-text-on-primary, #fff);

      &::before {
        background-color: var(--em-color-primary-hover, #23527c);
      }
    }

    &:focus-visible {
      outline: 2px solid var(--em-color-primary, #337ab7);
      outline-offset: 2px;
    }

    & .anticon {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
    }

    & > .text {
      margin-left: var(--em-space-2, 8px);
    }
  }
`
