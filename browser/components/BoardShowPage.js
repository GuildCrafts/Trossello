import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import boardsStore from '../stores/boardsStore'
import boardStore from '../stores/boardStore'

class BoardProvider extends Component {
  constructor(props){
    super(props)
    this.rerender = this.rerender.bind(this)
    boardStore.setBoardId(props.params.boardId)
    boardStore.subscribe(this.rerender)
  }

  rerender(){
    this.forceUpdate()
  }

  componentWillReceiveProps(nextProps){
    if (this.props.params.boardId !== nextProps.params.boardId){
      boardStore.setBoardId(nextProps.params.boardId)
      boardStore.reload()
    }
  }

  render(){
    return <BoardShowPage board={boardStore.value} />
  }

}

export default BoardProvider

const BoardShowPage = ({board}) => {
  if (!board) return <Layout className="BoardShowPage" />

  const lists = board.lists.map(list => {
    const cards = board.cards.filter(card => card.list_id === list.id)
    return <List key={list.id} list={list} cards={cards} />
  })

  const style = {
    backgroundColor: board.background_color
  }

  return <Layout className="BoardShowPage" style={style}>
    <div className="BoardShowPage-Header">
      <h1>{board.name}</h1>
      <DeleteBoardButton boardId={board.id}/>
    </div>
    <div className="BoardShowPage-lists">{lists}</div>
  </Layout>
}

class DeleteBoardButton extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(event){
    console.log("deleting board", this.props.boardId)
    $.ajax({
      method: "POST",
      url: `/api/boards/${this.props.boardId}/delete`,
    }).then( () => {
      this.context.redirectTo('/')
      boardsStore.reload()
    })
  }

  render(){
    return <button className="BoardShowPage-delete-button" onClick={this.onClick}>
      Delete
    </button>
  }
}

const List = ({ list, cards }) => {
  const cardNodes = cards.map(card => {
    return <Card key={card.id} card={card} />
  })

  return <div className="BoardShowPage-List">
    <div className="BoardShowPage-ListHeader">
      {list.name}
      <DeleteListButton list={list} />
    </div>
    <div className="BoardShowPage-cards">{cardNodes}</div>
    <div className="BoardShowPage-add-card">Add a card…</div>
  </div>
}

const Card = ({ card }) => {
  return <div className="BoardShowPage-Card">
    <pre>{card.content}</pre>
  </div>
}

class DeleteListButton extends Component {
  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(event) {
    event.preventDefault()
    $.ajax({
      method: "POST",
      url: `/api/lists/${this.props.list.id}/delete`
    }).then(() => {
      boardStore.reload()
    })
  }

  render() {
    return <Link onClick={this.onClick}>
      <Icon type="times" />
    </Link>
  }
}
