import React, { Component } from 'react'
import moment from 'moment'
import TextLabelContainer from '../../Card/labels/TextLabelContainer'
import MemberLabelContainer from '../../Card/labels/MemberLabelContainer'
import DueDateLabel from '../../Card/labels/DueDateLabel'
import CardModalShroud from './CardModalShroud'
import CardModalControls from './CardModalControls'
import CardHeader from './CardHeader'
import LabelMenu from './LabelMenu'
import CardDescription from './CardDescription'
import CommentForm from './CommentForm'
import CardActivity from './CardActivity'
import Icon from '../../Icon'
import './index.sass'

export default class CardModal extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,
  }
  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props)
    this.state = {
      editingDescription: false,
      editingName: false,
      showingLabelMenu: false,
    }
    this.showLabelMenu = this.showLabelMenu.bind(this)
    this.stopShowingLabelMenu = this.stopShowingLabelMenu.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this.onKeyDown, false)
  }

  showLabelMenu(event) {
    event.preventDefault()
    this.setState({showingLabelMenu: true})
  }

  stopShowingLabelMenu(event) {
    event.preventDefault()
    this.setState({showingLabelMenu: false})
  }

  onKeyDown(event) {
    if (event.key === 'Escape') {
      this.props.onClose()
    }
  }

  render(){
    const { session } = this.context
    const { card, list, board } = this.props
    const archivedBanner = card.archived ?
      <div className='BoardShowPage-CardModal-archivedBanner'>
        <Icon type="archive" /> This card is archived
      </div> : null

    const labelPanel = <LabelMenu
      card={card}
      board={board}
    />

    const dueDateBadge = card.due_date
      ? <DueDateLabel card={card} shownOn='back'/>
      : null

    const cardMembers =
     board.users.filter(user => card.user_ids.includes(user.id)).length > 0
        ? <MemberLabelContainer card={card} board={board}/>
        : null

    const cardLabels =
      board.labels.filter(label => card.label_ids.includes(label.id)).length > 0
        ? <TextLabelContainer card={card} board={board} labelPanel={labelPanel}/>
        : null

    return <div className="BoardShowPage-CardModal">
      <CardModalShroud onClose={this.props.onClose}>
        {archivedBanner}
        <div className="BoardShowPage-CardModal-columns">
          <div className="BoardShowPage-CardModal-content">
            <CardHeader card={card} list={list}/>
            <div className="BoardShowPage-CardModal-body">
              <div className="BoardShowPage-CardModal-body-badges">
                {cardMembers}
                {cardLabels}
                {dueDateBadge}
              </div>
              <CardDescription card={card}/>
            </div>
            <CommentForm card={card} session={session}/>
            <CardActivity board={board} card={card}/>
          </div>
          <CardModalControls
            board={board}
            list={this.props.list}
            card={card}
            closeModal={this.props.onClose}
            labelPanel={labelPanel}
          />
        </div>
      </CardModalShroud>
    </div>
    }
}
