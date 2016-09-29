import React from 'react'
import './Navbar.sass'
import PresentationalComponent from './PresentationalComponent'
import Link from './Link'
import Icon from './Icon'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'

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
    <button className="Navbar-button BoardButton">Board</button>
    <input type="text" className="Navbar-SearchInput" ></input>
    <div className="Navbar-BoardIndexButton">
      <a href="/">Trossello</a>
    </div>
    <button className="Navbar-button CreateBoardButton">
      <Icon type="plus" />
    </button>
    <button className="Navbar-button Navbar-AvatarButton">
      <img src={auth.user.avatar_url} />
      <span>{auth.user.name}</span>
    </button>
    <button className="Navbar-button AlertButton">
      <Icon type="bell" />
    </button>
  </div>
}

export default PresentationalComponent(Navbar)
