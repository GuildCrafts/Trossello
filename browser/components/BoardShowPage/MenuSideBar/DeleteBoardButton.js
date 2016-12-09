import React, { Component } from 'react'
import Button from '../../Button'
import boardsStore from '../../../stores/boardsStore'
import commands from '../../../commands'

export default class DeleteBoardButton extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(event){
    return commands.archiveBoard(this.props.boardId, this.context.redirectTo('/'))
  }

  render(){
    return <Button onClick={this.onClick}>Archive</Button>
  }
}
