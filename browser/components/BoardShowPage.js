import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import boardStore from '../stores/boardStore'
import DeleteBoardButton from './BoardShowPage/DeleteBoardButton'
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
    return <BoardShowPage board={boardStore.value} />
  }

}

export default BoardProvider

class BoardShowPage extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragging: null,
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.scrollToTheRight = this.scrollToTheRight.bind(this)
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


  onMouseDown(event){
    const cardNode = $(event.target).closest('*[data-card-id]')
    if (cardNode.length === 0) return
    const cardId = Number(cardNode.data('card-id'))
    const listId = Number(cardNode.data('list-id'))
    const order  = Number(cardNode.data('order'))
    // console.log('MOVE', cardId, listId, order)
    const height = cardNode.outerHeight()
    const width = cardNode.outerWidth()
    const top = cardNode.offset().top
    const left = cardNode.offset().left
    const x = event.clientX
    const y = event.clientY
    this.setState({ dragging: { cardId, listId, order, height, width, top, left, x, y }})
  }

  onMouseMove(event){
    const { dragging } = this.state
    if (!dragging) return

    let { cardId, listId, order, height, width, top, left, x, y} = dragging

    top += event.clientY - y
    left += event.clientX - x
    x = event.clientX
    y = event.clientY

    const targetCardNode = $(event.target).closest('*[data-card-id]')

    if (targetCardNode.length > 0){
      const targetCardId = Number(targetCardNode.data('card-id'))
      if (targetCardId !== cardId) {
        const rect = targetCardNode[0].getBoundingClientRect()
        const middleOfTarget = rect.top + (rect.height/2)
        listId = Number(targetCardNode.data('list-id'))
        order = Number(targetCardNode.data('order')) - 0.5
        if (event.clientY > middleOfTarget) order += 1
        // console.log('MOVE', cardId, listId, order)
      }
    }

    this.setState({ dragging: { cardId, listId, order, height, width, top, left, x, y }})
  }

  onMouseUp(event){
    const { dragging } = this.state
    if (!dragging) return
    let {cardId, listId, order} = dragging
    order += 0.5
    const card = this.props.board.cards.find(card => card.id === cardId)

    if (card.list_id !== listId || card.order !== order){
      console.info(`moving card: ${cardId} from ${card.list_id}:${card.order} to ${listId}:${order}`)

      $.ajax({
        method: 'post',
        url: `/api/cards/${cardId}/move`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
          board_id: card.board_id,
          list_id: listId,
          order: order,
        }),
      }).then(() => {
        boardStore.reload()
      })
    }

    this.setState({ dragging: null }, clearTextSelection)
  }


  render() {
    const { board } = this.props
    const { dragging } = this.state

    if (!board) return <Layout className="BoardShowPage" />

    const lists = board.lists.map(list => {
      return <List
        key={list.id}
        board={board}
        list={list}
        onDragOver={this.onDragOver}
        onDragEnd={this.onDragEnd}
        onDrop={this.onDrop}
        dragging={dragging}
      />
    })

    const style = {
      backgroundColor: board.background_color,
      userSelect: dragging ? 'none' : 'auto',
    }

    let cardBeingDraggedNode
    if (dragging){
      const cardBeingDragged = board.cards
        .find(card => card.id === dragging.cardId)
      cardBeingDraggedNode = <Card
        editable
        archivable
        key={cardBeingDragged.id}
        card={cardBeingDragged}
        beingDragged
        order={dragging.order}
        style={{
          height: dragging.height+'px',
          width: dragging.width+'px',
          top: dragging.top+'px',
          left: dragging.left+'px',
        }}
      />
    }

    return <Layout className="BoardShowPage" style={style}>
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
        {lists}
        <NewListForm board={board} afterCreate={this.scrollToTheRight} />
      </div>
    </Layout>
  }
}

const DownloadBoardButton = (props) => {
  return <a className="BoardShowPage-button BoardShowPage-DeleteBoardButton" href={`/api/boards/${props.boardId}?download=1`}>Export Board</a>
}


const clearTextSelection = () => {
  console.log('clearing selection')
  var sel = window.getSelection ?
    window.getSelection() :
    document.selection;
  if (sel && sel.removeAllRanges) sel.removeAllRanges();
  if (sel && sel.empty) sel.empty();
}
