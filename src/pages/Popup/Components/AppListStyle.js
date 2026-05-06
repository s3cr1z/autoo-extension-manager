import styled from "styled-components"

const imgSize = "46px"
const imgMargin = "16px"

export const AppListStyle = styled.div`
  ul {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;

    i {
      width: ${imgSize};
      margin: 0px ${imgMargin};
    }
  }

  li {
    margin: var(--em-space-3, 12px) ${imgMargin};
    width: 42px;
    border-radius: var(--em-radius-md, 6px);
    transition: var(--em-transition-hover);
  }

  li:hover {
    background-color: var(--em-bg-hover, transparent);
  }

  .ext-item {
    text-align: center;
  }

  li img {
    display: block;
    width: ${imgSize};
    height: ${imgSize};
    margin: 0 auto;
    cursor: pointer;
  }

  li img:focus-visible {
    outline: 2px solid var(--em-color-primary, #337ab7);
    outline-offset: 2px;
  }

  li span {
    display: block;
    margin: 2px auto 0px auto;
    font-size: var(--em-font-size-sm, 12px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .not-enable {
    color: var(--em-text-disabled, #cccccc);
  }
`
