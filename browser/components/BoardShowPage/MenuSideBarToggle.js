import React, { Component } from 'react'
import $ from 'jquery'
import ToggleComponent from '../ToggleComponent'
import MenuSideBar from './MenuSideBar'
import Link from '../Link'
import './MenuSideBar'



export default class MenuSideBarToggle extends ToggleComponent {
  static propTypes = {
    board: React.PropTypes.object.isRequired,
  }
  render(){
    const showSideBar = this.state.open ?
      <MenuSideBar board={this.props.board} onClose={this.close} /> : null

    return <div>
      <Link className="MenuSideBar-Toggle" onClick={this.toggle}>Menu</Link>
      {showSideBar}
    </div>


  }
}
