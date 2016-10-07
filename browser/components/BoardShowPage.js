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

  const onDrop_handler = event => {
    event.preventDefault()
    let cardId = event.dataTransfer.getData("text")
    $.ajax({
      method: "POST",
      url: `/api/cards/${cardId}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({list_id: list.id}),
    }).then( () => {
      boardStore.reload()
    })
  }

  const onDragOver_handler = event => {
    event.preventDefault()
  }

  return <div className="BoardShowPage-List" onDrop={onDrop_handler} onDragOver={onDragOver_handler}>
    <div className="BoardShowPage-ListHeader">
      {list.name}
      <DeleteListButton list={list} />
    </div>
    <div className="BoardShowPage-cards">{cardNodes}</div>
    <div className="BoardShowPage-add-card">Add a card…</div>
  </div>
}

const Card = ({ card }) => {
  const dragStart_handler = event => {
    event.dataTransfer.setData("text", card.id)
  }

  return <div className="BoardShowPage-Card" draggable="true" onDragStart={dragStart_handler} id={card.id}>
    <pre>{card.content}</pre>
    <DeleteCardButton card={card} />
  </div>
}

const DeleteButton = (props) => {
  const className = `BoardShowPage-DeleteButton ${props.className||''}`
  return <Link className={className} onClick={props.onClick}>
    <Icon type="trash" />
  </Link>
}

const deleteRecord = (event, resource, id) => {
  event.preventDefault()
  $.ajax({
    method: "POST",
    url: `/api/${resource}/${id}/delete`
  }).then(() => {
    boardStore.reload()
  })
}

const DeleteListButton = (props) => {
  const className = `BoardShowPage-DeleteListButton ${props.className||''}`
  const onClick = (event) => {
    deleteRecord(event, 'lists', props.list.id)
  }
  return <DeleteButton
    onClick={onClick}
    className={className}
    {...props}
  />
}

const DeleteCardButton = (props) => {
  const className = `BoardShowPage-DeleteCardButton ${props.className||''}`
  const onClick = (event) => {
    deleteRecord(event, 'cards', props.card.id)
  }
  return <DeleteButton
    onClick={onClick}
    className={className}
    {...props}
  />
}
