import React, { Component } from 'react'
import './Navbar.sass'
import Form from './Form'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'
import CreateBoardPopover from './CreateBoardPopover'
import ToggleComponent from './ToggleComponent'
import BoardsDropdown from './BoardsDropdown'
import CardSearchForm from './CardSearchForm'
import PopoverMenuButton from './PopoverMenuButton'

export default class Navbar extends Component {

  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }

  render(){
    const { session } = this.context
    const createBoardPopover = <CreateBoardPopover />
    return <div className="Navbar">
      <BoardsDropdown className="Navbar-button BoardButton" />
      <CardSearchForm className="Navbar-Search" />
      <div className="Navbar-BoardIndexButton">
        <Link to="/">Trossello</Link>
      </div>
      <PopoverMenuButton
        className="Navbar-CreateBoardButton"
        type={false}
        buttonClassName="Navbar-button"
        popover={createBoardPopover}
      >
        <Icon type="plus" />
      </PopoverMenuButton>
      <button className="Navbar-button Navbar-AvatarButton">
        <img src={session.user.avatar_url} />
        <span>{session.user.name}</span>
      </button>
      <LogoutButton className="Navbar-button">Logout</LogoutButton>
      <button className="Navbar-button AlertButton">
        <Icon type="bell" />
      </button>
    </div>
  }
}
