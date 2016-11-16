import React, {Component} from 'react'
import $ from 'jquery'
import './ListActionsMenu.sass'
import Link from './Link'
import Form from './Form'
import Icon from './Icon'
import Button from './Button'
import DialogBox from './DialogBox'
import ConfirmationLink from './ConfirmationLink'

class ListActionsMenu extends Component {

  static propTypes = {
    list: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      pane: 'List Actions'
    }
    this.createCard = this.createCard.bind(this)
    this.goToPane = this.goToPane.bind(this)
  }

  goToPane(pane) {
    return event => {
      if (event) event.preventDefault()
      this.setState({
        pane: pane
      })
    }
  }

  createCard(event){
    this.props.onCreateCard()
    this.props.onClose()
  }

  render(){
    const { list } = this.props
    const paneName = this.state.pane || 'List Actions'
    const panesMap = {
      "List Actions": listActionsPane,
      "Copy List": CopyListPane,
      "Move List": moveListPane,
      "Move All Cards": moveAllCardsPane,
      "Archive All Cards": archiveAllCardsPane,
    }
    const PaneComponent = panesMap[paneName]
    return <div className="ListActionsMenu-Container">
      <GoBackArrow
        pane={this.state.pane}
        goToPane={this.goToPane}
      />
      <PaneComponent
        onClose={this.props.onClose}
        createCard={this.createCard}
        list={this.props.list}
        board={this.props.board}
        goToPane={this.goToPane}
      />
    </div>
  }
}

const GoBackArrow = ({pane, goToPane}) => {
  const goBackIcon = pane === 'List Actions' ? null :
    <Link onClick={goToPane('List Actions')}><Icon type="arrow-left" /></Link>
  return <div className="ListActionsMenu-GoBackArrow"> {goBackIcon} </div>
}

const listActionsPane = ({onClose, createCard, list, goToPane}) => {
  return <DialogBox className="ListActionsMenu" heading="List Actions" onClose={onClose}>
    <Link onClick={createCard}>Add a Card…</Link>
    <DialogBox.Divider />
    <Link onClick={goToPane('Copy List')}>Copy List…</Link>
    <Link onClick={goToPane('Move List')}>Move List…</Link>
    <Link>Subscribe</Link>
    <DialogBox.Divider />
    <Link onClick={goToPane('Move All Cards')}>Move All Cards In This List…</Link>
    <Link onClick={goToPane('Archive All Cards')}>Archive All Cards In This List…</Link>
    <DialogBox.Divider />
    <ArchiveListLink list={list} />
  </DialogBox>
}

class CopyListPane extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.list.name
    }
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.copyListHandler = this.copyListHandler.bind(this)
  }

  copyListHandler(event) {
    event.preventDefault()
    if (this.state.value.replace(/\s+/g,'') === '') {
      this.componentDidMount()
      return
    }
    $.ajax({
      method: 'post',
      url: `/api/lists/${this.props.list.id}/copy`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({name: this.state.value, board_id: this.props.list.board_id}),
    }).then(() => {
      boardStore.reload()
      this.props.onClose()
    })
  }

  onChangeHandler(event) {
    this.setState({value: event.target.value})
  }

  componentDidMount(){
    this.refs.textarea.focus()
    this.refs.textarea.select()
  }

  render() {
    return <DialogBox className="CopyListPane" heading="Copy List" onClose={this.props.onClose}>
      <div className="ListActionsMenu-CopyListPane">
        <Form onSubmit={this.copyListHandler}>
          <div>Name</div>
          <textarea
            ref="textarea"
            value={this.state.value}
            onChange={this.onChangeHandler}
          />
          <Button type="primary" submit>Create List</Button>
        </Form>
      </div>
    </DialogBox>
  }
}

const moveListPane = ({onClose}) => {
  return <DialogBox className="ListActionsMenu" heading="Move List" onClose={onClose}>
    <div className="ListActionsMenu-CopyListPane">Move list pane content...</div>
  </DialogBox>
}

const moveAllCardsPane = ({onClose}) => {
  return <DialogBox className="ListActionsMenu" heading="Move All Cards" onClose={onClose}>
    <div className="ListActionsMenu-CopyListPane">Move All Cards pane content...</div>
  </DialogBox>
}

const archiveAllCardsPane = ({onClose}) => {
  return <DialogBox className="ListActionsMenu" heading="Archive All Cards" onClose={onClose}>
    <div className="ListActionsMenu-CopyListPane">Archive All Cards pane content...</div>
  </DialogBox>
}

class ArchiveListLink extends Component {
  static propTypes = {
    list: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.archiveList = this.archiveList.bind(this)
  }

  archiveList(){
    $.ajax({
      method: "POST",
      url: `/api/lists/${this.props.list.id}/archive`
    }).then(() => {
      boardStore.reload()
    })
  }

  render(){
    return <ConfirmationLink
      onConfirm={this.archiveList}
      buttonName="Archive List"
      title="Archive List?"
      message="Are you sure you want to archive this list?"
    >
      Archive This List
    </ConfirmationLink>
  }
}

export default ListActionsMenu
