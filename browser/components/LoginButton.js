import React, { Component } from 'react'
import Link from './Link'

export default (props) => {
  return <Link to="/login" {...props}>{props.children}</Link>
}

