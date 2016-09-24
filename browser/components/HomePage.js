import React, { Component } from 'react'
import PresentationalComponent from './PresentationalComponent'
import Layout from './Layout'

const HomePage = (props) => {
  const { auth } = props.state
  const greeting = auth.isAuthenticated ?
    <h3>Welcome back {auth.user.name}</h3> :
    <h3>Greetings Human!</h3>
  return <Layout className="HomePage">
    <h1>Trossello</h1>
    {greeting}
  </Layout>
}

export default PresentationalComponent(HomePage)
