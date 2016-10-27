import React, { Component } from 'react'
import Button from '../Button'
import $ from 'jquery'
import boardsStore from '../../stores/boardsStore'
<<<<<<< HEAD
import ConfirmationButton from '../ConfirmationButton'

=======
import ConfirmationLink from '../ConfirmationLink'
>>>>>>> db24186... MenuSideBar styling
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
<<<<<<< HEAD
    return <ConfirmationButton
      type="invisible"
      className="BoardShowPage-button BoardShowPage-DeleteBoardButton"
=======
    return <ConfirmationLink
      className='MenuSideBar-options'
>>>>>>> 8264ec4... styles for menu components and oggle between archived and more menu
      onConfirm={this.leaveBoard}
      buttonName="Leave Board"
      title='Leave Board?'
      message='Are you sure you want to leave this board?'
    >
      Leave Board
    </ConfirmationButton>
  }
}
