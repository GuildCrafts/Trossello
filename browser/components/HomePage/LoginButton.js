import React, { Component } from 'react'
import Link from '../Link'

export default (props) => {
  return <a className="LoggedOutHomePage-LoginButton" href="/login_via_github" {...props}>{props.children}</a>
}
