import './BoardsDropDown.sass'
import $ from 'jquery'
import React, { Component } from 'react'
import Link from './Link'
import Icon from './Icon'

class BoardsDropDown extends Component {

  constructor(props){
    super(props)
    this.state = {
      open: false,
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle(event){
    if (event) event.preventDefault()
    this.setState({
      open: !this.state.open
    })
  }

  render(){
    const dropdown = this.state.open ? <DropDown loading={this.props.loading} boards={this.props.boards} /> : null
    return <div className="BoardsDropDown">
      <button onClick={this.toggle} className={this.props.className}>Boards</button>
      {dropdown}
    </div>
  }
}

const DropDown = (props) => {
  const boards = props.loading ?
    <div>loading...</div> :
    props.boards.map(board => {
      return <li key={board.id}>{board.name}</li>
    })
  return <div className="BoardsDropDown-dropdown">
    {boards}
  </div>
}


class BoardsDataProvider extends Component {

  // initialize
  constructor(props){
    super(props)
    this.state = {
      boards: null,
      loading: true,
      error: null,
    }
  }

  componentWillMount(){
    $.getJSON('/api/boards')
      .then(boards => {
        this.setState({
          boards: boards,
          loading: false,
        })
      })
      .catch(error => {
        this.setState({
          error: error,
          loading: false,
        })
      })
  }

  render(){
    const props = Object.assign({}, this.props)
    props.boards = this.state.boards
    props.loading = this.state.loading
    return <BoardsDropDown {...props}>{this.props.children}</BoardsDropDown>
  }
}

export default BoardsDataProvider
