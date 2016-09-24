import React, { Component } from 'react'

import Navbar from './Navbar'
const Layout = ({children}) => {
  return <div className="Layout">
    <Navbar />
    {children}
  </div>
}

export default Layout
