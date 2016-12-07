import './BoardsDropdown.sass'
import React, { Component } from 'react'
import $ from 'jquery'
import boardsStore from '../stores/boardsStore'
import sessionStore from '../stores/sessionStore'
import createStoreProvider from './createStoreProvider'
import PopoverMenuButton from './PopoverMenuButton'
import Link from './Link'
import Button from './Button'
import Icon from './Icon'
import CreateBoardPopover from './CreateBoardPopover'
import ToggleComponent from './ToggleComponent'
import BoardStar from './BoardStar'

class BoardsDropdown extends Component {

  static contextTypes = {
    session: React.PropTypes.object.isRequired,
    onBoardClick: React.PropTypes.func,
  }

  static propTypes = {
    boards: React.PropTypes.array.isRequired,
  }

  render(){
    const { boards } = this.props
    const { user } = this.context.session
    const locked = user.boards_dropdown_lock

    let className = "BoardsDropdown"
    if (locked) className += " BoardsDropdown-locked"


    const boardsDropdownHeader = locked ?
      <h4 className="BoardsDropdown-header">Boards</h4> :
      null

    const createBoardPopover = <CreateBoardPopover
      onClose={this.close}
      onSave={this.props.close}
    />

    return <div className={className}>
      {boardsDropdownHeader}
      <div className="BoardsDropdown-content">
        <Boards
          title="Starred Boards"
          boards={boards.filter(board => board.starred)}
          onBoardClick={this.props.onBoardClick}
        />
        <Boards
          title="All Boards"
          boards={boards}
          onBoardClick={this.props.onBoardClick}
        />
        <PopoverMenuButton
          className="BoardsDropdown-CreateBoardButton"
          type="invisible"
          popover={createBoardPopover}
          buttonClassName="BoardsDropdown-Button"
        >
          Create new board…
        </PopoverMenuButton>
        <ToggleBoardsDropdownLock user={user} />
      </div>
    </div>
  }
}

class ToggleBoardsDropdownLock extends Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.toggle = this.toggle.bind(this)
  }

  toggle(){
    const { user } = this.props
    const locked = user.boards_dropdown_lock
    $.ajax({
      method: 'post',
      url: `/api/users/${user.id}/${locked ? 'unlock' : 'lock'}dropdown`,
    }).then(() => {
      sessionStore.reload()
    })
  }

  render(){
    const locked = this.props.user.boards_dropdown_lock
    return <Button
      onClick={this.toggle}
      className="BoardsDropdown-Button"
      type="invisible"
    >
      {locked ? 'Don\'t keep this menu open.' : 'Always keep this menu open.'}
    </Button>
  }
}


class Boards extends ToggleComponent {

  static initialState = true;
  static closeIfUserClicksOutside = false;
  static closeOnEscape = false;

  static propTypes = {
    title: React.PropTypes.string.isRequired,
    boards: React.PropTypes.array.isRequired,
    onBoardClick: React.PropTypes.func,
  };

  render(){
    if (this.props.boards.length === 0) return null

    const boards = this.state.open ?
      this.props.boards.map(board =>
        <Board key={board.id} board={board} onClick={this.props.onBoardClick} />
      ) :
      null

    return <div className="BoardsDropdown-Boards">
      <div className="BoardsDropdown-Boards-title">
        <span>{this.props.title}</span>
        <Button
          type="invisible"
          tabIndex="-1"
          noFocus
          onClick={this.toggle}
        >
          <Icon type={this.state.open ? "minus" : "plus"} />
        </Button>
      </div>
      {boards}
    </div>
  }
}

const Board = ({ board, onClick }) =>
  <div
    className="BoardsDropdown-board"
    style={{backgroundColor: board.background_color}}
  >
    <Link to={`/boards/${board.id}`} onClick={onClick} className="BoardsDropdown-board-thumbnail"></Link>
    <Link to={`/boards/${board.id}`} onClick={onClick} className="BoardsDropdown-board-name">
      <div>{board.name}</div>
    </Link>
    <BoardStar board={board} onChange={reloadBoardStores}/>
  </div>

export default createStoreProvider({
  as: 'boards',
  store: boardsStore,
  render: BoardsDropdown,
})

const reloadBoardStores = () => {
  boardStore.reload()
  boardsStore.reload()
}
