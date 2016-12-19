import React, { Component } from 'react'
import Button from '../../Button'
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
    commands.archiveBoard(this.props.boardId)
      .then(_ => this.context.redirectTo('/') )
  }

  render(){
    return <Button onClick={this.onClick}>Archive</Button>
  }
}
