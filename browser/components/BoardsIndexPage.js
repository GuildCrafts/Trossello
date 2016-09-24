import React, { Component } from 'react'
// import './BoardsIndexPage.sass'
import Link from './Link'
import Layout from './Layout'
import PresentationalComponent from './PresentationalComponent'

const BoardsIndexPage = (props) => {
  return <Layout className="BoardsIndexPage">
    <h1>Boards Index Page </h1>
    <ol>
      <li>
        <Link to="/boards/12">Board 12</Link>
      </li>
      <li>
        <Link to="/boards/25">Board 25</Link>
      </li>
      <li>
        <Link to="/boards/34">Board 34</Link>
      </li>
      <li>
        <Link to="/boards/84">Board 84</Link>
      </li>
    </ol>
  </Layout>
}

export default PresentationalComponent(BoardsIndexPage)
