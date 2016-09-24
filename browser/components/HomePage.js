import React, { Component } from 'react'
import PresentationalComponent from './PresentationalComponent'
import LoggedInHomepage from './LoggedInHomepage'
import LoggedOutHomepage from './LoggedOutHomepage'

const HomePage = (props) => {
  const { auth } = props.state

  return auth.isAuthenticated ?
    <LoggedInHomepage auth={auth}/> :
    <LoggedOutHomepage />
}

export default PresentationalComponent(HomePage)
