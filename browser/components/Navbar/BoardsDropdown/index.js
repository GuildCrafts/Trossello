import React, { Component } from 'react'
import boardsStore from '../../../stores/boardsStore'
import createStoreProvider from '../../createStoreProvider'
import PopoverMenuButton from '../../PopoverMenuButton'
import CreateBoardPopover from '../CreateBoardPopover'
import Boards from './Boards'
import ToggleBoardsDropdownLock from './ToggleBoardsDropdownLock'
import commands from '../../../commands'
import './index.sass'

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

    let className = "Navbar-BoardsDropdown"
    if (locked) className += " Navbar-BoardsDropdown-locked"


    const boardsDropdownHeader = locked ?
      <h4 className="Navbar-BoardsDropdown-header">Boards</h4> :
      null

    const createBoardPopover = <CreateBoardPopover
      onClose={this.close}
      onSave={this.props.close}
    />

    return <div className={className}>
      {boardsDropdownHeader}
      <div className="Navbar-BoardsDropdown-content">
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
          className="Navbar-BoardsDropdown-CreateBoardButton"
          type="invisible"
          popover={createBoardPopover}
          buttonClassName="Navbar-BoardsDropdown-Button"
        >
          Create new board…
        </PopoverMenuButton>
        <ToggleBoardsDropdownLock user={user} />
      </div>
    </div>
  }
}

export default createStoreProvider({
  as: 'boards',
  store: boardsStore,
  render: BoardsDropdown,
})
