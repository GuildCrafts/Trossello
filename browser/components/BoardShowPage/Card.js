import React, { Component } from 'react'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import autosize from 'autosize'
import ArchiveButton from './ArchiveButton'

export default class Card extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
  }
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
    const { card } = this.props
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(content),
    }).then(() => {
      this.cancelEditingCard()
      boardStore.reload()
    })
  }

  render() {
    const { card } = this.props
    const editCardModal = this.state.editingCard ?
      <EditCardModal
        onClose={this.cancelEditingCard}
        onSave={this.updateCard}
        card={this.props.card}
      /> :
      null

    const dragStart = event => {
      event.dataTransfer.setData("text", card.id)
    }
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
  return <Link className="BoardShowPage-EditButton" onClick={props.onClick}>
    <Icon type="pencil" />
  </Link>
}

const ArchiveCardButton = (props) => {
  const className = `BoardShowPage-ArchiveButton ${props.className||''}`
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
  static propTypes = {
    card: React.PropTypes.object.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired,
  }
  render(){
    return <div className="BoardShowPage-Card-EditCardModal">
      <div
        className="BoardShowPage-Card-EditCardModal-shroud"
        onClick={this.props.onClose}
      />
      <div className="BoardShowPage-Card-EditCardModal-window">
        <EditCardForm
          card={this.props.card}
          onSave={this.props.onSave}
          onClose={this.props.onClose}
        />
      </div>
    </div>
  }
}

class EditCardForm extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
    onSave: React.PropTypes.func.isRequired,
  }
  constructor(props){
    super(props)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.saveCard = this.saveCard.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  onKeyUp(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.saveCard()
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.cancel()
    }
  }

  cancel(event){
    event.preventDefault()
    EditCardForm.lastValue = this.refs.content.value
    this.props.onClose()
  }

  saveCard(event) {
    event.preventDefault()
    const content = {
      content: this.refs.content.value,
    }
    if (content.content.replace(/\s+/g,'') === '') return
    this.refs.content.value = ""
    this.refs.content.style.height = 'auto'
    this.props.onSave(content)
  }

  render() {
    return <Form className="BoardShowPage-EditCardForm" onSubmit={this.saveCard}>
      <textarea
        className="BoardShowPage-EditCard"
        onKeyUp={this.onKeyUp}
        ref="content"
        defaultValue={this.props.card.content}
      />
      <div
        className="BoardShowPage-EditCardForm-controls">
        <input type="submit" value="Edit" />
        <Link onClick={this.cancel}>
          <Icon type="times" />
        </Link>
      </div>
    </Form>
    }

}
