import React, { Component } from 'react'
import './LoginPage.sass'
import PresentationalComponent from './PresentationalComponent'
import LoginOrSignupViaGithubButton from './LoginOrSignupViaGithubButton'

const LoginPage = (props) => {
  console.log(props)
  return <div className="Page LoginPage">
    <h1>Trossello</h1>
    <LoginOrSignupViaGithubButton />
  </div>
}

export default PresentationalComponent(LoginPage)
