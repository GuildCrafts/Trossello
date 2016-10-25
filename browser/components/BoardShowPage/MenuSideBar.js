import React, { Component } from 'react'
import $ from 'jquery'
import Link from '../Link'
import ToggleComponent from '../ToggleComponent'
import DeleteBoardButton from './DeleteBoardButton'
import LeaveBoardButton from './LeaveBoardButton'
import InviteByEmailButton from '../InviteByEmailButton'
import './MenuSideBar.sass'
import Icon from '../Icon'

export default class MenuSideBar extends Component {

  static PropTypes = {
    board: React.PropTypes.object.required,
  }

  render(){
    return <div className="MenuSideBar">
      <div className="MenuSideBar-header" >
        Menu
        <Link className="MenuSideBar-cancel" onClick={this.props.onClose}>
          <Icon type="times" />
        </Link>
        <hr/>
      </div>
      <div className="MenuSideBar-buttons">
        <DeleteBoardButton boardId={this.props.board.id}/>
        <DownloadBoardButton boardId={this.props.board.id}/>
        <InviteByEmailButton boardId={this.props.board.id}/>
        <LeaveBoardButton boardId={this.props.board.id}/>
      </div>
    </div>

  }
}

const DownloadBoardButton = (props) => {
  return <a className="MenuSideBar-button MenuSideBar-DownloadBoardButton" href={`/api/boards/${props.boardId}?download=1`}>Export Board</a>
}
