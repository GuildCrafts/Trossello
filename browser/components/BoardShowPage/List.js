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
      creatingCard: false,
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
    const { board, list } = this.props

    const cards = this.props.cards
      .filter(card => card.list_id === list.id)
      .sort((a, b) => a.order - b.order)

    const cardNodes = cards.map((card, index) =>
      <Card
        editable
        key={card.id}
        card={card}
        index={index}
        ghosted={card.id == this.props.draggingCardId}
        board={board}
        list={list}
        onDragStart={this.props.onDragStart}
      />
    )


    let className = 'BoardShowPage-List-box'
    if (this.props.ghosted) className += ' BoardShowPage-Ghosted'
    if (this.props.beingDragged) className += ' BoardShowPage-List-box-beingDragged'

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
      board={this.props.board}
      list={this.props.list}
      onCreateCard={this.creatingCard}
    />

    return <div className="BoardShowPage-List" data-list-id={list.id}>
      <div className={className}>
        <div className="BoardShowPage-ListHeader"
          className="BoardShowPage-ListHeader"
          draggable
          onDragStart={this.props.onDragStart}
        >
          <ListName list={list}/>
        </div>
        <PopoverMenuButton className="BoardShowPage-ListOptions" type="invisible" popover={listActionsMenu}>
          <Icon type="ellipsis-h" />
        </PopoverMenuButton>
        <div ref="cards"className="BoardShowPage-cards">
          {cardNodes}
          {newCardForm}
        </div>
        {newCardLink}
      </div>
    </div>
  }
}

class ListName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      value: this.props.list.name
    }
    this.setValue = this.setValue.bind(this)
    this.updateName = this.updateName.bind(this)
    this.selectText = this.selectText.bind(this)
    this.startEditing = this.startEditing.bind(this)
  }

  setValue(event){
    this.setState({value: event.target.value})
  }

  startEditing(event){
    event.preventDefault()
    this.setState({editing: true})
  }

  componentDidUpdate(){
    if (this.state.editing) this.refs.input.focus()
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
      this.setState({editing: false})
      boardStore.reload()
    })
  }

  selectText(){
    this.refs.input.select()
  }

  render() {
    return this.state.editing ?
      <input
        ref="input"
        draggable={false}
        type="text"
        value={this.state.value}
        onChange={this.setValue}
        onBlur={this.updateName}
        onFocus={this.selectText}
      /> :
      <div
        onClick={this.startEditing}
      >
        {this.state.value}
      </div>
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
