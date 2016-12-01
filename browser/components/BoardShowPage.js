import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import Button from './Button'
import Icon from './Icon'
import $ from 'jquery'
import boardStore from '../stores/boardStore'
import boardsStore from '../stores/boardsStore'
import DeleteBoardButton from './BoardShowPage/DeleteBoardButton'
import CardModal from './BoardShowPage/Card/CardModal'
import List from './BoardShowPage/List'
import Card from './BoardShowPage/Card'
import NewListForm from './BoardShowPage/NewListForm'
import LeaveBoardButton from './BoardShowPage/LeaveBoardButton'
import StarIcon from './StarIcon'
import MenuSideBar from './BoardShowPage/MenuSideBar'
import RenameBoardDropdown from './BoardShowPage/RenameBoardDropdown'
import PopoverMenuButton from './PopoverMenuButton'

class BoardProvider extends Component {
  constructor(props){
    super(props)
    this.rerender = this.rerender.bind(this)
    boardStore.setBoardId(props.location.params.boardId)
    boardStore.subscribe(this.rerender)
  }

  componentWillUnmount(){
    boardStore.unsubscribe(this.rerender)
  }

  rerender(){
    this.forceUpdate()
  }

  componentWillReceiveProps(nextProps){
    const boardId = this.props.location.params.boardId
    const nextBoardId = nextProps.location.params.boardId
    if (boardId !== nextBoardId){
      boardStore.setBoardId(nextBoardId)
      boardStore.reload()
    }
  }

  render(){
    const viewingCardId = this.props.location.params.cardId
    const viewingCard = viewingCardId ? Number(viewingCardId) : null
    return <BoardShowPage board={boardStore.value} viewingCard={viewingCard} />
  }
}

export default BoardProvider

