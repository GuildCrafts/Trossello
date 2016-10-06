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

  render() {
    const dropdown = this.state.open ?
      <Dropdown boards={this.props.boards} /> :
      null
    return <div ref="root" className="BoardsDropdown" >
      <button className={this.props.className} onClick={this.toggle}>Boards</button>
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
    <div className="BoardsDropdown-content">{boards}</div>
  </div>
}

const Board = ({board}) => {
  return <div className="BoardsDropdown-board">
    <span className="BoardsDropdown-background" style={{backgroundColor: board.background_color}}></span>
    <Link to={`/boards/${board.id}`} className="BoardsDropdown-link">
      <span className="BoardsDropdown-thumbnail" style={{backgroundColor: board.background_color}}></span>
      <span className="BoardsDropdown-text">
        <span className="BoardsDropdown-title">{board.name}</span>
      </span>
    </Link>
  </div>
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
