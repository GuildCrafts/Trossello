import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import Card from './Card'
import EditCardForm from './EditCardForm'
import boardStore from '../../stores/boardStore'
import autosize from 'autosize'
import ToggleComponent from '../ToggleComponent'
import Button from '../Button'
import PopoverMenuButton from '../PopoverMenuButton'
import ListActionsMenu from '../ListActionsMenu'


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

  render(){
    const { board, list, dragging } = this.props

    const cards = board.cards
      .map(card =>
        dragging && card.id === dragging.cardId ?
          {...card, order: dragging.order, list_id: dragging.listId} :
          card
      )
      .filter(card => !card.archived)
      .filter(card => card.list_id === list.id)
      .sort((a, b) => a.order - b.order)

    const cardNodes = cards.map((card, index) =>
      <Card
        editable
        key={card.id}
        card={card}
        index={index}
        ghosted={dragging && card.id === dragging.cardId}
        board={board}
        list={list}
      />
    )

    let newCardForm, newCardLink
    if (this.state.creatingCard) {
      newCardForm = <NewCardForm
        board={board}
        list={list}
        onCancel={this.cancelCreatingCard}
      />
    } else {
      newCardLink = <Link onClick={this.creatingCard} className="BoardShowPage-create-card-link" >Add a card...</Link>
    }

    const listActionsMenu = <ListActionsMenu
      list={this.props.list}
      onCreateCard={this.creatingCard}
    />

    return <div className="BoardShowPage-List" data-list-id={list.id}>
      <div className="BoardShowPage-ListHeader">
        <ListName list={list}/>
        <PopoverMenuButton className="BoardShowPage-ListHeader-ListOptions" type="invisible" popover={listActionsMenu}>
          <Icon type="ellipsis-h" />
        </PopoverMenuButton>
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

class ListName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.list.name
    }
    this.setValue = this.setValue.bind(this)
    this.updateName = this.updateName.bind(this)
    this.selectText = this.selectText.bind(this)
  }

  setValue(event){
    this.setState({value: event.target.value})
  }

  updateName(){
    const list = this.props.list
    $.ajax({
      method: 'post',
      url: `/api/lists/${list.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({name: this.state.value})
    }).then(() => {
      boardStore.reload()
    })
  }

  selectText(event){
    event.target.select()
  }

  render() {
    return <input
      type="text"
      value={this.state.value}
      onChange={this.setValue}
      onBlur={this.updateName}
      onFocus={this.selectText}
    />
  }
}

class NewCardForm extends Component {

  static propTypes = {
    board: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    onCancel: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.createCard = this.createCard.bind(this)
    this.closeIfUserClickedOutside = this.closeIfUserClickedOutside.bind(this)
    document.body.addEventListener('click', this.closeIfUserClickedOutside, false)
  }

  componentWillUnmount(){
    document.body.removeEventListener('click', this.closeIfUserClickedOutside)
  }

  closeIfUserClickedOutside(event) {
    const container = ReactDOM.findDOMNode(this.refs.container)
    if (!container.contains(event.target) && container !== event.target) {
      this.props.onCancel(event)
    }
  }

  createCard(card) {
    const { board, list } = this.props
    if (card.content.replace(/\s+/g,'') === '') return

    $.ajax({
      method: 'post',
      url: `/api/boards/${board.id}/lists/${list.id}/cards`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(card),
    }).then(() => {
      boardStore.reload()
    })
  }

  render() {
    return <EditCardForm
      onCancel={this.props.onCancel}
      submitButtonName="Add"
      onSave={this.createCard}
      ref="container"
    />
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
