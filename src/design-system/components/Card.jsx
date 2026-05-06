import React, { forwardRef } from "react"

import { styled } from "styled-components"

/**
 * A simple themed card surface using design-system tokens.
 *
 * Use this to replace ad-hoc `<div>` containers around extension items,
 * settings sections, group/scene blocks, etc. Renders a div by default
 * but the `as` prop allows polymorphic usage (e.g. `as="section"`).
 */
const StyledCard = styled.div`
  background-color: var(--em-bg-elevated, ${(p) => p.theme.bg});
  color: var(--em-text-primary, ${(p) => p.theme.fg});
  border: 1px solid var(--em-border-subtle, ${(p) => p.theme.border});
  border-radius: var(--em-radius-md, 6px);
  box-shadow: var(--em-shadow-sm, none);
  padding: ${(p) => p.padding ?? "var(--em-space-4, 16px)"};
  transition: var(--em-transition-hover);

  ${(p) =>
    p.interactive
      ? `&:hover { background-color: var(--em-bg-hover); box-shadow: var(--em-shadow-md); }`
      : ""}
`

const Card = forwardRef(function Card(props, ref) {
  return <StyledCard ref={ref} {...props} />
})

export default Card
