import React, { Component } from 'react'
import './CardModal.sass'
import moment from 'moment'
import LabelMenu from './LabelMenu'
import CardLabel from './CardLabel'
import Card from '../Card'
import Link from '../../Link'
import Icon from '../../Icon'
import Form from '../../Form'
import Button from '../../Button'
import ContentForm from '../../ContentForm'
import ToggleComponent from '../../ToggleComponent'
import ConfirmationButton from '../../ConfirmationButton'
import boardStore from '../../../stores/boardStore'
import TimeFromNow from '../../TimeFromNow'
import PopoverMenuButton from '../../PopoverMenuButton'
import CopyCard from '../CopyCard'
import Activity from '../../Activity'
import commands from '../../../commands'

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
      <div className='CardModal-archivedBanner'>
        <Icon type="archive" /> This card is archived
      </div> : null

    const labelPanel = <LabelMenu
      card={card}
      board={board}
    />

    return <div className="CardModal">
      <CardModalShroud onClose={this.props.onClose}>
        {archivedBanner}
        <div className="CardModal-columns">
          <div className="CardModal-content">
            <CardHeader card={card} list={list}/>
            <div className="CardModal-body">
              <CardLabels card={card} board={board} labelPanel={labelPanel}/>
              <CardDescription card={card} />
            </div>
            <CardCommentForm card={card} session={session}/>
            <CardActivity board={board} card={card}/>
          </div>
          <Controls
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

const CardModalShroud = ({onClose, children}) => {
  return <div className="CardModal-CardModalShroud-container">
    <div onClick={onClose} className="CardModal-CardModalShroud-shroud"></div>
    <div className="CardModal-CardModalShroud-stage">
      <div className="CardModal-CardModalShroud-window">
        {children}
      </div>
    </div>
  </div>
}

const CardHeader = ({card, list}) => {
  return <div className="CardModal-CardHeader">
    <div className="CardModal-CardHeader-header">
      <div className="CardModal-CardHeader-header-icon">
        <Icon type="window-maximize" size='1'/>
      </div>
      <div className="CardModal-CardHeader-header-title">
        <CardName card={card} />
      </div>
    </div>
    <div className="CardModal-CardHeader-list">
        in list <span className="CardModal-CardHeader-list-name">
          {list.name}
        </span>
    </div>
  </div>

}

const CardLabels =({card, board, labelPanel}) => {
  const cardLabels = card.label_ids
    .map( labelId => board.labels.find(label => label.id === labelId))
    .map(label =>
      <PopoverMenuButton
        key={label.id}
        className="CardModal-CardLabels-labels-Label"
        type="unstyled"
        popover={labelPanel}
      >
        <CardLabel
          color={label.color}
          text={label.text}
          checked={false}
        />
      </PopoverMenuButton>
    )
  const labelHeader = cardLabels.length > 0 ?
    <div className="CardModal-CardLabels-header">Labels</div> : null

  return <div className="CardModal-CardLabels">
    {labelHeader}
    <div className="CardModal-CardLabels-labels">
      {cardLabels}
    </div>
  </div>
}

const Controls = ({board, list, card, closeModal, labelPanel}) => {
  const copyCard = <CopyCard card={card} board={board} list={list}/>
  const toggleOnArchived = card.archived ?
    <div>
      <UnArchiveCardButton card={card} />
      <DeleteCardButton card={card} onDelete={closeModal} />
    </div> :
    <ArchiveCardButton card={card} />

  return <div className="CardModal-Controls">
    <div className="CardModal-Controls-title">Add</div>
    <Button><Icon type="user" /> Members</Button>
    <PopoverMenuButton className="CardModal-Controls-label" type="default" popover={labelPanel}>
      <Icon type="tag" /> Labels
    </PopoverMenuButton>
    <div className="CardModal-Controls-title">Actions</div>
    {toggleOnArchived}
    <PopoverMenuButton className="CardModal-Controls-copy" type="default" popover={copyCard}>
      <Icon type="files-o" /> Copy
    </PopoverMenuButton>
  </div>
}

