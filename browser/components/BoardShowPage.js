import React, { Component } from 'react'
// import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import PresentationalComponent from './PresentationalComponent'

const BoardShowPage = (props) => {
  const boardId = props.params.boardId
  return <Layout className="BoardShowPage">
    <small><Link to="/boards">back</Link></small>
    <h1>Board #{boardId}</h1>
  </Layout>
}

export default PresentationalComponent(BoardShowPage)
