import React, { Component } from 'react'
import Navbar from './Navbar'
import './Layout.sass'

const Layout = (props) => {
  const className = `Page Layout ${props.className}`
  return <div {...props} className={className}>
    <Navbar />
    <div className="Layout-content">
      {props.children}
    </div>
  </div>
}

export default Layout
