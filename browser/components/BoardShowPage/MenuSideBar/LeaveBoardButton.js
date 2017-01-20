import React, { Component } from 'react'
import Button from '../../Button'
import ConfirmationButton from '../../ConfirmationButton'
import commands from '../../../commands'

export default class LeaveBoardButton extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.leaveBoard = this.leaveBoard.bind(this)
  }

  leaveBoard(event){
    commands.leaveBoard(this.props.boardId)
      .then(_ => this.context.redirectTo('/'))
  }

  render(){
    return <ConfirmationButton
      type="invisible"
      className="BoardShowPage-MenuSideBar-PaneButton BoardShowPage-MenuSideBar-LeaveBoardButton"
      onConfirm={this.leaveBoard}
      buttonName="Leave Board"
      title='Leave Board?'
      message='Are you sure you want to leave this board?'
    >
      Leave Board
    </ConfirmationButton>
  }
}
