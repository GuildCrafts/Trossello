import React, { Component } from 'react'
import Button from '../../Button'
import boardsStore from '../../../stores/boardsStore'
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
    return commands.leaveBoard(this.props.boardId, this.context.redirectTo('/'))
  }

  render(){
    return <ConfirmationButton
      type="invisible"
      className="BoardShowPage-MenuSideBar-options"
      onConfirm={this.leaveBoard}
      buttonName="Leave Board"
      title='Leave Board?'
      message='Are you sure you want to leave this board?'
    >
      Leave Board
    </ConfirmationButton>
  }
}
