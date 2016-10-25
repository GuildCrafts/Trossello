import React, { Component } from 'react'
import $ from 'jquery'
import Link from '../Link'
import ToggleComponent from '../ToggleComponent'
import DeleteBoardButton from './DeleteBoardButton'
import LeaveBoardButton from './LeaveBoardButton'
import InviteByEmailButton from '../InviteByEmailButton'
import './MenuSideBar.sass'
import Icon from '../Icon'
import MoreMenuOptionsButton from './MoreMenuOptionsButton'

export default class MenuSideBar extends ToggleComponent {

  static PropTypes = {
    board: React.PropTypes.object.required
  }


  render(){
    const content = this.state.open ?
      <MenuSideBarMore
        board={this.props.board}
        closeMore={this.close}
        closeMenu={this.props.onClose}
      /> :
      <MenuSideBarMain
        board={this.props.board}
        showMore={this.open}
        closeMenu={this.props.onClose}
      />


    return <div className="MenuSideBar">
      {content}
    </div>

  }
}

const DownloadBoardButton = (props) => {
  return <a className="MenuSideBar-button MenuSideBar-DownloadBoardButton" href={`/api/boards/${props.boardId}?download=1`}>Export Board</a>
}

const MenuSideBarMain = (props) => {
  return <div>
    <div className="MenuSideBar-header" >
      Menu
      <Link className="MenuSideBar-cancel" onClick={props.closeMenu}>
        <Icon type="times" />
      </Link>
      <hr/>
    </div>
    <div className="MenuSideBar-members">
      <InviteByEmailButton boardId={props.board.id}/>
      <hr/>
    </div>
    <div className="MenuSideBar-buttons">
      <Link onClick={props.showMore}>
        More options
      </Link>
      <hr/>
    </div>
    <div className="MenuSideBar-activity">
      <h5>Activity</h5>
    </div>
  </div>
}

const MenuSideBarMore = (props) => {
  return <div>
    <div className="MenuSideBar-header" >
      More
      <Link className="MenuSideBar-backArrow" onClick={props.closeMore}>
        <Icon type="arrow-left" />
      </Link>
      <Link className="MenuSideBar-cancel" onClick={props.closeMenu}>
        <Icon type="times" />
      </Link>
      <hr/>
    </div>
    <div className="MenuSideBar-buttons">
      <DeleteBoardButton boardId={props.board.id}/>
      <DownloadBoardButton boardId={props.board.id}/>
      <hr/>
      <LeaveBoardButton boardId={props.board.id}/>
    </div>
  </div>
}
