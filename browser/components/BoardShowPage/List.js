import React, { Component } from 'react'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import Card from './Card'
import ArchiveButton from './ArchiveButton'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import autosize from 'autosize'

export default class List extends Component {

  static propTypes = {
    board: React.PropTypes.object.isRequired,
    list:  React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      creatingCard: false
    }
    this.creatingCard = this.creatingCard.bind(this)
    this.cancelCreatingCard = this.cancelCreatingCard.bind(this)
    // this.onDragStart = this.onDragStart.bind(this)
    // this.onDragOver = this.onDragOver.bind(this)
    // this.onDrop = this.onDrop.bind(this)
    this.createCard = this.createCard.bind(this)
    this.cancelCreatingCardIfUserClickedOutside = this.cancelCreatingCardIfUserClickedOutside.bind(this)
    document.body.addEventListener('click', this.cancelCreatingCardIfUserClickedOutside)
  }

  componentWillUnmount(){
    document.body.removeEventListener('click', this.cancelCreatingCardIfUserClickedOutside)
  }

  cancelCreatingCardIfUserClickedOutside(event){
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

  render(){
    const {
      board,
      list,
      dragging,
    } = this.props

    const cards = board.cards
      .map(card =>
        dragging && card.id === dragging.cardId ?
          {...card, order: dragging.order, list_id: dragging.listId} :
          card
      )
      .filter(card => card.list_id === list.id)
      .sort((a, b) => a.order - b.order)

    const cardNodes = cards.map((card, index) =>
      <Card
        editable
        archivable
        key={card.id}
        card={card}
        index={index}
        ghosted={dragging && card.id === dragging.cardId}
      />
    )

    let newCardForm, newCardLink
    if (this.state.creatingCard) {
      newCardForm = <NewCardForm
        createCard={this.createCard}
        onCancel={this.cancelCreatingCard}
      />
    } else {
      newCardLink = <Link onClick={this.creatingCard} className="BoardShowPage-create-card-link" >Add a card...</Link>
    }

    return <div className="BoardShowPage-List"
      >
      <div className="BoardShowPage-ListHeader">
        {list.name}
        <ArchiveListButton list={list} />
      </div>
      <div
        ref="cards"
        className="BoardShowPage-cards"
        onDragStart={this.props.onDragStart}
        onDragOver={this.props.onDragOver}
        onDragEnd={this.props.onDragEnd}
        onDrop={this.props.onDrop}
      >
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
      this.createCard(event)
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.cancel()
    }
    autosize(this.refs.content)
  }

  createCard(event) {
    event.preventDefault()
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

const archiveRecord = (resource, id) => {
  $.ajax({
    method: "POST",
    url: `/api/${resource}/${id}/archive`
  }).then(() => {
    boardStore.reload()
  })
}

const ArchiveListButton = (props) => {
  const className = `BoardShowPage-ArchiveListButton ${props.className||''}`
  const onClick = () => {
    archiveRecord('lists', props.list.id)
  }
  return <ArchiveButton
    buttonName="Archive"
    confirmationTitle='Archive List?'
    confirmationMessage='Are you sure you want to archive this list?'
    onClick={onClick}
    className={className}
    {...props}
  />
}
