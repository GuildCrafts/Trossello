import React, { Component } from 'react'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import autosize from 'autosize'
import ArchiveButton from './ArchiveButton'

export default class Card extends Component {
  constructor(props){
    super(props)
    this.state = {
      editingCard: false,
    }
    this.editCard = this.editCard.bind(this)
    this.cancelEditingCard = this.cancelEditingCard.bind(this)
    this.updateCard = this.updateCard.bind(this)
  }

  editCard() {
    this.setState({editingCard: true})
  }

  cancelEditingCard(){
    this.setState({editingCard:false})
  }

  updateCard(content){
    const { board, list, card } = this.props
    $.ajax({
      method: 'post',
      url: `/api/boards/${board.id}/lists/${list.id}/cards/edit`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(content),
    }).then(() => {
      boardStore.reload()
    })
  }

  render() {
    const { card } = this.props
    const editCardModal = this.state.editingCard ?
      <EditCardModal
        onClose={this.cancelEditingCard}
        onSave={this.updateCard}
      /> :
      null

    const dragStart = event => {
      event.dataTransfer.setData("text", card.id)
    }
    console.log('Card', this.props)
    return <div className="BoardShowPage-Card">
      {editCardModal}
      <div className="BoardShowPage-Card-box" draggable="true" onDragStart={dragStart}>
        <pre>{card.content}</pre>
        <div className="BoardShowPage-Card-controls">
          <EditCardButton onClick={this.editCard} />
          <ArchiveCardButton card={card}/>
        </div>
      </div>
    </div>
  }

}




const EditCardButton = (props) => {
  return <Link onClick={props.onClick}>
    <Icon type="pencil" />
  </Link>
}

const ArchiveCardButton = (props) => {
  const className = `BoardShowPage-ArchiveCardButton ${props.className||''}`
  const onClick = (event) => {
    event.preventDefault()
    $.ajax({
      method: "POST",
      url: `/api/cards/${props.card.id}/archive`
    }).then(() => {
      boardStore.reload()
    })
  }
  return <ArchiveButton
    onClick={onClick}
    className={className}
    {...props}
  />
}


class EditCardModal extends Component {
  render(){
    return <div className="BoardShowPage-Card-EditCardModal">
      <div
        className="BoardShowPage-Card-EditCardModal-shroud"
        onClick={this.props.onClose}
      />
      <div className="BoardShowPage-Card-EditCardModal-window">

      </div>
    </div>
  }
}

class EditCardForm extends Component {
  constructor(props){
    super(props)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.editCard = this.editCard.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  onKeyUp(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.editCard()
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.cancel()
    }
}
  cancel(){
    EditCardForm.lastValue = this.refs.content.value
    this.props.onCancel()
  }

  editCard() {
    const content = {
      content: this.refs.content.value,
    }
    if (content.content.replace(/\s+/g,'') === '') return
    this.refs.content.value = ""
    this.refs.content.style.height = 'auto'
    this.props.editCard(content)
  }


  render() {
    return <Form className="BoardShowPage-NewCardForm" onSubmit={this.editCard}>
      <textarea
        className="BoardShowPage-Card"
        onKeyUp={this.onKeyUp}
        ref="content"
        defaultValue={EditCardForm.lastValue}
      />
      <div className="BoardShowPage-NewCardForm-controls">
        <input type="submit" value="Edit" />
        <Link onClick={this.cancel}>
          <Icon type="times" />
        </Link>
      </div>
    </Form>
    }

}
