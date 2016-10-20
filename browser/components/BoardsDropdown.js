import './BoardsDropdown.sass'
import React, { Component } from 'react'
import createStoreProvider from './createStoreProvider'
import boardsStore from '../stores/boardsStore'
import Link from './Link'
import CreateBoardPopover from './CreateBoardPopover'
import ToggleComponent from './ToggleComponent'

class BoardsDropdown extends ToggleComponent {
  render() {
    const dropdown = this.state.open ?
      <Dropdown ref="toggle" boards={this.props.boards} close={this.close} /> :
      null
    return <div className="BoardsDropdown" >
      <button className={this.props.className} onClick={this.toggle}>Boards</button>
      {dropdown}
    </div>
  }
}

class Dropdown extends ToggleComponent {
  render(){
    let boards
    if (this.props.boards === null){
      boards = <div>Loading. . .</div>
    }else{
      boards = this.props.boards.map(board =>
        <Board key={board.id} board={board} onClick={this.props.close} />
      )
    }
    return <div className="BoardsDropdown-dropdown">
      <div className="BoardsDropdown-content">
        {boards}
        <Link onClick={this.toggle}>Create new board...</Link>
      </div>
      {this.state.open ?
        <CreateBoardPopover
          ref="toggle"
          onClose={this.close}
          onSave={this.props.close}
        /> :
        null
      }
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
    </Link>
  </div>
}


export default createStoreProvider({
  as: 'boards',
  store: boardsStore,
  render: BoardsDropdown,
})
