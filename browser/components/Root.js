import React, { Component } from 'react'
import { connect } from 'react-redux'
import Link from './Link'

const Root = (props) => {
  const { auth } = props
  // this.props
  return <div>
    <h1>App</h1>
    <pre>{JSON.stringify(auth, null, 4)}</pre>
    <ol>
      <li>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </li>
    </ol>
    {props.children}
  </div>
}


const mapStateToProps = (state) => ({auth: state.auth})

export default connect(mapStateToProps)(Root)
