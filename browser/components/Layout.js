import React, { Component } from 'react'
import Navbar from './Navbar'
import './Layout.sass'

const Layout = ({className, children}) => {
  className = `Page Layout ${className}`
  return <div className={className}>
    <Navbar />
    <div className="Layout-content">
      {children}
    </div>
  </div>
}

export default Layout
