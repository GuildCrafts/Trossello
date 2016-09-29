import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import PresentationalComponent from './PresentationalComponent'

const FakeBoards = {}

FakeBoards[1] = {
  id: 1,
  name: 'Peters Life',
  lists: [
    {
      id: 2321321,
      name: 'Home Shopping',
      cards: [
        { id: 87, description: "buy some cheese" }
      ]
    },
    {
      id: 3444,
      name: 'Work Stuffs',
      cards: [
        { id: 43, description: "TPS reports" },
        { id: 12, description: "clean our junk drawer" },
        { id: 66, description: "read 1,000 lines of code" },
        { id: 32, description: "learn everything about react" },
        { id: 67, description: "buy Jared a donut" },
        { id: 44, description: "steal Stan's stapler" },
        { id: 22, description: "take a nap" }
      ]
    }
  ]
}

FakeBoards[2] = {
  id: 2,
  name: 'empty board example',
  lists: []
}

const BoardShowPage = (props) => {
  const boardId = props.params.boardId
  const board = FakeBoards[boardId]

  if (!board) return <div>Board Not Found</div>

  const lists = board.lists.map(list => {
    return <List key={list.id} list={list} />
  })

  const style = {
    backgroundColor: '#21a09e'
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
  </div>
}

const Card = (props) => {
  const { card } = props
  return <div className="BoardShowPage-Card">
    <div>{card.description}</div>
  </div>
}

export default PresentationalComponent(BoardShowPage)
