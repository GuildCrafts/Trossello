import React, { Component } from 'react'
import Layout from './Layout'
import PresentationalComponent from './PresentationalComponent'
import Link from './Link'
import './LoggedInHomepage.sass'
import $ from 'jquery'

const LoggedInHomepage = (props) => {
  
  return <Layout className="LoggedInHomepage">
    <div className = "LoggedInHomepage-BoardListHeading">
      All Boards
    </div>
    <BoardsProvider />
  </Layout>
}

export default PresentationalComponent(LoggedInHomepage)

const BoardListHeading = (props) => {
  return
}

class BoardsProvider extends Component {
  constructor(props){
    super(props)
    this.state = {
      boards: null
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
    return <Boards {...props} />
  }

}

const Boards = ({boards}) => {
  if(boards === null){
    return null
  }
  const elements = boards.map(board =>
    <Board key={board.id} board={board} />
  )
  return <div className="LoggedInHomepage-Boards">
    {elements}
  </div>
}

const Board = ({board}) => {
  const style = { 
    backgroundColor: board.background_color
  }
  return <Link style={style} to={`/boards/${board.id}`} className="LoggedInHomepage-Board">
    <div>{board.name}</div>
  </Link>
}
