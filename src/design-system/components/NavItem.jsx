import React from "react"
import { NavLink } from "react-router-dom"

/**
 * Design-system NavItem — thin wrapper around `react-router-dom` NavLink
 * that:
 *  - Adds the `active` class alongside any caller-supplied class
 *  - Lets callers render either plain children or a render-prop receiving
 *    `{ isActive }` for conditional UI inside the link
 *
 * `react-router-dom` v6's NavLink already applies `aria-current="page"` to
 * the underlying anchor when it matches the current route, so we don't
 * duplicate that attribute here.
 */
function NavItem({ to, className, children, onClick, end, ...rest }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={(navState) => {
        // Resolve `className` to a string. Callers can pass the same shapes
        // NavLink supports (string, undefined, or a function-of-navState),
        // and we always append the `active` class when the link matches.
        const resolved = typeof className === "function" ? className(navState) : className
        return [resolved, navState.isActive ? "active" : null].filter(Boolean).join(" ")
      }}
      {...rest}>
      {({ isActive }) => (
        <span className="em-nav-item-inner">
          {typeof children === "function" ? children({ isActive }) : children}
        </span>
      )}
    </NavLink>
  )
}

export default NavItem
