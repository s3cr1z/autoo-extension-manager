import { styled } from "styled-components"

const Style = styled.div`
  display: flex;
  align-items: center;

  height: 48px;
  padding: 0 var(--em-space-2, 8px);
  margin-bottom: 2px;

  box-shadow: var(--em-shadow-sm);

  background-color: var(--em-bg-primary, ${(props) => props.theme.bg});
  color: var(--em-text-primary, ${(props) => props.theme.fg});

  .left,
  .right {
    display: flex;
    align-items: center;
  }

  .left {
    flex-grow: 1;

    img {
      margin-left: var(--em-space-2, 8px);
      margin-right: var(--em-space-3, 12px);
      width: 24px;
      height: 24px;
    }

    h2 {
      font-size: var(--em-font-size-base, 14px);
      font-weight: var(--em-font-weight-semibold, 600);
      letter-spacing: 0.2px;
    }
  }

  .right .ant-space,
  .right .ant-btn {
    transition: var(--em-transition-hover);

    &:hover {
      color: var(--em-color-primary);
    }
  }

  .right .dropdown {
    margin: 0 var(--em-space-1, 4px);
  }

  .right .search {
    margin: 0 var(--em-space-1, 4px);
  }

  .right .layout {
    margin: 0 var(--em-space-1, 4px);
  }

  .right .setting {
    margin: -2px var(--em-space-1, 4px) 0 var(--em-space-1, 4px);
  }

  .right .more-operation {
    margin: -2px var(--em-space-1, 4px) 0 var(--em-space-1, 4px);
  }

  .setting-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    font-size: 20px;
    border-radius: var(--em-radius-md, 6px);
    transition: var(--em-transition-hover);

    &:hover {
      color: var(--em-color-primary);
      background-color: var(--em-bg-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--em-color-primary);
      outline-offset: 2px;
    }
  }

  .menu-item-text {
    display: inline-block;
    max-width: 80px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

const SearchStyle = styled.div`
  position: relative;
  padding: 0 var(--em-space-2, 8px) var(--em-space-1, 4px);
  background-color: var(--em-bg-primary, ${(props) => props.theme.bg});
  animation: em-search-slide-in var(--em-duration-normal, 200ms) var(--em-easing-ease-out) forwards;

  @keyframes em-search-slide-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .em-ds-input {
    width: 100%;
    height: 30px;
    padding: 0 var(--em-space-3, 12px);
    margin: 0;

    outline-style: none;
    border: 1px solid var(--em-border-strong, ${(props) => props.theme.input_border});
    border-radius: var(--em-radius-md, 6px);
    transition: border-color var(--em-duration-normal, 200ms) var(--em-easing-ease-out),
      box-shadow var(--em-duration-normal, 200ms) var(--em-easing-ease-out);

    &:focus,
    &:focus-visible {
      border-color: var(--em-color-primary);
      outline: 0;
      box-shadow: var(--em-focus-ring);
    }

    background-color: var(--em-bg-primary, ${(props) => props.theme.bg});
    color: var(--em-text-primary, ${(props) => props.theme.fg});
  }

  .store-icon {
    position: absolute;
    cursor: pointer;
    transition: transform var(--em-duration-fast, 100ms) var(--em-easing-ease-out);

    &:hover {
      transform: scale(1.05);
    }
  }

  .chrome-store-icon {
    top: 4px;
    right: 18px;
    width: 24px;
  }

  .edge-store-icon {
    top: 1px;
    right: 18px;
    width: 24px;
  }
`

export default Style
export { SearchStyle }
