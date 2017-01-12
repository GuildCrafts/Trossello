import React, { Component } from 'react'
// take search bar contents from unarchive
// make a component in this file
// check that the content rendered is correct
// set props to the state
// export
// replace search contents with search bar
// test


const SearchBar = ( props ) => {
  // TODO: create HTML class for search bar
  return <span className="BoardShowPage-MenuSideBar-SearchBar" >
  <input
    type="text"
    className="BoardShowPage-MenuSideBar-ArchivedItems-SearchBox"
    placeholder=""
    value={props.value}
    onChange={props.onChange}
  />
</span>
}

module.exports = SearchBar
