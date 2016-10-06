import './LoggedInHomepage.sass'
import React, { Component } from 'react'
import createStoreProvider from './createStoreProvider'
import boardsStore from '../stores/boardsStore'
import Layout from './Layout'
import Link from './Link'

const LoggedInHomepage = (props) => {
  const { boards } = props
  return <Layout className="LoggedInHomepage">
    <div className="LoggedInHomepage-BoardListHeading">
      All Boards
    </div>
    <Boards boards={boards} />
  </Layout>
}


export default createStoreProvider({
  as: 'boards',
  store: boardsStore,
  render: LoggedInHomepage,
})


const Boards = ({boards}) => {
  if (!boards) return null
  const elements = boards.map(board =>
    <Board key={board.id} board={board} />
  )
  return <div className="LoggedInHomepage-Boards">
    {elements}
  </div>
}

const Board = ({board}) => {
  const style = {
    backgroundColor: board.background_color
  }
  return <Link style={style} to={`/boards/${board.id}`} className="LoggedInHomepage-Board">
    <div>{board.name}</div>
  </Link>
}
