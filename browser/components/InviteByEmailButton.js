import React, { Component } from 'react'
import Form from './Form'
import Layout from './Layout'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import './InviteByEmailButton.sass'
import boardStore from '../stores/boardStore'
import InviteByEmail from './InviteByEmail'
import ToggleComponent from './ToggleComponent'

class InviteByEmailButton extends ToggleComponent {
  render(){
    return <div ref="root" >
      <button className="InviteByEmail-button InviteByEmail-DeleteButton" onClick={this.toggle}>
        Invite By Email
      </button>
      {this.state.open ?
        <InviteByEmail onClose={this.close} boardId={this.props.boardId} /> :
        null
      }
    </div>
  }
}

export default InviteByEmailButton
