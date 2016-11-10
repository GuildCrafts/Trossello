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
      // potentialDragging: null,
      // dragging: null,
      // listDragging: false,
      // listDraggingId: null,
      // overList: null
    }
    this.scrollToTheRight = this.scrollToTheRight.bind(this)
    this.closeCardModal = this.closeCardModal.bind(this)

    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
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
      this.setState({
        dragging: 'list',
        draggingListId: dragTarget.data('list-id'),
        draggingCardId: null,
      })
      return
    }
    // const dragImage = new Image()
    // dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'
    // event.dataTransfer.setDragImage(dragImage, 0, 0)
  }


  getListById(id){
    return this.props.board.lists.find(list => list.id === id)
  }

  onDragEnter(event){
    console.log('onDragEnter', this.state.dragging)
    if (!this.state.dragging) return

    if (this.state.dragging === 'card')
      return this.onCardDragEnter(event)

    if (this.state.dragging === 'list')
      return this.onListDragEnter(event)

  }

  onCardDragEnter(event){
    const dropTarget = $(event.target).closest('.BoardShowPage-Card-box')
    if (dropTarget.length === 0) return
    this.setState({
      TBD: '??'
    })
  }

  onListDragEnter(event){
    const dropTarget = $(event.target).closest('.BoardShowPage-ListWrapper')
    if (dropTarget.length === 0) return
    const draggingListId = this.state.draggingListId
    const targetListId = dropTarget.data('list-id')
    console.log({draggingListId, targetListId})
    if (draggingListId === targetListId){
      return
    }
    const targetList = this.getListById(targetListId)
    const draggingList = this.getListById(draggingListId)
    const draggingListNewOrder = this.state.draggingListNewOrder || draggingList.order
    const newOrder = targetList.order + (
      draggingListNewOrder < targetList.order ? 0.5 : -0.5
    )
    // if (this.state.draggingListNewOrder === newOrder) return
    this.setState({
      draggingListNewOrder: newOrder
    })
  }

  //
  //   }
  //
  //   const dropTarget = $(event.target).closest('.BoardShowPage-Card-box, .BoardShowPage-ListWrapper')
  //   // drop target card
  //   if (dragTarget.is('.BoardShowPage-Card-box')){
  //
  //   }
  //   // dragging list
  //   if (dragTarget.is('.BoardShowPage-ListWrapper')){
  //   }
  //
  //   if (targetListId && this.state.targetListId !== targetListId){
  //     console.log('onListDragEnter', targetListId)
  //     this.setState({
  //       targetListId: targetListId,
  //     })
  //   }
  // }

  onDragEnd(event){
    console.log('onListDragEnd', event.target)
    this.setState({
      dragging: null,
      draggingCardId: null,
      draggingListId: null,
      draggingListNewOrder: null,
    })
  }


  //
  // onMouseDown(event){
  //   if (event.isPropagationStopped()) return
  //   const cardNode = $(event.target).closest('.BoardShowPage-Card .BoardShowPage-Card-box')
  //   if (cardNode.length === 0) return
  //   const cardId = Number(cardNode.data('card-id'))
  //   const listId = Number(cardNode.data('list-id'))
  //   const order  = Number(cardNode.data('order')) - 0.5
  //   const height = cardNode.outerHeight()
  //   const width = cardNode.outerWidth()
  //   const top = cardNode.offset().top
  //   const left = cardNode.offset().left
  //   const x = event.clientX
  //   const y = event.clientY
  //
  //   this.setState({
  //     potentialDragging: { cardId, listId, order, height, width, top, left, x, y }
  //   })
  // }
  //
  // listStartDragging(listId){
  //   this.setState({
  //     listDragging: true,
  //     listDraggingId: listId
  //   })
  //   console.log("Over here", listId)
  // }
  //
  // listStopDragging(){
  //   this.setState({
  //     listDragging: false,
  //     listDraggingId: null
  //   })
  // }
  //
  // setListDragOver(list){
  //   console.log("Some list", this.state, list.id)
  //   this.setState({
  //     overList: list
  //   })
  // }
  //
  // onMouseMove(event){
  //   // let { potentialDragging, dragging } = this.state
  //   // if (!potentialDragging && !dragging) return
  //   //
  //   // if (potentialDragging){
  //   //   const distance = (
  //   //     Math.abs(potentialDragging.y - event.clientY) +
  //   //     Math.abs(potentialDragging.x - event.clientX)
  //   //   )
  //   //   if (distance < 10) return
  //   //   dragging = potentialDragging
  //   // }
  //   //
  //   // let { cardId, listId, order, height, width, top, left, x, y} = dragging
  //   // let { board } = this.props
  //   //
  //   // top += event.clientY - y
  //   // left += event.clientX - x
  //   // x = event.clientX
  //   // y = event.clientY
  //   //
  //   // const targetNode = $(event.target).closest('.BoardShowPage-List, .BoardShowPage-Card .BoardShowPage-Card-box')
  //   //
  //   // if (targetNode.is('.BoardShowPage-List')){
  //   //   const targetListId = Number(targetNode.data('list-id'))
  //   //   if (board.cards.filter(card => card.list_id === targetListId).length === 0){
  //   //     listId = targetListId
  //   //     order = -0.5
  //   //   }
  //   // }
  //   //
  //   // if (targetNode.is('.BoardShowPage-Card .BoardShowPage-Card-box')){
  //   //   const targetCardId = Number(targetNode.data('card-id'))
  //   //   if (targetCardId !== cardId) {
  //   //     const rect = targetNode[0].getBoundingClientRect()
  //   //     const middleOfTarget = rect.top + (rect.height/2)
  //   //     listId = Number(targetNode.data('list-id'))
  //   //     order = Number(targetNode.data('order')) - 0.5
  //   //     if (event.clientY > middleOfTarget) order += 1
  //   //   }
  //   // }
  //   //
  //   // this.setState({
  //   //   potentialDragging: null,
  //   //   dragging: { cardId, listId, order, height, width, top, left, x, y }
  //   // })
  // }
  //
  // onMouseUp(event){
  //   // clearTimeout(this.starDraggingTimeout)
  //   // const { dragging } = this.state
  //   // if (!dragging){
  //   //   this.setState({ potentialDragging: null })
  //   //   return
  //   // }
  //   // let {cardId, listId, order} = dragging
  //   // order += 0.5
  //   // const card = this.props.board.cards.find(card => card.id === cardId)
  //   // if (card.list_id !== listId || card.order !== order){
  //   //   this.moveCard({card, listId, order})
  //   // }
  //   // this.setState({ dragging: null }, clearTextSelection)
  // }
  //
  // moveCard({ card, listId, order }){
  //   // const { board } = this.props
  //   //
  //   // card.list_id = listId
  //   // card.order = order - 0.5
  //   //
  //   // $.ajax({
  //   //   method: 'post',
  //   //   url: `/api/cards/${card.id}/move`,
  //   //   contentType: "application/json; charset=utf-8",
  //   //   dataType: "json",
  //   //   data: JSON.stringify({
  //   //     boardId: card.board_id,
  //   //     listId: listId,
  //   //     order: order,
  //   //   }),
  //   // }).then(() => {
  //   //   boardStore.reload()
  //   // })
  // }

  closeCardModal(){
    this.context.redirectTo(`/boards/${this.props.board.id}`)
  }

  render() {
    console.log('RENDER', this.state)
    const { board, viewingCard } = this.props
    const { dragging } = this.state
    if (!board) return <Layout className="BoardShowPage" />

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

    let lists = board.lists
      .filter(list => !list.archived)

    if (this.state.dragging === 'list'){
      lists = lists.map( list => {
        if (list.id === this.state.draggingListId) {
          const listClone = Object.assign({}, list)
          listClone.order = this.state.draggingListNewOrder
          return listClone
        }
        return list
      })
    }

    lists = lists.sort((a, b) => a.order - b.order)

    const listNodes = lists.map(list => {
      return <List
        key={list.id}
        board={board}
        list={list}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragEnd={this.onDragEnd}
      />
    })
    // onDragOver={this.onDragOver}
    // onDragEnd={this.onDragEnd}
    // onDrop={this.onDrop}
    // dragging={dragging}

    const style = {
      backgroundColor: board.background_color,
      userSelect: dragging ? 'none' : 'auto',
    }

    // let cardBeingDraggedNode
    // if (dragging){
    //   const cardBeingDragged = board.cards
    //     .find(card => card.id === dragging.cardId)
    //   cardBeingDraggedNode = <Card
    //     editable
    //     key={cardBeingDragged.id}
    //     card={cardBeingDragged}
    //     beingDragged
    //     order={dragging.order}
    //     style={{
    //       height: dragging.height+'px',
    //       width: dragging.width+'px',
    //       top: dragging.top+'px',
    //       left: dragging.left+'px',
    //     }}
    //   />
    // }
    let cardBeingDraggedNode

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
