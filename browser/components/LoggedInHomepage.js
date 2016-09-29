import React, { Component } from 'react'
import Layout from './Layout'

const LoggedInHomepage = (props) => {
  const { auth } = props
  return <Layout className="LoggedInHomepage">
    <h1>Welcome back {auth.user.name}</h1>
  </Layout>
}

export default LoggedInHomepage


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

  // const greeting = auth.isAuthenticated ?
  //   <h3>Welcome back {auth.user.name}</h3> :
  //   <h3>Greetings Human!</h3>
  // return <Layout className="HomePage">
  //   <h1>Trossello</h1>
  //   {greeting}
  // </Layout>
