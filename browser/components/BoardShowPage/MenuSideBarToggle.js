import React, { Component } from 'react'
import $ from 'jquery'
import Icon from '../Icon'
import Link from '../Link'
import ToggleComponent from '../ToggleComponent'
import MenuSideBar from './MenuSideBar'
import './MenuSideBar'



export default class MenuSideBarToggle extends ToggleComponent {
  static propTypes = {
    board: React.PropTypes.object.isRequired,
  }
  render(){
    const showSideBar = this.state.open ?
      <MenuSideBar board={this.props.board} onClose={this.close} /> : null

    return <div className='MenuSideBar-Toggle'>
      <Link onClick={this.toggle} className='MenuSideBar-Toggle'>
        <span className='MenuSideBar-icons'>
          <Icon type='ellipsis-h' />
        </span>
        Menu
      </Link>
      {showSideBar}
    </div>


  }
}
