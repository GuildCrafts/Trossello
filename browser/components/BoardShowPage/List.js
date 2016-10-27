import React, { Component } from 'react'
import $ from 'jquery'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import Card from './Card'
import ArchiveButton from './ArchiveButton'
import EditCardForm from './EditCardForm'
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

  render(){
    const { board, list, dragging } = this.props

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
        board={board}
        list={list}
        onCancel={this.cancelCreatingCard}
      />
    } else {
      newCardLink = <Link onClick={this.creatingCard} className="BoardShowPage-create-card-link" >Add a card...</Link>
    }

    const optionsBlock= this.props.showOptions ?
     <div ref="options">
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
     </div> : null

     const archiveListButton = this.props.archivable ?
      <ArchiveListButton list={list} /> : null

    return <div className="BoardShowPage-List" data-list-id={list.id} onDrop={this.onDrop} onDragOver={this.onDragOver}>
      <div className="BoardShowPage-ListHeader">
        {list.name}
        {archiveListButton}
      </div>
      {optionsBlock}
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
