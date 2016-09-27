import React, { Component } from 'react'
import './LoginPage.sass'
import PresentationalComponent from './PresentationalComponent'
import LoginOrSignupViaGithubButton from './LoginOrSignupViaGithubButton'

const LoginPage = (props) => {
  console.log(props)
  return <div className="Page LoginPage">
    <div className="LoginPage-content">
      <h1>Log in to Trossello</h1>
      <LoginForm />
  </div>
  </div>
}

export default PresentationalComponent(LoginPage)


const LoginForm = (props) => {
  return <form>
    <label>
      <div className="form-label">Email</div>
      <input className="form-input" type="email" name="email" placeholder="e.g., 1bdi@planetexpress.nnyc"></input>
    </label>
    <label>
      <div className="form-label">Password</div>
      <input className="form-input" type="password" name="password" placeholder="e.g., ••••••••••••"></input>
    </label>
    <div>
      <input type="submit" value="Log In"></input>
    </div>
  </form>
}
