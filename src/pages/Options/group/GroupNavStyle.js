import styled from "styled-components"

export const GroupNavStyle = styled.div`
  .tab-container {
    display: flex;
    align-items: center;

    height: 48px;

    margin-bottom: var(--em-space-3, 10px);
    padding: 0 var(--em-space-1, 5px) 0 var(--em-space-3, 10px);

    border-radius: var(--em-radius-md, 6px);
    box-shadow: var(--em-shadow-sm, ${(props) => props.theme.card_shadow});
    transition: var(--em-transition-hover);

    user-select: none;

    &:hover {
      background-color: var(--em-color-primary, #337ab7cc);
    }

    &:hover .tab-operation {
      display: block;
    }

    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .tab-container .tab-operation {
    flex: 0 0 auto;
    display: none;
    color: var(--em-color-primary-hover, ${(props) => props.theme.nav_link_hover});
    font-size: var(--em-font-size-xl, 18px);
  }

  .tab-operation-item {
    margin: 0 var(--em-space-1, 5px);
  }

  .selected-group-item {
    background: var(--em-color-primary, #337ab788);
  }

  .add-new-group {
    color: var(--em-color-primary-hover, ${(props) => props.theme.nav_link_hover});
    font-size: var(--em-font-size-xl, 18px);
    justify-content: center;
  }

  .tab-container h3 {
    flex-grow: 1;
  }
`
