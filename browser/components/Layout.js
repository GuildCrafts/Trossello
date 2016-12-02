import React, { Component } from 'react'
import Navbar from './Navbar'
import BoardsDropdown from './BoardsDropdown'
import './Layout.sass'

class Layout extends Component {
  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }

  render(){
    const className = `Page Layout ${this.props.className}`
    const boardsDropdown = this.context.session.user.boards_dropdown_lock ?
      <BoardsDropdown ref="toggle" /> :
      null
    return <div {...this.props} className={className}>
      {boardsDropdown}
      <div className="Layout-container">
        <Navbar />
        <div className="Layout-content">
          {this.props.children}
        </div>
      </div>
    </div>
  }
}

export default Layout
