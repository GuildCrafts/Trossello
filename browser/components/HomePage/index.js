import React, { Component } from 'react'
import LoggedInHomepage from './LoggedInHomepage'
import LoggedOutHomepage from './LoggedOutHomepage'

const HomePage = (props) => {
  const { session } = props
  return session && session.isAuthenticated ?
    <LoggedInHomepage auth={session}/> :
    <LoggedOutHomepage />
}

export default HomePage
