import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import PresentationalComponent from './PresentationalComponent'

const BoardShowPage = (props) => {
  const { state } = props
  const boardId = props.params.boardId
  const board = state.boards.records
    .find(record => record.id == boardId)

  if (!board) return <div>Board Not Found</div>

  const lists = board.lists.map(list => {
    return <List key={list.id} list={list} />
  })

  const style = {
    backgroundColor: board.background_color
  }

  return <Layout className="BoardShowPage" style={style}>
    <div className="BoardShowPage-Header">
      <h1>{board.name}</h1>
    </div>

    <div className="BoardShowPage-lists">{lists}</div>
  </Layout>
}

const List = (props) => {
  const { list } = props
  const cards = list.cards.map(card => {
    return <Card key={card.id} card={card} />
  })
  return <div className="BoardShowPage-List">
    <div className="BoardShowPage-ListHeader">{list.name}</div>
    <div className="BoardShowPage-cards">{cards}</div>
    <div className="BoardShowPage-add-card">Add a card…</div>
  </div>
}

const Card = (props) => {
  const { card } = props
  return <div className="BoardShowPage-Card">
    <div>{card.description}</div>
  </div>
}

export default PresentationalComponent(BoardShowPage)
