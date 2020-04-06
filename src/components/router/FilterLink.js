import React from 'react'
import { NavLink } from 'react-router-dom'

const FilterLink = ({ location, children }) => (
  <NavLink
    exact
    to= {`/${location}`}
    activeStyle={{
      textDecoration: 'none',
      color: 'black'
    }}
  >
    {children}
  </NavLink>
)

export default FilterLink