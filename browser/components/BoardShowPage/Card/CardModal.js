import $ from 'jquery'
import React, { Component } from 'react'
import moment from 'moment'
import './CardModal.sass'
import LabelMenu from './LabelMenu'
import CardLabel from './CardLabel'
import Card from '../Card'
import Link from '../../Link'
import Icon from '../../Icon'
import Form from '../../Form'
import Button from '../../Button'
import ToggleComponent from '../../ToggleComponent'
import ConfirmationButton from '../../ConfirmationButton'
import boardStore from '../../../stores/boardStore'
import PopoverMenuButton from '../../PopoverMenuButton'
import CopyCard from '../CopyCard'
import Activity from '../../Activity'

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
  }

  showLabelMenu(event) {
    event.preventDefault()
    this.setState({showingLabelMenu: true})
  }

  stopShowingLabelMenu(event) {
    event.preventDefault()
    this.setState({showingLabelMenu: false})
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
              <CardDescription card={card}/>
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
    $.ajax({
      method: "POST",
      url: `/api/cards/${this.props.card.id}/delete`
    }).then(() => {
      boardStore.reload()
      this.props.onDelete()
    })
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
    this.unArchive = this.unArchive.bind(this)
  }
  unArchive(){
    $.ajax({
      method: "POST",
      url: `/api/cards/${this.props.card.id}/unarchive`
    }).then(() => {
      boardStore.reload()
    })
  }
  render(){
    return <Button
      onClick={this.unArchive}
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
    $.ajax({
      method: "POST",
      url: `/api/cards/${this.props.card.id}/archive`
    }).then(() =>
      boardStore.reload()
    )
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
    const card = this.props.card
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({content: this.state.value}),
    }).then(() => {
      boardStore.reload()
    })
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

  addComment(event){
    if(event) event.preventDefault()
    $.ajax({
      method: "POST",
      url: `/api/cards/${this.props.card.id}/comments`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
        userId: this.props.session.user.id,
        content: this.refs.comment.value
      })
    })
    .then(() => {
      boardStore.reload()
      this.refs.comment.value = ''
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
        <Form onSubmit={this.addComment} className="CardModal-CardCommentForm-Form">
          <textarea
            className="CardModal-CardCommentForm-Form-input"
            ref="comment"
            placeholder='Write a comment...'
          />
          <Button type="primary" className="CardModal-CardCommentForm-Form-submit">
            Send
          </Button>
        </Form>
      </div>
    </div>
  }
}

class CardComment extends Component {

