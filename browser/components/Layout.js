import React, { Component } from 'react'
import Navbar from './Navbar'
import './Layout.sass'

const Layout = (props) => {
  return <div {...props} className="Page Layout">
    <Navbar />
    <div className="Layout-content">
      {props.children}
    </div>
  </div>
}

export default Layout
