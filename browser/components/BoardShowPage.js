import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import Button from './Button'
import Icon from './Icon'
import $ from 'jquery'
import boardStore from '../stores/boardStore'
import DeleteBoardButton from './BoardShowPage/DeleteBoardButton'
import CardModal from './BoardShowPage/CardModal'
import List from './BoardShowPage/List'
import Card from './BoardShowPage/Card'
import NewListForm from './BoardShowPage/NewListForm'
import InviteByEmailButton from './InviteByEmailButton'
import LeaveBoardButton from './BoardShowPage/LeaveBoardButton'

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
      draggingCardId: null,
      draggingListId: null,
      draggingListNewOrder: null,
      draggingCardNewListId: null,
      draggingCardNewOrder: null,
    }
    this.scrollToTheRight = this.scrollToTheRight.bind(this)
    this.closeCardModal = this.closeCardModal.bind(this)

    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    document.body.addEventListener('mouseup', this.onDragEnd, false)
    document.body.addEventListener('dragend', this.onDragEnd, false)

    // document.body.addEventListener('dragstart', event => { console.log(':D dragstart', event) }, false)
    // document.body.addEventListener('drag',      event => { console.log(':D drag', event) }, false)
    // document.body.addEventListener('dragenter', event => { console.log(':D dragenter', event) }, false)
    // document.body.addEventListener('dragexit',  event => { console.log(':D dragexit', event) }, false)
    // document.body.addEventListener('dragleave', event => { console.log(':D dragleave', event) }, false)
    // // document.body.addEventListener('dragover',  event => { console.log(':D dragover', event) }, false)
    // document.body.addEventListener('drop',      event => { console.log(':D drop', event) }, false)
    // document.body.addEventListener('dragend',   event => { console.log(':D dragend', event) }, false)
    // this.onMouseDown = this.onMouseDown.bind(this)
    // this.onMouseMove = this.onMouseMove.bind(this)
    // this.onMouseUp = this.onMouseUp.bind(this)
    // this.listStartDragging = this.listStartDragging.bind(this)
    // this.listStopDragging = this.listStopDragging.bind(this)
    // this.setListDragOver = this.setListDragOver.bind(this)
  }

  componentDidUpdate(){
    if (this._scrollToTheRight){
      this.refs.lists.scrollLeft = this.refs.lists.scrollWidth
      this._scrollToTheRight = false
    }
  }

  componentWillUnmount(){
    document.body.removeEventListener('mouseup', this.onDragEnd, false)
    document.body.removeEventListener('dragend', this.onDragEnd, false)
  }

  scrollToTheRight(){
    this._scrollToTheRight = true
  }

  onDragStart(event){
    const dragTarget = $(event.target).closest('.BoardShowPage-Card-box, .BoardShowPage-ListWrapper')
    // dragging card
    if (dragTarget.is('.BoardShowPage-Card-box')){
      console.log('started dragging card', dragTarget.data('card-id'))
      this.setState({
        dragging: 'card',
        draggingCardId: dragTarget.data('card-id'),
        draggingListId: null,
      })
      return
    }
    // dragging list
    if (dragTarget.is('.BoardShowPage-ListWrapper')){
      console.log('started dragging list', dragTarget.data('list-id'))
      const x = {
        dragging: 'list',
        draggingListId: dragTarget.data('list-id'),
        draggingCardId: null,
      }
      console.log(x)
      this.setState(x)
      return
    }
    // const dragImage = new Image()
    // dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'
    // event.dataTransfer.setDragImage(dragImage, 0, 0)
  }


  getListById(id){
    return this.props.board.lists.find(list => list.id === id)
  }
  getCardById(id){
    return this.props.board.cards.find(card => card.id === id)
  }

  onDragEnter(event){
    event.preventDefault()
    if (!this.state.dragging) return
    if (this.state.dragging === 'card') return this.onCardDragEnter(event)
    if (this.state.dragging === 'list') return this.onListDragEnter(event)
  }

  onCardDragEnter(event){
    const dropTarget = $(event.target).closest('.BoardShowPage-Card-box')
    if (dropTarget.length === 0) return
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

    if (draggingCardNewListId === newListId && draggingCardNewOrder === newOrder) return
    this.setState({
      draggingCardNewOrder: newOrder,
      draggingCardNewListId: newListId,
    })
  }

  onListDragEnter(event){
    const dropTarget = $(event.target).closest('.BoardShowPage-ListWrapper')
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

  onDragEnd(event){
    console.log('onDragEnd', event.type, event.target)

    if (this.state.dragging === 'list'){
      const list = this.getListById(this.state.draggingListId)
      if (typeof this.state.draggingListNewOrder === 'number'){
        let newOrder = this.state.draggingListNewOrder
        this.moveList({list: list, order: newOrder})
        // TEMP HACK TODO FIX ME
        //list.order = this.state.draggingListNewOrder
        // this.props.board.lists
        //   .sort((a, b) => a.order - b.order)
        //   .forEach((list, index) => list.order = index)
      }
    }

    if (this.state.dragging === 'card'){
      const card = this.getCardById(this.state.draggingCardId)
      let newListId = this.state.draggingCardNewListId
      let newOrder = this.state.draggingCardNewOrder
      this.moveCard({ card, listId: newListId, order: newOrder })
    }

    this.setState({
      dragging: null,
      draggingCardId: null,
      draggingListId: null,
      draggingListNewOrder: null,
      draggingCardNewListId: null,
      draggingCardNewOrder: null,
    })
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
    // card.order = card.order > order ? order + 0.5
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
    console.log('RENDER', {state: this.state})
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
        cards={cards}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragEnd={this.onDragEnd}
      />
    })

    const style = {
      backgroundColor: board.background_color,
    }

    let cardBeingDraggedNode
    if (this.state.dragging === 'card'){
      const cardBeingDragged = board.cards
        .find(card => card.id === this.state.draggingCardId)
      cardBeingDraggedNode = <Card
        editable
        key={cardBeingDragged.id}
        card={cardBeingDragged}
        beingDragged
        order={this.state.draggingCardNewOrder}
      />
    }

    return <Layout className="BoardShowPage" style={style}>
      {cardModal}
      <div className="BoardShowPage-Header">
        <h1>{board.name}</h1>
        <div>
          <DownloadBoardButton boardId={board.id}/>
          <InviteByEmailButton boardId={board.id}/>
          <LeaveBoardButton boardId={board.id}/>
        </div>
      </div>
      <div
        ref="lists"
        className="BoardShowPage-lists"
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        {cardBeingDraggedNode}
        {listNodes}
        <NewListForm board={board} afterCreate={this.scrollToTheRight} />
      </div>
    </Layout>
  }
}

const DownloadBoardButton = (props) => {
  return <Button type="invisible" className="BoardShowPage-button BoardShowPage-DeleteBoardButton" href={`/api/boards/${props.boardId}?download=1`}>Export Board</Button>
}


const clearTextSelection = () => {
  var sel = window.getSelection ?
    window.getSelection() :
    document.selection;
  if (sel && sel.removeAllRanges) sel.removeAllRanges();
  if (sel && sel.empty) sel.empty();
}
