import React, { Component } from 'react'
import $ from 'jquery'
import boardsStore from '../../stores/boardsStore'
import './MenuSideBar.sass'

export default class LeaveBoardButton extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(event){
    $.ajax({
      method: "POST",
      url: `/api/boards/${this.props.boardId}/leave`,
    }).then( () => {
      this.context.redirectTo('/')
      boardsStore.reload()
    })
  }

  render(){
    return <button className='MenuSideBar-LeaveBoard' onClick={this.onClick}>
      Leave Board...
    </button>
  }
}
