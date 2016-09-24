import React, { Component } from 'react'
import Navbar from './Navbar'
import './Layout.sass'

const Layout = ({children}) => {
  return <div className="Page Layout">
    <Navbar />
    <div className="Layout-content">
      {children}
    </div>
  </div>
}

export default Layout
