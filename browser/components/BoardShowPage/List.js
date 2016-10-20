import React, { Component } from 'react'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import autosize from 'autosize'

export default class List extends Component {

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

  componentWillUnmount(){
    document.body.removeEventListener('click', this.cancelCreatingCardIfUserClickedOutside)
  }

  cancelCreatingCardIfUserClickedOutside(){
    const targetNode = event.target
    let rootNode = this.refs.root
    if (rootNode && targetNode && !rootNode.contains(targetNode))
      this.cancelCreatingCard()
  }

  componentDidUpdate(){
    if (this.state.creatingCard){
      const { cards } = this.refs
      cards.scrollTop = cards.scrollHeight
    }
  }

  creatingCard() {
    this.setState({creatingCard: true})
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
      data: JSON.stringify(content),
    }).then(() => {
      boardStore.reload()
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

    let newCardForm, newCardLink
    if (this.state.creatingCard) {
      newCardForm = <NewCardForm
        createCard={this.createCard}
        onCancel={this.cancelCreatingCard}
      />
    } else {
      newCardLink = <Link onClick={this.creatingCard} className="BoardShowPage-create-card-link" >Add a card...</Link>
    }

    return <div className="BoardShowPage-List" onDrop={this.onDrop} onDragOver={this.onDragOver}>
      <div className="BoardShowPage-ListHeader">
        {list.name}
        <DeleteListButton list={list} />
      </div>
      <div ref="cards" className="BoardShowPage-cards">
        {cardNodes}
        {newCardForm}
      </div>
      {newCardLink}
    </div>
  }
}

class NewCardForm extends Component {

  constructor(props) {
    super(props)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.createCard = this.createCard.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  componentDidMount() {
    this.refs.content.focus()
  }

  cancel(){
    NewCardForm.lastValue = this.refs.content.value
    this.props.onCancel()
  }

  onKeyUp(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.createCard()
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.cancel()
    }
    autosize(this.refs.content)
  }

  createCard() {
    const content = {
      content: this.refs.content.value,
    }
    if (content.content.replace(/\s+/g,'') === '') return
    this.refs.content.value = ""
    this.refs.content.style.height = 'auto'
    this.props.createCard(content)
  }

  render() {
    return <Form className="BoardShowPage-NewCardForm" onSubmit={this.createCard}>
      <textarea
        className="BoardShowPage-Card"
        onKeyUp={this.onKeyUp}
        ref="content"
        defaultValue={NewCardForm.lastValue}
      />
      <div className="BoardShowPage-NewCardForm-controls">
        <input type="submit" value="Add" />
        <Link onClick={this.cancel}>
          <Icon type="times" />
        </Link>
      </div>
    </Form>
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
    <Icon type="archive" />
  </Link>
}

const deleteRecord = (event, resource, id) => {
  event.preventDefault()
  $.ajax({
    method: "POST",
    url: `/api/${resource}/${id}/archive`
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
