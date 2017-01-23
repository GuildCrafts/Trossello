import React, { Component } from 'react'
import createStoreProvider from '../createStoreProvider'
import boardsStore from '../../stores/boardsStore'
import Layout from '../Layout'
import Link from '../Link'
import BoardStar from '../BoardStar'
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
    starredBoards = <Boards className="LoggedInHomepage-StarredBoards" title="Starred Boards" boards={starredBoards} />
  }

  return <Layout className="LoggedInHomepage">
    {starredBoards}
    <Boards className="LoggedInHomepage-AllBoards" title="All Boards" boards={boards} />
  </Layout>
}

const Boards = ({title, boards, className}) => {
  if (!boards) return null

  const elements = boards.map(board =>
    <Board key={board.id} board={board} />
  )

  return <div className={className}>
    <div className="LoggedInHomepage-BoardListHeading">
      {title}
    </div>
    <div className="LoggedInHomepage-Boards" >
    {elements}
    </div>
  </div>
}

const Board = ({board}) => {
  return <Link href={`/boards/${board.id}`} className={`LoggedInHomepage-Board LoggedInHomepage-Board-${board.background_color}`}>
    {board.name}
    <BoardStar board={board} />
  </Link>
}

export default createStoreProvider({
  as: 'boards',
  store: boardsStore,
  render: LoggedInHomepage,
})