class BoardShowPage extends React.Component {
  static contextTypes = {
    redirectTo: React.PropTypes.func.isRequired,
  };

  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragging: null,
      sideBarOpen: false,
      draggingCardId: null,
      draggingListId: null,
      draggingListNewOrder: null,
      draggingCardNewListId: null,
      draggingCardNewOrder: null,
    }
    this.toggleSideBar = this.toggleSideBar.bind(this)
    this.closeSideBar = this.closeSideBar.bind(this)
    this.scrollToTheRight = this.scrollToTheRight.bind(this)
    this.closeCardModal = this.closeCardModal.bind(this)

    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)
    document.addEventListener('dragenter', this.onDragEnter, false)
    document.addEventListener('dragover', this.onDragOver, false)
    document.addEventListener('drop', this.onDrop, false)
  }

  componentDidUpdate(){
    if (this._scrollToTheRight){
      this.refs.lists.scrollLeft = this.refs.lists.scrollWidth
      this._scrollToTheRight = false
    }
  }

  toggleSideBar(event){
    if (event) event.preventDefault()
    this.setState({sideBarOpen: !this.state.sideBarOpen})
  }

  closeSideBar(event){
    if (event) event.preventDefault()
    this.setState({sideBarOpen: false})
  }

  componentWillUnmount(){
    document.removeEventListener('dragenter', this.onDragEnter, false)
    document.removeEventListener('dragover', this.onDragOver, false)
    document.removeEventListener('drop', this.onDrop, false)
  }

  scrollToTheRight(){
    this._scrollToTheRight = true
  }

  onDragStart(event){
    const dragImage = new Image()
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'
    event.dataTransfer.setDragImage(dragImage, 0, 0);

    const dragTarget = $(event.target).closest('.BoardShowPage-Card-box, .BoardShowPage-List')

    this.dragGhost = dragTarget.clone()
    const offset = dragTarget.offset()

    const position = {
      top: offset.top,
      left: offset.left,
      x: event.clientX,
      y: event.clientY,
    }

    this.dragGhost.css({
      pointerEvents: 'none',
      position: 'fixed',
      top:      position.top+'px',
      left:     position.left+'px',
      height:   dragTarget.outerHeight()+'px',
      width:    dragTarget.outerWidth()+'px',
      transform: 'rotate(4deg)',
      zIndex: 1000,
    })
    this.dragGhost.data('position', position)
    this.dragGhost.appendTo('body')


    if (dragTarget.is('.BoardShowPage-Card-box')){
      this.setState({
        dragging: 'card',
        draggingCardId: dragTarget.data('card-id'),
        draggingListId: null,
      })
      return
    }

    if (dragTarget.is('.BoardShowPage-List')){
      this.setState({
        dragging: 'list',
        draggingListId: dragTarget.data('list-id'),
        draggingCardId: null,
      })
      return
    }
  }

  onDragEnter(event){
    event.preventDefault()
    if (this.state.dragging === 'list') return this.onListDragEnter(event)
  }

  onListDragEnter(event){
    const dropTarget = $(event.target).closest('.BoardShowPage-List')
    if (dropTarget.length === 0) return
    const draggingListId = this.state.draggingListId
    const targetListId = dropTarget.data('list-id')
    if (draggingListId === targetListId) return
    const targetList = this.getListById(targetListId)
    const draggingList = this.getListById(draggingListId)
    const draggingListNewOrder = this.state.draggingListNewOrder || draggingList.order
    const newOrder = targetList.order + (
      draggingListNewOrder < targetList.order ? 0.5 : -0.5
    )
    if (draggingListNewOrder === newOrder) return
    this.setState({
      draggingListNewOrder: newOrder
    })
  }

  onDragOver(event){
    event.preventDefault()
    if (!this.dragGhost) return
    let {top, left, x, y} = this.dragGhost.data('position')

    top += event.clientY - y
    left += event.clientX - x
    x = event.clientX
    y = event.clientY

    this.dragGhost.data('position', {top, left, x, y})
    this.dragGhost.css({
      top:  top+'px',
      left: left+'px',
    })

    if (this.state.dragging === 'card') this.onCardDragOver(event)
  }

  onCardDragOver(event){
    const dropTarget = $(event.target).closest('.BoardShowPage-Card-box, .BoardShowPage-List')
    if (dropTarget.length === 0) return

    if (dropTarget.is('.BoardShowPage-Card-box'))
      return this.onCardDragOverAnotherCard(event, dropTarget)

    if (dropTarget.is('.BoardShowPage-List'))
      return this.onCardDragOverAList(event, dropTarget)
  }

  onCardDragOverAnotherCard(event, dropTarget){
    const draggingCardId = this.state.draggingCardId
    const targetCardId = dropTarget.data('card-id')
    if (draggingCardId === targetCardId) return
    const targetCard = this.getCardById(targetCardId)
    const draggingCard = this.getCardById(draggingCardId)

    const draggingCardNewListId = this.state.draggingCardNewListId || draggingCard.list_id
    const draggingCardNewOrder = this.state.draggingCardNewOrder || draggingCard.order
    const newListId = targetCard.list_id

    const rect = dropTarget[0].getBoundingClientRect()
    const middleOfTarget = rect.top + (rect.height/2)
    const newOrder = targetCard.order + (event.clientY > middleOfTarget ? 0.5 : -0.5)

    if (draggingCardNewListId === newListId && draggingCardNewOrder === newOrder)return
    this.setState({
      draggingCardNewOrder: newOrder,
      draggingCardNewListId: newListId,
    })
  }

  onCardDragOverAList(event, dropTarget){
    const draggingCardId = this.state.draggingCardId
    const newListId = dropTarget.data('list-id')
    const targetList = this.getListById(newListId)
    const rect = dropTarget[0].children[0].getBoundingClientRect()
    const belowTarget = rect.bottom - 40
    let newOrder = null
    if(event.clientY > belowTarget){
      newOrder = 10000
    } else {
      return
    }
    this.setState({
      draggingCardNewOrder: newOrder,
      draggingCardNewListId: newListId,
    })
  }

  onDrop(event){
    if (this.state.dragging === 'list'){
      const list = this.getListById(this.state.draggingListId)
      if (typeof this.state.draggingListNewOrder === 'number'){
        let newOrder = this.state.draggingListNewOrder
        this.moveList({list: list, order: newOrder})
      }
    }

    if (this.state.dragging === 'card'){
      const card = this.getCardById(this.state.draggingCardId)
      let newListId = this.state.draggingCardNewListId
      let newOrder = this.state.draggingCardNewOrder
      if (newListId !== null && newOrder !== null){
        this.moveCard({ card, listId: newListId, order: newOrder })
      }
    }

    this.dragGhost.remove()
    delete this.dragGhost

    this.setState({
      dragging: null,
      draggingCardId: null,
      draggingListId: null,
      draggingListNewOrder: null,
      draggingCardNewListId: null,
      draggingCardNewOrder: null,
      positionInfo: null,
    })
  }

  getListById(id){
    return this.props.board.lists.find(list => list.id === id)
  }

  getCardById(id){
    return this.props.board.cards.find(card => card.id === id)
  }


  moveList({ list, order}){
    const { board } = this.props
    list.order = order

    $.ajax({
      method: 'post',
      url: `/api/lists/${list.id}/move`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
        boardId: list.board_id,
        order: order,
      })
    }).then(() => {
      boardStore.reload()
    })
  }

  moveCard({ card, listId, order }){
    const { board } = this.props

    card.list_id = listId
    card.order = order

    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}/move`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
        boardId: card.board_id,
        listId: listId,
        order: order,
      }),
    }).then(() => {
      boardStore.reload()
    })
  }


  closeCardModal(){
    this.context.redirectTo(`/boards/${this.props.board.id}`)
  }

  getLists(){
    let lists = this.props.board.lists
      .filter(list => !list.archived)

    if (this.state.dragging === 'list'){
      lists = lists.map( list => {
        if (list.id === this.state.draggingListId) {
          const listClone = Object.assign({}, list)
          if (typeof this.state.draggingListNewOrder === 'number')
            listClone.order = this.state.draggingListNewOrder
          return listClone
        }
        return list
      })
    }

    return lists.sort((a, b) => a.order - b.order)
  }

  getCards(){
    let cards = this.props.board.cards
      .filter(card => !card.archived)

    if (this.state.dragging === 'card'){
      cards = cards.map( card => {
        if (card.id === this.state.draggingCardId) {
          const cardClone = Object.assign({}, card)
          if (typeof this.state.draggingCardNewListId === 'number')
            cardClone.list_id = this.state.draggingCardNewListId
          if (typeof this.state.draggingCardNewOrder === 'number')
            cardClone.order = this.state.draggingCardNewOrder
          return cardClone
        }
        return card
      })
    }
    return cards
  }

  render() {
    const { board, viewingCard } = this.props
    if (!board) return <Layout className="BoardShowPage" />

    let lists = this.getLists()
    let cards = this.getCards()


    let cardModal
    if (viewingCard) {
      let card = board.cards.find(card => card.id === viewingCard)
      let list = board.lists.find(list => list.id === card.list_id)
      cardModal = <CardModal
        card={card}
        list={list}
        board={board}
        onClose={this.closeCardModal}
      />
    }

    const listNodes = lists.map(list => {
      return <List
        key={list.id}
        board={board}
        list={list}
        ghosted={this.state.draggingListId == list.id}
        cards={cards}
        onDragStart={this.onDragStart}
        draggingCardId={this.state.draggingCardId}
        beingDragged={false}
      />
    })

    const style = {
      backgroundColor: board.background_color,
    }

    const renameBoardDropdown =
      <RenameBoardDropdown
        board={this.props.board}
      />

    const className = `BoardShowPage ${this.state.sideBarOpen ? 'BoardShowPage-sideBarOpen' : ''}`
    return <Layout className={className} style={style}>
      {cardModal}
      <div className="BoardShowPage-container">
        <Header board={board} toggleSideBar={this.toggleSideBar} sideBarOpen={this.state.sideBarOpen} renameBoardDropdown={renameBoardDropdown}/>
        <div
          ref="lists"
          className="BoardShowPage-lists"
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
        >
          {listNodes}
          <NewListForm board={board} afterCreate={this.scrollToTheRight} />
        </div>
      </div>
      <MenuSideBar
        onClose={this.closeSideBar}
        board={board}
      />
    </Layout>
  }
}

const Header = ({board, sideBarOpen, toggleSideBar, renameBoardDropdown}) =>
  <div className="BoardShowPage-Header">
    <PopoverMenuButton className="BoardShowPage-RenameBoardButton" type="invisible" popover={renameBoardDropdown}>
      <h1>{board.name}</h1>
    </PopoverMenuButton>
    <span>
      <StarIcon board={board} onChange={reloadBoardStores} />
    </span>
    <div className="flex-spacer" />
    <Link
      className="BoardShowPage-menuButton"
      onClick={toggleSideBar}
    >
      <Icon className="BoardShowPage-menuButton-icon" type="ellipsis-h" />
      {sideBarOpen ? 'Hide' : 'Show'} Manu
    </Link>
  </div>

const clearTextSelection = () => {
  var sel = window.getSelection ?
    window.getSelection() :
    document.selection;
  if (sel && sel.removeAllRanges) sel.removeAllRanges();
  if (sel && sel.empty) sel.empty();
}

const reloadBoardStores = () => {
  boardStore.reload()
  boardsStore.reload()
}
