import React, { Component } from 'react'
import $ from 'jquery'
import boardsStore from '../../stores/boardsStore'

export default class DeleteBoardButton extends Component {

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
      url: `/api/boards/${this.props.boardId}/archive`,
    }).then( () => {
      this.context.redirectTo('/')
      boardsStore.reload()
    })
  }

  render(){
    return <button className="MenuSideBar-button MenuSideBar-DeleteBoardButton" onClick={this.onClick}>
      Archive
    </button>
  }
}
