import React, { Component } from 'react'
import Navbar from './Navbar'
import BoardsDropdown from './Navbar/BoardsDropdown'
import setFaviconColor from '../setFaviconColor'
import './Layout.sass'
const DEFAULT_BACKGROUND_COLOR = '#0079BF'

class Layout extends Component {
  static propTypes = {
    faviconColor: React.PropTypes.string.isRequired,
  }

  static defaultProps = {
    faviconColor: '#0079BF',
  }

  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }

  render(){
    const className = `Page Layout ${this.props.className}`
    const boardsDropdown = this.context.session.user.boards_dropdown_lock ?
      <BoardsDropdown ref="toggle" /> :
      null
    return <div style={this.props.style} className={className}>
      {boardsDropdown}
      <div className="Layout-container">
        <Navbar />
        <div className="Layout-content">
          {this.props.children}
        </div>
      </div>
    </div>
  }

  componentDidUpdate(){
    setFaviconColor( this.props.faviconColor );
  }
}

export default Layout
