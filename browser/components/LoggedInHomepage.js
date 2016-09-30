import React, { Component } from 'react'
import Layout from './Layout'
// import BoardsIndexPage from './BoardsIndexPage'
import Link from './Link'
import './LoggedInHomepage.sass'

const LoggedInHomepage = (props) => {
  const { auth } = props
  return <Layout className="LoggedInHomepage">
    <BoardListHeading>Personal Boards</BoardListHeading>
    {/* find a person icon to include in personal board heading */}
    <BoardListing></BoardListing>

  </Layout>
}

export default LoggedInHomepage

const BoardListHeading = (props) => {
  return <div className = "LoggedInHomepage-BoardListHeading">
  {props.children}
  </div>
}

const BoardListing = (props) => {
  return <div className = "LoggedInHomepage-BoardListing">
    <ul>
      <li><div><span>Functional Tortoises</span></div></li>
      <li><div><span>LG Space Roles</span></div></li>
      <li><div><span>LG Suggestion Box</span></div></li>
      <li><div><span>Yellow</span></div></li>
      <li><div><span>Board 5</span></div></li>
      <li><div><span>Board 6</span></div></li>
      <li><div><span>Board 7</span></div></li>
      <li><div><span>Board 8</span></div></li>
    </ul>
  </div>
}
