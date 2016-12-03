import $ from 'jquery'
import React, { Component } from 'react'
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
            <CardComments session={session}/>
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
        in list {list.name}
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
      value: this.props.card.content
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

class CardComments extends Component {

  render(){
    const { session } = this.props

    return <div className="CardModal-CardComments">
      <div className="CardModal-CardComments-header">
        <div className="CardModal-CardComments-header-icon">
          <Icon size="2" type="comment-o"/>
        </div>
        <div className="CardModal-CardComments-header-title">
          Add Comment
        </div>
      </div>
      <div className="CardModal-CardComments-body">
        <div className="CardModal-CardComments-image-container">
          <img className="CardModal-CardComments-image" src={session.user.avatar_url}></img>
        </div>
        <Form className="CardModal-CardComments-Form">
          <textarea
            className="CardModal-CardComments-Form-input"
            ref="comment"
            placeholder='Write a comment...'
          />
          <Button type="primary" disabled="true" className="CardModal-CardComments-Form-submit">
            Send
          </Button>
        </Form>
        <div className="CardModal-CardComments-comments"></div>
      </div>
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
      <pre className="CardModal-CardDescription-content">{this.props.card.description}</pre>
    </div>
  }
}
