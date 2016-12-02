import React, { Component } from 'react'
import createStoreProvider from './createStoreProvider'
import boardsStore from '../stores/boardsStore'
import Layout from './Layout'
import Link from './Link'
import BoardStar from './BoardStar'
import './LoggedInHomepage.sass'

const LoggedInHomepage = props => {
  const { boards } = props

  if (!boards) {
    return <Layout className="LoggedInHomepage">
      <div>Loading...</div>
    </Layout>
  }

  let starredBoards = boards.filter(board => board.starred)
  if (starredBoards.length > 0) {
    starredBoards = <Boards title="Starred Boards" boards={starredBoards} />
  }

  return <Layout className="LoggedInHomepage">
    {starredBoards}
    <Boards title="All boards" boards={boards} />
  </Layout>
}

const Boards = ({title, boards}) => {
  if (!boards) return null

  const elements = boards.map(board =>
    <Board key={board.id} board={board} />
  )

  return <div>
    <div className="LoggedInHomepage-BoardListHeading">
      {title}
    </div>
    <div className="LoggedInHomepage-Boards" >
    {elements}
    </div>
  </div>
}

const Board = ({board}) => {
  const style = {
    backgroundColor: board.background_color
  }

  return <Link style={style} href={`/boards/${board.id}`} className="LoggedInHomepage-Board">
    {board.name}
    <BoardStar board={board} onChange={_ => boardsStore.reload() } />
  </Link>
}

export default createStoreProvider({
  as: 'boards',
  store: boardsStore,
  render: LoggedInHomepage,
})
