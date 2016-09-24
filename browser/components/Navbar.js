import React from 'react'
import './Navbar.sass'
import PresentationalComponent from './PresentationalComponent'
import Link from './Link'
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

const LoggedInNavbar = ({ auth }) => {
  return <div className="Navbar">
    <div className="Navbar-links">
      <Link to="/boards">Boards</Link>
    </div>
    <div className="Navbar-links">
      <div>{auth.user.name}</div>
      <LogoutButton>Logout</LogoutButton>
    </div>
  </div>
}


export default PresentationalComponent(Navbar)
