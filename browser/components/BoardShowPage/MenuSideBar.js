import React, { Component } from 'react'
import $ from 'jquery'
import Icon from '../Icon'
import Link from '../Link'
import ToggleComponent from '../ToggleComponent'
import DeleteBoardButton from './DeleteBoardButton'
import LeaveBoardButton from './LeaveBoardButton'
import InviteByEmailButton from '../InviteByEmailButton'
import './MenuSideBar.sass'

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
  return <a className='MenuSideBar-options' href={`/api/boards/${props.boardId}?download=1`}>
    <span className='MenuSideBar-icons'>
      <Icon type='download' />
    </span>
    Export Board
  </a>
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
      <span className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='square' />
        </span>
        Change Background
      </span>
      <span className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='filter' />
        </span>
        Filter Cards
      </span>
      <span className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='rocket' />
        </span>
        Power Ups
      </span>
      <span className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='sticky-note-o' />
        </span>
        Stickers
      </span>
      <Link onClick={props.showMore} className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='ellipsis-h' />
        </span>
        More
      </Link>
      <hr/>
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
      <span className='MenuSideBar-options'>
      <span className='MenuSideBar-icons'>
        <Icon type='archive' />
      </span>
        <DeleteBoardButton boardId={props.board.id}/>
      </span>
      <span className='MenuSideBar-options'>
        <DownloadBoardButton boardId={props.board.id}/>
      </span>
      <hr/>
      <span className='MenuSideBar-options'>
        <LeaveBoardButton boardId={props.board.id}/>
      </span>
    </div>
  </div>
}