class DeleteCardButton extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
    onDelete: React.PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    this.delete = this.delete.bind(this)
  }

  delete(){
    commands.deleteCard(id).then(this.props.onDelete)
  }

  render(){
    return <ConfirmationButton
      onConfirm={this.delete}
      buttonName='Delete'
      title='Delete Card?'
      message='All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.'
      className='CardModal-Controls-delete'
    >
      <Icon type="trash" /> Delete
    </ConfirmationButton>
  }
}

class UnArchiveCardButton extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props)
    this.unarchive = this.unarchive.bind(this)
  }

  unarchive(){
    commands.unarchiveCard(card.id)
  }

  render(){
    return <Button
      onClick={this.unarchive}
    >
      <Icon type="refresh" /> Return to Board
    </Button>
  }
}

class ArchiveCardButton extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
  }
  constructor(props){
    super(props)
    this.archiveCard = this.archiveCard.bind(this)
  }
  archiveCard(){
    commands.archiveCard(card.id)
  }
  render(){
    return <ConfirmationButton
      onConfirm={this.archiveCard}
      buttonName="Archive"
      title='Archive Card?'
      message='Are you sure you want to archive this card?'
    >
      <Icon type="archive" /> Archive
    </ConfirmationButton>
  }
}

class CardName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.card.content,
    }
    this.setValue = this.setValue.bind(this)
    this.updateName = this.updateName.bind(this)
  }

  setValue(event) {
    this.setState({value: event.target.value})
  }

  updateName(){
    commands.updateCardAttribute(this.props.card.id, {content: this.state.value})
  }

  render() {
    return <input
      type="text"
      value={this.state.value}
      onChange={this.setValue}
      onBlur={this.updateName}
    />
  }
}

class CardCommentForm extends Component {

  static PropTypes = {
    card: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.addComment = this.addComment.bind(this)
  }

  addComment(content, event){
    const { card } = this.props
    const { user } = this.props.session
    if (event) event.preventDefault()
    commands.addComment(card.id, user.id, content)
      .then(() => {
        this.refs.comment.setContent('')
      })
  }

  render(){
    const { session } = this.props

    return <div className="CardModal-CardCommentForm">
      <div className="CardModal-CardCommentForm-header">
        <div className="CardModal-CardCommentForm-header-icon">
          <Icon size="2" type="comment-o"/>
        </div>
        <div className="CardModal-CardCommentForm-header-title">
          Add Comment
        </div>
      </div>
      <div className="CardModal-CardCommentForm-body">
        <div className="CardModal-CardCommentForm-image-container">
          <img className="CardModal-CardCommentForm-image" src={session.user.avatar_url}></img>
        </div>
        <ContentForm
          ref="comment"
          className="CardModal-CommentEditForm"
          onSave={this.addComment}
          submitButtonName="Send"
          placeholder="Write a comment…"
          defaultValue=""
          hideCloseX
        />
      </div>
    </div>
  }
}

class CardComment extends Component {

  constructor(props){
    super(props)
    this.state = {
      editing: false,
    }
    this.editComment = this.editComment.bind(this)
    this.stopEditingComment = this.stopEditingComment.bind(this)
    this.updateComment = this.updateComment.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
  }

  componentWillReceiveProps(nextProps){
    if (this.props!==nextProps) {
      this.setState({updatedAt: this.state.nextProps})
    }
  }

  editComment(event) {
    if (event) event.preventDefault()
    this.setState({editing: true})
  }

  stopEditingComment(event){
    if (event) event.preventDefault()
    this.setState({editing: false})
  }

  updateComment(content, event) {
    const { comment } = this.props
    if (event) event.preventDefault()
    commands.updateComment(comment.card_id, comment.id, content)
      .then(() => this.stopEditingComment())
  }

  deleteComment(event) {
    const { comment } = this.props
    if (event) event.preventDefault()
    commands.deleteComment(comment.card_id, comment.id)
  }

