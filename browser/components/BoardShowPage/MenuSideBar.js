import React, { Component } from 'react'
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
  return <div className='MenuSideBar'>
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
      <button className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='square' />
        </span>
        Change Background
      </button>
      <button className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='filter' />
        </span>
        Filter Cards
      </button>
      <button className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='rocket' />
        </span>
        Power Ups
      </button>
      <button className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='sticky-note-o' />
        </span>
        Stickers
      </button>
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
  return <div className='MenuSideBar'>
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
      <DownloadBoardButton className='MenuSideBar-options' boardId={props.board.id}/>
      <hr/>
      <LeaveBoardButton className='MenuSideBar-options' boardId={props.board.id}/>
    </div>
  </div>
}
