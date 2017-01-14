import React, { Component, PropTypes } from 'react'
import Link from '../../Link'

const SearchBar = (props) => {
  const className = `BoardShowPage-MenuSideBar-SearchBar ${props.className||''}`
    return <input
      type="text"
      className="BoardShowPage-MenuSideBar-ArchivedItems-SearchBox"
      placeholder="Search archive..."
      value={props.value}
      onChange={props.onChange}
    />
  }

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

module.exports = SearchBar
