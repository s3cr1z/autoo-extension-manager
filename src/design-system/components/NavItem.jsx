import React from "react"
import { NavLink } from "react-router-dom"

/**
 * Design-system NavItem — wraps `react-router-dom` NavLink to add:
 *  - `aria-current="page"` on the active link
 *  - consistent class naming so styling is centralized in NavigationStyle
 *
 * The wrapped NavLink already exposes whether it is active via the
 * function-as-children pattern; we use that to set aria-current correctly.
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
        <span aria-current={isActive ? "page" : undefined} className="em-nav-item-inner">
          {typeof children === "function" ? children({ isActive }) : children}
        </span>
      )}
    </NavLink>
  )
}

export default NavItem
