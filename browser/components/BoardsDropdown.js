import $ from 'jquery'
import './BoardsDropdown.sass'
import React, { Component } from 'react'
import Link from './Link'

class BoardsDropdown extends Component {

  constructor(props){
    super(props)
    this.state = {
      open: false
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle(){
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    const dropdown = this.state.open ?
      <Dropdown boards={this.props.boards} /> :
      null
    return <div className="BoardsDropdown" onClick={this.toggle}>
      <button className={this.props.className}>Boards</button>
      {dropdown}
    </div>
  }
}

const Dropdown = (props) => {
  let boards
  if (props.boards === null){
    boards = <div>Loading. . .</div>
  }else{
    boards = props.boards.map(board =>
      <Board key={board.id} board={board} />
    )
  }
  return <div className="BoardsDropdown-dropdown">
    {boards}
  </div>
}

const Board = ({board}) => {
  return <Link to={`/boards/${board.id}`} className="BoardsDropdown-board">
    {board.name}
    <span className="BoardsDropdown-thumbnail" style={{backgroundColor: board.background_color}}></span>
  </Link>
}

class BoardsProvider extends Component {

  constructor(props){
    super(props)
    this.state = {
      boards: null,
    }
  }

  componentWillMount(){
    $.getJSON('/api/boards')
      .then(boards => {
        this.setState({boards})
      })
  }

  render(){
    const props = Object.assign({}, this.props)
    props.boards = this.state.boards
    return <BoardsDropdown {...props} />
  }
}

export default BoardsProvider
