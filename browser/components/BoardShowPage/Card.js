import React, { Component } from 'react'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import autosize from 'autosize'
import  { List, DeleteCardButton } from './List'

export default class Card extends Component {
  constructor(props){
    super(props)
    this.state = {
      editingCard: false,
    }
    this.editingCard = this.editingCard.bind(this)
  }

  editingCard() {
    this.setState({editingCard: true})
  }

  cancelEditingCard(){
    this.setState({editingCard:false})
  }
  editCard(content){
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
    if (this.state.editingCard) {
      return <EditCardForm
        editCard={this.editCard}
        onCancel={this.cancelEditingCard}
      />
    } else {
      const dragStart = event => {
        event.dataTransfer.setData("text", card.id)
      }
      console.log(typeof <DeleteCardButton />)
      return <div className="BoardShowPage-Card" draggable="true" onDragStart={dragStart} id={card.id}>
        <pre>{card.content}</pre>
        <DeleteCardButton card={card}></DeleteCardButton>
      </div>
    }
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
