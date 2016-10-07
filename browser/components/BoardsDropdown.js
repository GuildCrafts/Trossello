import './BoardsDropdown.sass'
import React, { Component } from 'react'
import createStoreProvider from './createStoreProvider'
import boardsStore from '../stores/boardsStore'
import Link from './Link'
import CreateBoardPopover from './CreateBoardPopover'
import ToggleComponent from './ToggleComponent'

class BoardsDropdown extends Component {

  constructor(props){
    super(props)
    this.state = {
      open: false
    }
    this.toggle = this.toggle.bind(this)
    this.close = this.close.bind(this)
    this.onClick = this.onClick.bind(this)
    document.body.addEventListener('click', this.onClick)
  }

  componentWillUnmount(){
    document.body.removeEventListener('click', this.onClick)
  }

  onClick(event){
    const dropdownNode = this.refs.root
    const targetNode = event.target
    if (dropdownNode.contains(targetNode)) return
    this.setState({
      open: false
    })
  }

  toggle(){
    this.setState({
      open: !this.state.open
    })
  }

  close() {
    this.setState({
      open: false
    })
  }

  render() {
    const dropdown = this.state.open ?
      <Dropdown boards={this.props.boards} close={this.close} /> :
      null
    return <div ref="root" className="BoardsDropdown" >
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
        <Board key={board.id} board={board} close={this.props.close} />
      )
    }
    return <div className="BoardsDropdown-dropdown">
      <div className="BoardsDropdown-content">
        {boards}
        <Link onClick={this.toggle}>Create new board...</Link>
      </div>
      {this.state.open ?
        <CreateBoardPopover onClose={this.close} /> :
        null
      }
    </div>
  }
}

const Board = ({board, close}) => {
  return <div className="BoardsDropdown-board">
    <span className="BoardsDropdown-background" style={{backgroundColor: board.background_color}}></span>
    <Link to={`/boards/${board.id}`} className="BoardsDropdown-link" onClick={close}>
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
