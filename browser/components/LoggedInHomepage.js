import React, { Component } from 'react'
import Layout from './Layout'
import PresentationalComponent from './PresentationalComponent'
import Link from './Link'
import './LoggedInHomepage.sass'

const LoggedInHomepage = (props) => {
  const { auth, state } = props
  console.log('state', state)
  return <Layout className="LoggedInHomepage">
    <div className = "LoggedInHomepage-BoardListHeading">
      Personal Boards
    </div>
    <Boards boards={state.boards} />
  </Layout>
}

export default PresentationalComponent(LoggedInHomepage)

const BoardListHeading = (props) => {
  return
}

const Boards = ({boards}) => {
  const elements = boards.records.map(board =>
    <Board key={board.id} board={board} />
  )
  return <div className="LoggedInHomepage-Boards">
    {elements}
  </div>
}

const Board = ({board}) => {
  return <Link to={`/boards/${board.id}`} className="LoggedInHomepage-Board">
    <div>{board.name}</div>
  </Link>
}
