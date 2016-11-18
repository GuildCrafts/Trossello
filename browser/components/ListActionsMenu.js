import React, {Component} from 'react'
import $ from 'jquery'
import './ListActionsMenu.sass'
import Link from './Link'
import Form from './Form'
import Icon from './Icon'
import Button from './Button'
import DialogBox from './DialogBox'
import ConfirmationLink from './ConfirmationLink'
import boardStore from '../stores/boardStore'

class ListActionsMenu extends Component {

  static propTypes = {
    board: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
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
      "List Actions": ListActionsPane,
      "Copy List": CopyListPane,
      "Move List": MoveListPane,
      "Move All Cards": MoveAllCardsPane,
      "Archive All Cards": ArchiveAllCardsPane,
    }
    const PaneComponent = panesMap[paneName]
    return <div className="ListActionsMenu">
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

const ListActionsPane = ({onClose, createCard, list, goToPane}) => {
  return <DialogBox className="ListActionsMenu-ListActionsPane" heading="List Actions" onClose={onClose}>
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
      this.focusAndSelect()
      return
    }
    const { list } = this.props
    $.ajax({
      method: 'post',
      url: `/api/boards/${list.board_id}/lists/${list.id}/duplicate`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({name: this.state.value}),
    }).then(() => {
      boardStore.reload()
      this.props.onClose()
    })
  }

  onChangeHandler(event) {
    this.setState({value: event.target.value})
  }

  componentDidMount(){
    this.focusAndSelect()
  }

  focusAndSelect(){
    this.refs.textarea.focus()
    this.refs.textarea.select()
  }

  render() {
    return <DialogBox className="ListActionsMenu-CopyListPane" heading="Copy List" onClose={this.props.onClose}>
      <Form onSubmit={this.copyListHandler}>
        <div>Name</div>
        <textarea
          ref="textarea"
          value={this.state.value}
          onChange={this.onChangeHandler}
        />
        <Button type="primary" submit>Create List</Button>
      </Form>
    </DialogBox>
  }
}


class MoveAllCardsPane extends Component {

  static propTypes = {
    list: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired,
  }

  moveCards(destinationList){
    const { list: fromList, board } = this.props

    $.ajax({
      method: 'post',
      url: `/api/lists/${fromList.id}/cards/move-to/${destinationList.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).then(() => {
      this.props.onClose()
      boardStore.reload()
    })
  }

  moveCardsTo(list){
    return (event) => {
      event.preventDefault()
      this.moveCards(list)
    }
  }

  render(){
    const { board, onClose } = this.props
    const lists = board.lists
      .filter(list => !list.archived)
      .sort((a,b) => a.order - b.order)
      .map(list =>
        <Button
          type="invisible"
          key={list.id}
          onClick={this.moveCardsTo(list)}
        >{list.name}</Button>
      )

    return <DialogBox
        className="ListActionsMenu ListActionsMenu-MoveAllCardsPane"
        heading="Select A List To Move All Cards"
        onClose={onClose}
      >
      <div className="ListActionsMenu-MoveAllCards">
        {lists}
      </div>
    </DialogBox>
  }
}

const MoveListPane = ({onClose}) => {
  return <DialogBox className="ListActionsMenu-MoveListPane" heading="Move List" onClose={onClose}>
  </DialogBox>
}


class ArchiveAllCardsPane extends Component {

  constructor(props){
    super(props)
    this.archiveCardsInList = this.archiveCardsInList.bind(this)
  }

  archiveCardsInList(){
    $.ajax({
      method: "POST",
      url: `/api/lists/${this.props.list.id}/archivecards`
    }).then(() => {
      boardStore.reload()
    })
  }

  render(){
    return <DialogBox
      className="ListActionsMenu-ArchiveAllCardsPane"
      heading="Archive All Cards in this List?"
      onClose={this.props.onClose}
    >
      <div className="ListActionsMenu-DialogBox-content">
        <p>
          This will remove all the cards in this list from the board. To view archived
          cards and bring them back to the board, click “Menu” > “Archived Items.”
        </p>
        <Button type="danger" onClick={this.archiveCardsInList}>Archive All</Button>
      </div>
    </DialogBox>
  }
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
