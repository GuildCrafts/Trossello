import React, { Component } from 'react'
import './Navbar.sass'
import PresentationalComponent from './PresentationalComponent'
import Link from './Link'
import Icon from './Icon'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'
import CreateBoardPopover from './CreateBoardPopover'
import ToggleComponent from './ToggleComponent'
import BoardsDropdown from './BoardsDropdown'

const Navbar = (props) => {
  const { auth } = props.state
  return auth.isAuthenticated ?
    <LoggedInNavbar auth={auth} /> :
    <LoggedOutNavbar />
}

const LoggedOutNavbar = (props) => {
  return <div className="Navbar">
    <div className="Navbar-links">
      <Link to="/">HOME</Link>
      <Link to="/">TOUR</Link>
      <Link to="/">BLOG</Link>
    </div>
    <div className="Navbar-links">
      <LoginButton>Login</LoginButton>
    </div>
  </div>
}

const LoggedInNavbar = ({auth}) => {
  return <div className="Navbar">
    <BoardsDropdown className="Navbar-button BoardButton" />
    <input type="text" className="Navbar-SearchInput" ></input>
    <div className="Navbar-BoardIndexButton">
      <a href="/">Trossello</a>
    </div>
    <CreateBoardButton className="Navbar-button">
      <Icon type="plus" />
    </CreateBoardButton>
    <button className="Navbar-button Navbar-AvatarButton">
      <img src={auth.user.avatar_url} />
      <span>{auth.user.name}</span>
    </button>
    <LogoutButton className="Navbar-button">Logout</LogoutButton>
    <button className="Navbar-button AlertButton">
      <Icon type="bell" />
    </button>
  </div>
}

export default PresentationalComponent(Navbar)


class CreateBoardButton extends ToggleComponent {
  render(){
    return <div className="CreateBoardButton">
      <button {...this.props} onClick={this.toggle}>
        {this.props.children}
      </button>
      {this.state.open ? <CreateBoardPopover /> : null}
    </div>
  }
}
