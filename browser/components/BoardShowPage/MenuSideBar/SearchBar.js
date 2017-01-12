import React, { Component } from 'react'
// Xtake search bar contents from unarchive
// Xmake a component in this file
// Xcheck that the content rendered is correct
// XXset props to the state
// Xexport
// Xreplace search contents with search bar
// Xtest


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
