import React, { Component } from 'react'
import Button from '../../Button'
import $ from 'jquery'
import boardsStore from '../../../stores/boardsStore'
import ConfirmationButton from '../../ConfirmationButton'

export default class LeaveBoardButton extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.leaveBoard = this.leaveBoard.bind(this)
  }

  leaveBoard(event){
    $.ajax({
      method: "POST",
      url: `/api/boards/${this.props.boardId}/leave`,
    }).then( () => {
      this.context.redirectTo('/')
      boardsStore.reload()
    })
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