  constructor(props){
    super(props)
    this.state = {
      editing: false,
      createdAt: moment(this.props.comment.created_at).fromNow(),
      updatedAt: moment(this.props.comment.updated_at).fromNow(),
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

  updateComment(event) {
    if (event) event.preventDefault()
    $.ajax({
      method:'POST',
      url:`/api/cards/${this.props.comment.card_id}/comments/${this.props.comment.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data:JSON.stringify({content:this.refs.edit.value})
    }).then(() => {
      boardStore.reload()
      this.stopEditingComment()
    })
  }

  deleteComment(event) {
    if (event) event.preventDefault()
    $.ajax({
      method:'POST',
      url: `/api/cards/${this.props.comment.card_id}/comments/${this.props.comment.id}/delete`
    })
      .then(() => boardStore.reload())
  }


  render(){
    const {comment, users} = this.props
    const user = users.find(user => user.id === comment.user_id)

    const commentTimestamp = this.props.comment.created_at === this.props.comment.updated_at ?
    <div className="CardModal-CardComment-comment-controls-time">
      {this.state.createdAt}
    </div> : <div className="CardModal-CardComment-comment-controls-time">
      {this.state.createdAt} (edited)
    </div>

    const commentBox = this.state.editing ?
      <div className="CardModal-CardComment-comment">
        <Form className="CardModal-CardComment-comment-editing">
          <textarea
            ref="edit"
            className="CardModal-CardComment-comment-editing-input"
            defaultValue={comment.content}/>
          <div className="CardModal-CardComment-comment-editing-controls">
          <Button type='primary'
            className="CardModal-CardComment-comment-editing-controls-submit"
            onClick={this.updateComment}
          >
            Save
          </Button>
          <Link onClick={this.stopEditingComment}
            className="CardModal-CardComment-comment-editing-controls-cancel">
            <Icon size='2' type="times"/>
          </Link>
          </div>
        </Form>
      </div> :
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
      showingActivity: false,
    }
    this.activityToggle = this.activityToggle.bind(this)
  }

  activityToggle(event){
    if (event) event.preventDefault()
    this.setState({showingActivity: !this.state.showingActivity})
  }

  render(){
    const {board, card} = this.props
    const cardActivityAndComments = board.activity
      .filter(activity => activity.card_id === card.id)
      .concat(card.comments)
      .sort((a, b) => {
        let firstDate = new Date(a.created_at)
        let secondDate = new Date(b.created_at)
        return firstDate-secondDate
      })
      .map(item => {
        if('metadata' in item){
          return <Activity cardActivity key={item.id} activity={item}
            users={board.users} board={board}/>
        } else {
          return <CardComment key={item.id} users={board.users} comment={item}/>
        }
      }).reverse()

    const cardComments = card.comments.map( comment =>
      <CardComment key={comment.id} users={board.users} comment={comment}/>
    ).reverse()

    const toggleButtonText = this.state.showingActivity ? 'Hide Details' : 'Show Details'
    const activityLog = this.state.showingActivity ?
      <div className="CardModal-CardActivity-activityLog">
        {cardActivityAndComments}
      </div> : <div className="CardModal-CardActivity-activityLog">
        {cardComments}
      </div>

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
          {toggleButtonText}
        </Link>
      </div>
      {activityLog}
    </div>
  }

}

class CardDescription extends ToggleComponent {
  constructor(props) {
    super(props)
    this.state.value = this.props.card.description || ''
    this.setValue = this.setValue.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.cancel = this.cancel.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount(){
    this.focusTextarea()
  }

  componentDidUpdate(prevProps, prevState){
    if (!prevState.open) this.focusTextarea()
  }

  focusTextarea(){
    if (this.state.open) this.refs.description.focus()
  }

  setValue(event) {
    this.setState({value: event.target.value})
  }

  onKeyDown(event) {
    if (event.metaKey && event.key === "Enter") {
      event.preventDefault()
      this.updateDescription()
    }
    if (event.key === "Escape") {
      event.preventDefault()
      this.close()
    }
  }

  updateDescription(event){
    if (event) event.preventDefault()
    const description = this.refs.description.value
    $.ajax({
      method: 'post',
      url: `/api/cards/${this.props.card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({description}),
    }).then(() => {
      boardStore.reload()
      this.close()
    })
  }

  cancel(event){
    event.preventDefault()
    this.close()
  }

  render() {
    if (this.state.open){
      return <Form onSubmit={this.updateDescription}>
        <textarea className="CardModal-CardDescription-textarea"
          ref="description"
          onKeyDown={this.onKeyDown}
          value={this.state.value}
          onChange={this.setValue}
        />
        <div className="CardModal-CardDescription-controls">
          <Button submit type="primary">Save</Button>
          <Button type="invisible" onClick={this.cancel}>
            <Icon type="times" />
          </Button>
        </div>
      </Form>
    }
    if (this.state.value === ""){
      return <Link onClick={this.open} className="CardModal-CardDescription">
        <Icon type="align-justify" /> Edit the description
      </Link>
    }
    return <div>
      <div className="CardModal-CardDescription-header">
        Description
        <Link
          className="CardModal-CardDescription-header-edit"
          onClick={this.open}
        >
          Edit
        </Link>
      </div>
      <div className="CardModal-CardDescription-content">{this.props.card.description}</div>
    </div>
  }
}
