import React, { Component } from 'react'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import autosize from 'autosize'
import ArchiveButton from './ArchiveButton'
import ConfirmationLink from '../ConfirmationLink'
import EditCardForm from './EditCardForm'

export default class Card extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
  }
  constructor(props){
    super(props)
    this.state = {
      editingCard: false,
      cardTop: null,
      cardLeft: null,
      cardHeight: null,
      cardWidth: null,
    }
    this.editCard = this.editCard.bind(this)
    this.cancelEditingCard = this.cancelEditingCard.bind(this)
    this.updateCard = this.updateCard.bind(this)
  }

  editCard() {

    const rect = this.refs.card.getBoundingClientRect()
    this.setState({
      editingCard: true,
      cardTop: rect.top,
      cardLeft: rect.left,
      cardWidth: rect.width,
    })
  }

  cancelEditingCard(){
    this.setState({editingCard:false})
  }

  updateCard(content){
    console.log('updateCard ???')
    const { card } = this.props
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(content),
    }).then(() => {
      debugger
      this.cancelEditingCard()
      boardStore.reload()
    })
  }

  render() {
    const {
      card,
      index,
      editable,
      archivable,
      ghosted,
      beingDragged,
      style
    } = this.props

    const editCardButton = this.props.editable ?
      <EditCardButton onClick={this.editCard} /> : null

    const archiveCardButton = this.props.archivable ?
      <ArchiveCardButton card={this.props.card}/> : null

    const editCardModal = this.state.editingCard ?
      <EditCardModal
        card={this.props.card}
        onCancel={this.cancelEditingCard}
        onSave={this.updateCard}
        top={this.state.cardTop}
        left={this.state.cardLeft}
        width={this.state.cardWidth}
      /> :
      null


    let className = 'BoardShowPage-Card'
    if (ghosted) className += ' BoardShowPage-Card-ghosted'
    if (beingDragged) className += ' BoardShowPage-Card-beingDragged'

    return <div
        ref="card"
        className={className}
        data-card-id={card.id}
        data-list-id={card.list_id}
        data-order={card.order}
        style={style}
      >
      {editCardModal}
      <div className="BoardShowPage-Card-box">
        <pre>{card.content}</pre>
        <div className="BoardShowPage-Card-controls">
          {editCardButton}
          {archiveCardButton}
        </div>
      </div>
    </div>
  }

}

const EditCardButton = (props) => {
  return <Link className="BoardShowPage-EditButton" onClick={props.onClick}>
    <Icon size='0' type="pencil" />
  </Link>
}

const ArchiveCardButton = (props) => {
  const onClick = () => {
    $.ajax({
      method: "POST",
      url: `/api/cards/${props.card.id}/archive`
    }).then(() => {
      boardStore.reload()
    })
  }
  return <ArchiveButton
    size='0'
    buttonName="Archive"
    confirmationTitle='Archive Card?'
    confirmationMessage='Are you sure you want to archive this card?'
    onClick={onClick}
    className={props.className}
  />
}


class EditCardModal extends Component {
  static propTypes = {
    card:    React.PropTypes.object.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSave:  React.PropTypes.func.isRequired,
    top:     React.PropTypes.number.isRequired,
    left:    React.PropTypes.number.isRequired,
    width:   React.PropTypes.number.isRequired,
  }
  onMouseDown(event){
    event.preventDefault()
    event.stopPropagation()
  }
  render(){
    const style = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width+'px',
    }
    return <div className="BoardShowPage-EditCardModal" onMouseDown={this.onMouseDown}>
      <div
        className="BoardShowPage-EditCardModal-shroud"
        onMouseDown={this.onMouseDown}
        onClick={this.props.onCancel}
      />
      <div style={style} className="BoardShowPage-EditCardModal-window">
        <EditCardForm
          card={this.props.card}
          onCancel={this.props.onCancel}
          submitButtonName="Save"
          onSave={this.props.onSave}
          hideCloseX
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
    this.onKeyDown = this.onKeyDown.bind(this)
    this.saveCard = this.saveCard.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  onKeyDown(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.saveCard(event)
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
        onKeyDown={this.onKeyDown}
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
