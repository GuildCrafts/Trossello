import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import boardStore from '../stores/boardStore'
import DeleteBoardButton from './BoardShowPage/DeleteBoardButton'
import CardViewModal from './CardViewModal'
import List from './BoardShowPage/List'
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
    this.scrollToTheRight = this.scrollToTheRight.bind(this)
    this.closeCardViewModal = this.closeCardViewModal.bind(this)
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

  closeCardViewModal(){
    this.context.redirectTo(`/boards/${this.props.board.id}`)
  }

  render() {
    const { board, viewingCard } = this.props
    if (!board) return <Layout className="BoardShowPage" />

    let cardModal
    if (viewingCard) {
      let card = board.cards.find(card => card.id === viewingCard)
      let list = board.lists.find(list => list.id === card.list_id)
      cardModal = <CardViewModal
        card={card}
        list={list}
        board={board}
        onClose={this.closeCardViewModal}
      />
    }

    const lists = board.lists.map(list => {
      const cards = board.cards.filter(card => card.list_id === list.id)
      return <List key={list.id} board={board} list={list} cards={cards} />
    })

    const style = {
      backgroundColor: board.background_color
    }

    return <Layout className="BoardShowPage" style={style}>
      {cardModal}
      <div className="BoardShowPage-Header">
        <h1>{board.name}</h1>
        <div>
          <DeleteBoardButton boardId={board.id}/>
          <DownloadBoardButton boardId={board.id}/>
          <InviteByEmailButton boardId={board.id}/>
          <LeaveBoardButton boardId={board.id}/>
        </div>
      </div>
      <div className="BoardShowPage-lists" ref="lists">
        {lists}
        <NewListForm board={board} afterCreate={this.scrollToTheRight} />
      </div>
    </Layout>
  }
}

const DownloadBoardButton = (props) => {
  return <a className="BoardShowPage-button BoardShowPage-DeleteBoardButton" href={`/api/boards/${props.boardId}?download=1`}>Export Board</a>
}
