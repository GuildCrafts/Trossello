import React, { Component } from 'react'
import ContainerComponent from './ContainerComponent'
import { browserHistory } from 'react-router';

// Triggered somewhere

const LoginOrSignupViaGithubButton = (actions, props) => {
  const onClick = (event) => {
    event.preventDefault()
    actions.login()
    browserHistory.push('/');
  }
  return <a href="" {...props} onClick={onClick}>Login Or Signup Via GitHub</a>
}


export default ContainerComponent(LoginOrSignupViaGithubButton)
