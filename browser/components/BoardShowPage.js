import React, { Component } from 'react'
import './BoardShowPage.sass'
import Layout from './Layout'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import boardStore from '../stores/boardStore'
import DeleteBoardButton from './BoardShowPage/DeleteBoardButton'
import List from './BoardShowPage/List'
import NewListForm from './BoardShowPage/NewListForm'

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

  render() {
    const { board } = this.props
    if (!board) return <Layout className="BoardShowPage" />

    const lists = board.lists.map(list => {
      const cards = board.cards.filter(card => card.list_id === list.id)
      return <List key={list.id} board={board} list={list} cards={cards} />
    })

    const style = {
      backgroundColor: board.background_color
    }

    return <Layout className="BoardShowPage" style={style}>
      <div className="BoardShowPage-Header">
        <h1>{board.name}</h1>
        <DeleteBoardButton boardId={board.id}/>
      </div>
      <div className="BoardShowPage-lists" ref="lists">
        {lists}
        <NewListForm board={board} afterCreate={this.scrollToTheRight} />
      </div>
    </Layout>
  }
}

