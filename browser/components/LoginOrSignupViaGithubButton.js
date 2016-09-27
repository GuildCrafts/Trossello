import React, { Component } from 'react'
import ContainerComponent from './ContainerComponent'
import { browserHistory } from 'react-router';

// Triggered somewhere

const LoginOrSignupViaGithubButton = (actions, props) => {
  return <a href="/login_via_github" {...props}>Login Or Signup Via GitHub</a>
}


export default ContainerComponent(LoginOrSignupViaGithubButton)
