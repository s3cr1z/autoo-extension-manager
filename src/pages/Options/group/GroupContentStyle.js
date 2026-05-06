import styled from "styled-components"

export const GroupContentStyle = styled.div`
  .search-sort-bar {
    display: flex;
    align-items: center;
    gap: var(--em-space-3, 12px);
    margin-bottom: var(--em-space-3, 10px);
  }

  .search {
    width: 300px;
  }

  .desc {
    margin: var(--em-space-5, 20px) var(--em-space-8, 36px) 0 var(--em-space-3, 10px);
    padding-left: var(--em-space-1, 5px);

    color: var(--em-text-secondary, ${(props) => props.theme.fg6});
    font-size: var(--em-font-size-base, 14px);
    line-height: var(--em-line-height-normal, 20px);

    border-left: 2px solid var(--em-border-default, ${(props) => props.theme.border3});
  }

  .other-group-info-container {
    margin: -16px 0 0 0;
  }

  .other-group-info-name {
    margin: 1px 0;
    padding: 2px var(--em-space-1, 4px);
    color: var(--em-text-primary, ${(props) => props.theme.group_other_color});
    border-radius: var(--em-radius-sm, 2px);
    background-color: var(--em-bg-secondary, ${(props) => props.theme.group_other_bg});
  }

  .group-name-title {
    font-size: var(--em-font-size-xl, 18px);
    font-weight: var(--em-font-weight-bold, 700);

    margin-bottom: var(--em-space-3, 10px);
    padding-bottom: var(--em-space-1, 5px);

    border-bottom: 1px solid var(--em-border-default, ${(props) => props.theme.border});
  }
`
