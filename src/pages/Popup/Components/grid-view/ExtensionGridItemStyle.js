import { styled } from "styled-components"

export const ExtensionGridItemStyle = styled.div`
  position: relative;

  img {
    width: 42px;
    height: 42px;
    user-select: none;
  }

  .grid-display-item {
    position: relative;

    transition: transform var(--em-duration-slow, 300ms) var(--em-easing-ease-out),
      box-shadow var(--em-duration-slow, 300ms) var(--em-easing-ease-out);
    border-radius: var(--em-radius-md, 6px);
  }

  .grid-display-item:focus-visible {
    outline: 2px solid var(--em-color-primary, #337ab7);
    outline-offset: 2px;
  }

  .grid-display-item-scale {
    transform: scale(1.2);
  }

  .grid-display-item-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .grid-display-item-title {
    max-width: 66px;
    margin-top: var(--em-space-1, 4px);
    color: var(--em-text-primary, ${(props) => props.theme.enable_text});
    font-size: var(--em-font-size-sm, 12px);

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    user-select: none;
  }

  .grid-name-tooltip {
    display: none;
    position: fixed;
    z-index: 99999;

    max-width: 300px;
    padding: var(--em-space-1, 4px) var(--em-space-2, 8px);

    font-size: var(--em-font-size-sm, 12px);
    line-height: var(--em-line-height-tight, 1.4);
    color: var(--em-text-on-primary, #fff);
    background-color: rgba(0, 0, 0, 0.78);
    border-radius: var(--em-radius-sm, 4px);
    white-space: normal;
    word-break: break-word;
    pointer-events: none;
    user-select: none;

    box-shadow: var(--em-shadow-md, 0 2px 6px rgba(0, 0, 0, 0.2));
  }

  .grid-name-tooltip-show {
    display: block;
  }

  .tooltip-arrow {
    position: absolute;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    transform: translateX(-50%);
  }

  .tooltip-arrow-top {
    top: -4px;
    border-bottom: 4px solid rgba(0, 0, 0, 0.78);
  }

  .tooltip-arrow-bottom {
    bottom: -4px;
    border-top: 4px solid rgba(0, 0, 0, 0.78);
  }

  .grid-display-item-title-gray {
    color: var(--em-text-disabled, ${(props) => props.theme.disable_text});
  }

  .item-pined-dot {
    position: absolute;
    top: -1px;
    right: -1px;

    width: 12px;
    height: 12px;
    margin: 0;

    border: 2px solid var(--em-bg-primary, #fff);
    border-radius: var(--em-radius-full, 6px);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);

    background-color: var(--em-color-success, #3ffa7b);
  }

  .operation-menu {
    display: none;
    position: absolute;
    width: 160px;
    height: 70px;

    z-index: 1000;

    border-radius: var(--em-radius-sm, 4px);
    background-color: var(--em-color-accent, #24bfc4);

    box-shadow: var(--em-shadow-md, 0 2px 6px rgba(36, 193, 192, 0.4));
  }

  /* Disabled hover-menu styling */
  .operation-menu-disable {
    filter: grayscale(70%);
  }

  .operation-menu-title {
    padding: var(--em-space-2, 8px) var(--em-space-3, 12px);
    color: var(--em-text-on-primary, #fff);
    text-align: center;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    border-radius: var(--em-radius-sm, 4px) var(--em-radius-sm, 4px) 0 0;
    background-color: var(--em-color-accent-deep, #27b0d4);
  }

  .operation-menu-items {
    display: flex;
    align-items: center;
    justify-content: space-around;

    margin-top: var(--em-space-1, 4px);
    padding: 2px var(--em-space-2, 8px);

    font-size: 22px;
    color: var(--em-text-on-primary, #fff);
  }

  .menu-on {
    display: block;
  }

  @keyframes menu-right-in {
    0% {
      opacity: 0;
      transform: translateX(-5%);
    }

    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }

  @keyframes menu-left-in {
    0% {
      opacity: 0;
      transform: translateX(5%);
    }

    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }

  .menu-right {
    opacity: 0;
    top: -10px;
    left: 58px;

    animation: menu-right-in var(--em-duration-normal, 200ms) var(--em-easing-ease-out)
      ${(props) => props.animation_delay}s forwards;
  }

  .menu-left {
    opacity: 0;
    top: -10px;
    right: 58px;

    animation: menu-left-in var(--em-duration-normal, 200ms) var(--em-easing-ease-out)
      ${(props) => props.animation_delay}s forwards;
  }

  .operation-menu-item-disabled {
    color: var(--em-border-strong, #ccc);
  }

  .operation-menu-item {
    font-size: 20px;
    transition: transform var(--em-duration-fast, 100ms) var(--em-easing-ease-out);

    &:hover,
    &:focus-visible {
      transform: scale(1.2);
      color: var(--em-color-primary, #346dbc);
      text-shadow: 2px 2px 4px var(--em-color-accent, #24bfc4);
      outline: none;
    }
  }

  .grid-item-disable {
    filter: grayscale(70%) opacity(0.6);
    transition: filter var(--em-duration-normal, 200ms) var(--em-easing-ease-out);

    &:hover {
      filter: none;
    }
  }
`
