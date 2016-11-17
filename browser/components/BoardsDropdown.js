import './BoardsDropdown.sass'
import React, { Component } from 'react'
import createStoreProvider from './createStoreProvider'
import boardsStore from '../stores/boardsStore'
import sessionStore from '../stores/sessionStore'
import Link from './Link'
import CreateBoardPopover from './CreateBoardPopover'
import ToggleComponent from './ToggleComponent'
import StarIcon from './StarIcon'
import $ from 'jquery'

class BoardsDropdown extends ToggleComponent {
  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.toggleBoardsDropdownLock = this.toggleBoardsDropdownLock.bind(this)
  }

  toggleBoardsDropdownLock(){
    const {user} = this.context.session
    const url = `/api/users/${user.id}/${user.boards_dropdown_lock ? 'unlock' : 'lock'}dropdown`
    $.ajax({
      method: 'post',
      url: url,
    }).then(() => {
      sessionStore.reload()
    })
  }

  render(){
    const { boards } = this.props
    const { user } = this.context.session
    const boardsDropdownClassName = user.boards_dropdown_lock ?
      "BoardsDropdown-dropdown locked" :
      "BoardsDropdown-dropdown"
    const boardsDropdownHeader = user.boards_dropdown_lock ?
      <div className="BoardsDropdown-header"><h4>Boards</h4></div>:
      null

    if (!boards) {
      return <div className={boardsDropdownClassName}>
        {boardsDropdownHeader}
        <div className="BoardsDropdown-content">
          <div>Loading...</div>
        </div>
      </div>
    }

    let starredBoards = boards.filter(board => board.starred)
    let allBoards = boards

    const renderBoard = board => (
      <Board key={board.id} board={board} onClick={this.props.close} />
    )

    starredBoards = starredBoards.map(renderBoard)
    allBoards = allBoards.map(renderBoard)

    const titleBoards = (title, boards) => {
      if (boards.length > 0) {
        boards.unshift(
          <div key="header" className="BoardsDropdown-sidebar-header">
            {title}
          </div>
        )
      }
    }

    titleBoards("Starred Boards", starredBoards)
    titleBoards("All Boards", allBoards)

    let createBoardPopover = this.state.open ?
      <CreateBoardPopover
        ref="toggle"
        onClose={this.close}
        onSave={this.props.close}
      /> : null

    return <div className={boardsDropdownClassName}>
      {boardsDropdownHeader}
      <div className="BoardsDropdown-content">
        {starredBoards}
        {allBoards}
        <Link onClick={this.toggle}>{this.state.open ? 'Cancel' : 'Create new board…'}</Link>
        <Link onClick={this.toggleBoardsDropdownLock}>{user.boards_dropdown_lock ? 'Don\'t keep this menu open.' : 'Always keep this menu open.'}</Link>
      </div>
      {createBoardPopover}
    </div>
  }
}

const Board = ({board, onClick}) => {
  return <div className="BoardsDropdown-board">
    <span className="BoardsDropdown-background" style={{backgroundColor: board.background_color}}></span>
    <Link to={`/boards/${board.id}`} className="BoardsDropdown-link" onClick={onClick}>
      <span className="BoardsDropdown-thumbnail" style={{backgroundColor: board.background_color}}></span>
      <span className="BoardsDropdown-text">
        <span className="BoardsDropdown-title">{board.name}</span>
      </span>
      <StarIcon board={board} onChange={reloadBoardStores}/>
    </Link>
  </div>
}

export default createStoreProvider({
  as: 'boards',
  store: boardsStore,
  render: BoardsDropdown,
})

const reloadBoardStores = () => {
  boardStore.reload()
  boardsStore.reload()
}
