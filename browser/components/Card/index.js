import React, { Component } from 'react'
import moment from 'moment'
import autosize from 'autosize'
import boardStore from '../../stores/boardStore'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import ArchiveButton from '../BoardShowPage/ArchiveButton'
import ConfirmationLink from '../ConfirmationLink'
import EditCardModal from './EditCardModal'
import TextLabel from './labels/TextLabel'
import DueDateLabel from './labels/DueDateLabel'
import MemberLabel from './labels/MemberLabel'
import commands from '../../commands'
import './index.sass'

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

  openShowCardModal(event){
    const { card } = this.props
    const target = event.target.attributes.class === undefined
      ? ''
      : event.target.attributes.class.value

    if (target.includes('Avatar')
      || target.includes('CardModal-CardMemberPopover-removeLink')
      || target.includes('Card-MemberLabelPopover')
      || target.includes('Card-MemberLabelPopover-close')
      || event.ctrlKey || event.metaKey || event.shiftKey) return

    event.preventDefault()
    this.context.redirectTo(`/boards/${card.board_id}/cards/${card.id}`)
    if (this.props.onClick) this.props.onClick(event)
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

    const dueDateBadge = card.due_date
      ? <DueDateLabel card={card} shownOn='front'/>
      : null

    let cardLabels = !board ? null : card.label_ids
      .map( labelId => board.labels.find(label => label.id === labelId))
      .map( label =>
        <div key={label.id} className="Card-label">
          <TextLabel color={label.color} text={''} checked={false} />
        </div>
      )

    if(!board) return <div>Bad board</div>
    const cardUsers = card.user_ids.length > 0
      ? card.user_ids
        .map( userId => board.users.find( user => user.id === userId ))
        .map( user =>
          <MemberLabel
            key={user.id}
            board={board}
            card={card}
            user={user}
          />
        )
      : null

    const editCardButton = this.props.editable ?
      <EditButton onClick={this.editCard} /> : null

    const editCardModal = this.state.editingCard ?
      <EditCardModal
        card={this.props.card}
        onCancel={this.cancelEditingCard}
        onSave={this.cancelEditingCard}
        top={this.state.cardTop}
        left={this.state.cardLeft}
        width={this.state.cardWidth}
      /> :
      null

    let className = 'Card'

    const archivedFooter= card.archived ?
     <div><Icon type="archive" /> Archived</div> :
      null
    if (ghosted) className += ' Card-ghosted'
    if (beingDragged) className += ' Card-beingDragged'

    return <div
      ref="card"
      className={className}
      style={style}
    >
      {editCardModal}
      <div className="Card-box"
        data-card-id={card.id}
        data-list-id={card.list_id}
        data-order={card.order}
        onClick={this.openShowCardModal}
        draggable
        onDragStart={this.props.onDragStart}
      >
        <div className="Card-labels">
          {cardLabels}
        </div>
        <pre>{card.content}</pre>
        <div className="Card-bottom">
          {dueDateBadge}
          <div className="Card-bottom-members">
            {cardUsers}
          </div>
        </div>
        {archivedFooter}
      </div>
      <div className="Card-controls">
        {editCardButton}
      </div>
    </div>
  }

}

const EditButton = (props) => {
  return <Link className="Card-EditButton" onClick={props.onClick}>
    <Icon size='0' type="pencil" />
  </Link>
}
