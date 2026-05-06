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
      className={({ isActive }) =>
        [className, isActive ? "active" : null].filter(Boolean).join(" ")
      }
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
