import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
// import PresentationalComponent from './PresentationalComponent'

const BoardShowPage = (props) => {
  return <Layout className="BoardShowPage" style={style}>
    <div className="BoardShowPage-Header">
      <h1>{props.board.name}</h1>
    </div>
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



export default BoardShowPage