  render(){
    const {comment, users} = this.props
    const user = users.find(user => user.id === comment.user_id)

    const commentTimestamp = <div className="CardModal-CardComment-comment-controls-time">
      <TimeFromNow time={comment.created_at}/>
      {comment.created_at === comment.updated_at ? '' : ' (edited)'}
    </div>

    const commentBox = this.state.editing ?
      <div className="CardModal-CardComment-comment">
        <ContentForm
          ref="comment"
          className="CardModal-CommentEditForm"
          onSave={this.updateComment}
          onCancel={this.stopEditingComment}
          submitButtonName="Save"
          defaultValue={comment.content}
        />
      </div>
    :
      <div className="CardModal-CardComment-comment">
        <div className="CardModal-CardComment-comment-box">
          {comment.content}
        </div>
        <div className="CardModal-CardComment-comment-controls">
          {commentTimestamp}
          <span className="CardModal-CardComment-comment-controls-margin">-</span>
          <Link onClick={this.editComment} className="CardModal-CardComment-comment-controls-edit">
            Edit
          </Link>
          <span className="CardModal-CardComment-comment-controls-margin">-</span>
          <Link onClick={this.deleteComment} className="CardModal-CardComment-comment-controls-delete">
            Delete
          </Link>
        </div>
      </div>

    return <div className="CardModal-CardComment">
      <div className="CardModal-CardComment-user">
        <img
          className="CardModal-CardComment-user-image"
          src={user.avatar_url}
        />
        <span className="CardModal-CardComment-user-name">
          {user.name}
        </span>
      </div>
      {commentBox}
      <div className="CardModal-CardComment-border"/>
    </div>
  }
}

class CardActivity extends Component {
  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {
      showingActivity: true,
    }
    this.activityToggle = this.activityToggle.bind(this)
  }

  activityToggle(event){
    if (event) event.preventDefault()
    this.setState({showingActivity: !this.state.showingActivity})
  }

  render(){
    const {board, card} = this.props

    let activity = [].concat(card.comments)
    if (this.state.showingActivity)
      activity = activity.concat(
        board.activity.filter(activity => activity.card_id === card.id)
      )

    activity = activity
      .sort((a, b) => {
        a = moment(a.created_at).toDate()
        b = moment(b.created_at).toDate()
        return b - a
      })
      .map(item =>
        'metadata' in item ?
          <Activity
            key={item.id}
            className="CardModal-Activity"
            activity={item}
            users={board.users}
            board={board}
            cardActivity
          />
        :
          <CardComment
            key={item.id}
            users={board.users}
            comment={item}
          />
      )

    return <div className="CardModal-CardActivity">
      <div className="CardModal-CardActivity-header">
        <div className="CardModal-CardActivity-header-icon">
          <Icon size="2" type="list"/>
        </div>
        <div className="CardModal-CardActivity-header-title">Activity</div>
        <Link
          className="CardModal-CardActivity-header-toggle"
          onClick={this.activityToggle}
        >
          {this.state.showingActivity ? 'Hide Details' : 'Show Details'}
        </Link>
      </div>
      <div className="CardModal-CardActivity-activityLog">
        {activity}
      </div>
    </div>
  }

}

class CardDescription extends ToggleComponent {

  static propTypes = {
    card: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.updateDescription = this.updateDescription.bind(this)
  }

  updateDescription(){
    let newDescription = this.refs.descriptionForm.state.content

    commands.updateCardAttribute(this.props.card.id, {description: newDescription})
    .then(this.close)
  }

  render() {
    const { card } = this.props

    if (this.state.open){
      return <ContentForm
        ref="descriptionForm"
        className="CardModal-CommentEditForm CardModal-CardDescription"
        onSave={this.updateDescription}
        onCancel={this.close}
        submitButtonName="Save"
        defaultValue={card.description}
      />
    }

    if (card.description === ""){
      return <Link onClick={this.open} className="CardModal-CardDescription">
        <Icon type="align-justify" />&nbsp;
        <span>Edit the description</span>
      </Link>
    }

    return <div className="CardModal-CardDescription">
      <div className="CardModal-CardDescription-header">
        Description
        <Link
          className="CardModal-CardDescription-header-edit"
          onClick={this.open}
        >
          Edit
        </Link>
      </div>
      <div className="CardModal-CardDescription-content">{card.description}</div>
    </div>
  }
}
