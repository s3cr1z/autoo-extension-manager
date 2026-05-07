import styled from "styled-components"

export const SceneStyle = styled.div`
  position: relative;
  height: 100%;

  .current-active-scene-title {
    font-size: var(--em-font-size-lg, 16px);
    color: var(--em-text-primary, ${(props) => props.theme.fg3});
  }

  .scene-item-container {
    max-width: 800px;

    margin: var(--em-space-6, 24px) 0;

    user-select: none;
  }

  @media screen and (max-width: 1400px) {
    .scene-item-container {
      max-width: 800px;
    }
  }

  @media screen and (max-width: 1000000px) {
    .scene-item-container {
      max-width: 60vw;
    }
  }

  .scene-item {
    position: relative;
    display: flex;
    align-items: center;

    padding: var(--em-space-1, 4px) var(--em-space-2, 8px);
    margin: var(--em-space-1, 4px) var(--em-space-1, 4px) var(--em-space-1, 4px) 0;
    border-radius: var(--em-radius-md, 6px);
    transition: var(--em-transition-hover);

    h3 {
      flex: 1 1 auto;

      margin-right: var(--em-space-6, 24px);

      font-size: var(--em-font-size-base, 14px);
      font-weight: var(--em-font-weight-bold, 700);

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  @keyframes menu-edit-in {
    0% {
      opacity: 0;
      transform: translateY(10%);
    }

    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }

  .scene-item-edit-container {
    display: none;
    justify-content: left;

    opacity: 0;

    width: 100%;
    position: absolute;
    top: -32px;
    left: 6px;
    padding-bottom: 16px;

    animation: menu-edit-in var(--em-duration-slow, 300ms) var(--em-easing-ease-out) 0.2s forwards;

    .scene-item-edit-icon {
      display: flex;
      justify-content: center;

      padding: var(--em-space-1, 4px) var(--em-space-2, 8px);

      background-color: var(--em-bg-elevated, ${(props) => props.theme.scene_edit_bg});
      border-radius: var(--em-radius-sm, 4px);

      box-shadow: var(--em-shadow-sm, 1px 1px 2px 0px ${(props) => props.theme.scene_edit_shadow});

      font-size: 20px;
      color: var(--em-color-primary);

      & > span:hover {
        cursor: pointer;
        color: var(--em-color-primary-hover);
      }
    }
  }

  .scene-item-selected {
    color: var(--em-color-primary);
    font-weight: var(--em-font-weight-bold, 900);
  }

  .scene-item-selected:hover .scene-item-edit-container {
    display: flex;
  }

  .scene-item-handler-container {
    display: flex;
  }

  .scene-item-name {
    transition: color var(--em-duration-fast, 150ms) var(--em-easing-ease-out);
    &:hover {
      color: var(--em-color-primary);
    }
  }

  .scene-item-new {
    width: 180px;
    padding: var(--em-space-3, 14px) var(--em-space-4, 16px);

    border-radius: calc(var(--em-radius-sm, 4px) / var(--scale-x, 1));
    box-shadow: var(--em-shadow-sm, ${(props) => props.theme.sortable_shadow});
    transition: var(--em-transition-hover);

    &:hover {
      background-color: var(--em-bg-hover, ${(props) => props.theme.scene_new_hover_bg});
    }

    .scene-item-add-icon {
      font-size: var(--em-font-size-lg, 16px);
      margin-right: var(--em-space-1, 6px);
      color: var(--em-color-primary);
    }
  }

  .scene-selected-detail {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;

    max-width: 800px;

    margin: var(--em-space-5, 20px) var(--em-space-2, 10px) 0px 0px;
    padding: var(--em-space-2, 8px);

    border: 1px solid var(--em-border-default, ${(props) => props.theme.border3});
    border-radius: var(--em-radius-md, 6px);
    background-color: var(--em-bg-elevated);
    box-shadow: var(--em-shadow-sm);

    h3 {
      display: inline-block;
      font-size: var(--em-font-size-base, 14px);
      font-weight: var(--em-font-weight-bold, 700);
    }

    p {
      padding: 0;
      margin: var(--em-space-1, 4px) 0 0 0;

      font-size: var(--em-font-size-sm, 12px);
      line-height: var(--em-line-height-normal, 18px);
    }
  }

  .scene-edit-panel {
    position: absolute;
    margin-top: 60px;
    top: 0px;
    left: 0px;
    right: 0px;
    height: calc(100% - 60px);
  }
`
