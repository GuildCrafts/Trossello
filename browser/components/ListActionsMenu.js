import React, {Component} from 'react'
import $ from 'jquery'
import './ListActionsMenu.sass'
import Button from './Button'
import Link from './Link'
import DialogBox from './DialogBox'
import ConfirmationLink from './ConfirmationLink'
import boardStore from '../stores/boardStore'

class ListActionsMenu extends Component {

  static propTypes = {
    list: React.PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {
      panes: [],
      goingBack: false
    }
    this.createCard = this.createCard.bind(this)
    this.goToPane = this.goToPane.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  goToPane(pane){
      return(event) => {
        if(event) event.preventDefault()
        this.setState({
          panes: [pane].concat(this.state.panes),
          goingBack: false,
        })
      }
  }

  goBack() {
    this.setState({
      panes: this.state.panes.slice(1),
      goingBack: true,
    })
  }

  createCard(event){
    this.props.onCreateCard()
    this.props.onClose()
  }

  render(){
    const { list, board } = this.props
    const paneName = this.state.panes[0] || 'Main'
    const panesMap = {
      "Main":             MainPane,
      "Move All Cards":   MoveAllCardsPane,
    }
    const PaneComponent = panesMap[paneName]

    return <PaneComponent
        key={paneName}
        board={board}
        list={list}
        moveAllCards={this.props.moveAllCards}
        onClose={this.props.onClose}
        createCard={this.createCard}
        goToPane={this.goToPane}
        goBack={this.goBack}
      />
  }
}


const MainPane = ({list, board, goToPane, createCard, onClose}) => {
  return <DialogBox className="ListActionsMenu" heading="List Actions" onClose={onClose}>
    <Link onClick={createCard}>Add a Card…</Link>
    <DialogBox.Divider />
    <Link>Copy List…</Link>
    <Link>Move List…</Link>
    <Link>Subscribe</Link>
    <DialogBox.Divider />
    <Link onClick={goToPane('Move All Cards')}>
    Move All Cards In This List…
    </Link>
    <Link>Archive All Cards In This List…</Link>
    <DialogBox.Divider />
    <ArchiveListLink list={list} />
  </DialogBox>
}

const MoveAllCardsPane = ({list, board, goToPane, createCard, onClose}) => {
  const oldListId = list.id
  const cardsToMove = board.cards.filter( card => {
    if(card.list_id === oldListId) return card
  })
  
  const updateAllCards = (updates) => {
    $.ajax({
      method: 'post',
      url: `/api/lists/cards/move`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(updates),
    })
    .then(() => boardStore.reload())
  }

  const moveCards = (event) => {
    event.preventDefault()
    const targetList = JSON.parse(event.target.getAttribute('list'))
    const orderOffset = board.cards.filter( card => {
      if(card.list_id === list.id) return card
    }).length
    const updates = {
      cardsToMove: cardsToMove,
      newList: targetList.id,
      orderOffset: orderOffset
    }
    updateAllCards(updates)
  }

  const listNames = board.lists.map(list => {
     let newList= JSON.stringify(list)
    return <div className='ListActionsMenu-MoveAllCards-list'>
      <Button onClick={moveCards} list={newList}>
        {list.name}
      </Button>
    </div>})

  return <DialogBox className="ListActionsMenu" heading="Select A List To Move All Cards" onClose={onClose}>
    <div className="ListActionsMenu-MoveAllCards">
      {listNames}
    </div>
  </DialogBox>
}

export default ListActionsMenu

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
