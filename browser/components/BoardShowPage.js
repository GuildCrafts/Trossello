import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import boardsStore from '../stores/boardsStore'
import boardStore from '../stores/boardStore'
import autosize from 'autosize'

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
    return <List key={list.id} board={board} list={list} cards={cards} />
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
    return <button className="BoardShowPage-button BoardShowPage-delete-button" onClick={this.onClick}>
      Delete
    </button>
  }
}

class List extends Component {

  constructor(props) {
    super(props)
    this.state = {
      creatingCard: false
    }
    this.creatingCard = this.creatingCard.bind(this)
    this.cancelCreatingCard = this.cancelCreatingCard.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.createCard = this.createCard.bind(this)
    this.cancelCreatingCardIfUserClickedOutside = this.cancelCreatingCardIfUserClickedOutside.bind(this)
    document.body.addEventListener('click', this.cancelCreatingCardIfUserClickedOutside)
  }

  componentWillReceiveProps(){
    if (this.state.creatingCard) this.scrollToTheBottom()
  }

  componentWillUnmount(){
    document.body.removeEventListener('click', this.cancelCreatingCardIfUserClickedOutside)
  }

  cancelCreatingCardIfUserClickedOutside(){
    const targetNode = event.target
    let rootNode = this.refs.root
    if (rootNode && targetNode && !rootNode.contains(targetNode))
      this.cancelCreatingCard()
  }

  scrollToTheBottom(){
    setTimeout(() => {
      const { cards } = this.refs
      if (cards) cards.scrollTop = cards.scrollHeight
    })
  }

  creatingCard() {
    this.setState({creatingCard: true})
    this.scrollToTheBottom()
  }

  cancelCreatingCard() {
    this.setState({creatingCard: false})
  }

  createCard(content){
    const { board, list } = this.props
    $.ajax({
      method: 'post',
      url: `/api/boards/${board.id}/lists/${list.id}/cards`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({content}),
    }).then(() => {
      boardStore.reload()
      this.scrollToTheBottom()
    })
  }

  onDrop(event){
    event.preventDefault()
    const cardId = event.dataTransfer.getData("text")
    const { list } = this.props
    // move card
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

  onDragOver(event){
    event.preventDefault()
  }

  render(){
    const { board, list, cards } = this.props
    const cardNodes = cards.map(card => {
      return <Card key={card.id} card={card} />
    })

    let createCardForm, createCardLink
    if (this.state.creatingCard) {
      createCardForm = <CreateCardForm
        createCard={this.createCard}
        onCancel={this.cancelCreatingCard}
      />
    } else {
      createCardLink = <Link onClick={this.creatingCard} className="BoardShowPage-create-card-link" >Add a card...</Link>
    }

    return <div ref="root" className="BoardShowPage-List" onDrop={this.onDrop} onDragOver={this.onDragOver}>
      <div className="BoardShowPage-ListHeader">{list.name}</div>
      <div ref="cards" className="BoardShowPage-cards">
        {cardNodes}
        {createCardForm}
      </div>
      {createCardLink}
    </div>
  }
}

class CreateCardForm extends Component {

  constructor(props) {
    super(props)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.createCard = this.createCard.bind(this)
  }

  componentDidMount() {
    this.refs.content.focus()
  }

  onKeyUp(event) {
    if (event.keyCode === 13) {
      event.preventDefault()
      this.createCard()
    }
    autosize(this.refs.content)
  }

  createCard() {
    const content = this.refs.content.value
    this.refs.content.value = ""
    this.props.createCard(content)
  }

  render() {
    return <div className="BoardShowPage-CreateCardForm">
      <textarea className="BoardShowPage-Card" onKeyUp={this.onKeyUp} ref="content"/>
      <div className="BoardShowPage-CreateCardForm-controls">
        <button onClick={this.createCard} className="BoardShowPage-button BoardShowPage-add-card-button">
          Add
        </button>
        <Link onClick={this.props.onCancel}>
          <Icon type="times" />
        </Link>
      </div>
    </div>
  }
}

const Card = ({ card }) => {
  const dragStart = event => {
    event.dataTransfer.setData("text", card.id)
  }

  return <div className="BoardShowPage-Card" draggable="true" onDragStart={dragStart} id={card.id}>
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
