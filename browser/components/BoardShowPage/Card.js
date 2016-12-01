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
import CardLabel from './Card/CardLabel'

export default class Card extends Component {
  static contextTypes = {
    redirectTo: React.PropTypes.func.isRequired,
  };

  static propTypes = {
    card: React.PropTypes.object.isRequired,
    board: React.PropTypes.object,
    editable: React.PropTypes.bool,
    ghosted: React.PropTypes.bool,
    beingDragged: React.PropTypes.bool,
    style: React.PropTypes.object,
  };

  static defaultProps = {
    editable: false,
    ghosted: false,
    beingDragged: false,
  };

  constructor(props){
    super(props)
    this.state = {
      editingCard: false,
      cardTop: null,
      cardLeft: null,
      cardWidth: null,
    }
    this.editCard = this.editCard.bind(this)
    this.cancelEditingCard = this.cancelEditingCard.bind(this)
    this.updateCard = this.updateCard.bind(this)
    this.openShowCardModal = this.openShowCardModal.bind(this)
  }

  editCard(event) {
    event.preventDefault()
    event.stopPropagation()
    const rect = this.refs.card.getBoundingClientRect()
    this.setState({
      editingCard: true,
      cardTop: rect.top,
      cardLeft: rect.left,
      cardWidth: rect.width,
    })
  }

  cancelEditingCard(event){
    this.setState({
      editingCard: false,
      cardTop: null,
      cardLeft: null,
      cardWidth: null,
    })
  }

  updateCard(updates){
    const { card } = this.props
    const cardClone = Object.assign({}, card)
    Object.assign(card, updates)
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(updates),
    }).then(() => {
      this.cancelEditingCard()
      boardStore.reload()
    }).catch(error => {
      Object.assign(card, cardClone)
      throw error
    })
  }

  openShowCardModal(event){
    const { card } = this.props
    if (event.isPropagationStopped() || event.ctrlKey || event.metaKey || event.shiftKey) return
    event.preventDefault()
    this.context.redirectTo(`/boards/${card.board_id}/cards/${card.id}`)
  }

  render() {
    const {
      board,
      card,
      editable,
      ghosted,
      beingDragged,
      style
    } = this.props

    let cardLabels = !board ? null : card.label_ids
      .map( labelId => board.labels.find(label => label.id === labelId))
      .map( label =>
        <div key={label.id} className="BoardShowPage-Card-label">
          <CardLabel color={label.color} text={''} checked={false} />
        </div>
      )

    const editCardButton = this.props.editable ?
      <EditCardButton onClick={this.editCard} /> : null

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

    const archivedFooter= card.archived ?
     <div><Icon type="archive" /> Archived</div> :
      null
    if (ghosted) className += ' BoardShowPage-Card-ghosted'
    if (beingDragged) className += ' BoardShowPage-Card-beingDragged'

    return <div
      ref="card"
      className={className}
      style={style}
    >
      {editCardModal}
      <Link
        href={`/boards/${card.board_id}/cards/${card.id}`}
        className="BoardShowPage-Card-box"
        data-card-id={card.id}
        data-list-id={card.list_id}
        data-order={card.order}
        onClick={this.openShowCardModal}
        draggable
        onDragStart={this.props.onDragStart}
      >
      <div className="BoardShowPage-Card-labels">
        {cardLabels}
      </div>
      <pre>{card.content}</pre>
      {archivedFooter}
      </Link>
      <div className="BoardShowPage-Card-controls">
        {editCardButton}
      </div>
    </div>
  }

}

const EditCardButton = (props) => {
  return <Link className="BoardShowPage-EditButton" onClick={props.onClick}>
    <Icon size='0' type="pencil" />
  </Link>
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
  constructor(props){
    super(props)
    this.cancel = this.cancel.bind(this)
  }
  stopPropagation(event){
    event.preventDefault()
    event.stopPropagation()
  }
  cancel(event){
    event.stopPropagation()
    this.props.onCancel(event)
  }
  render(){
    const style = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width+'px',
    }
    return <div
        className="BoardShowPage-EditCardModal"
      >
      <div
        className="BoardShowPage-EditCardModal-shroud"
        onMouseDown={this.stopPropagation}
        onClick={this.cancel}
      />
      <div style={style} className="BoardShowPage-EditCardModal-window">
        <EditCardForm
          card={this.props.card}
          onCancel={this.cancel}
          submitButtonName="Save"
          onSave={this.props.onSave}
          hideCloseX
        />
      </div>
    </div>
  }
}
