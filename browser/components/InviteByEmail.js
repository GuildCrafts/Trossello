import React, { Component } from 'react'
import Form from './Form'
import Layout from './Layout'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import boardStore from '../stores/boardStore'

class InviteByEmail extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit(){
    alert('this worked')
  }


  render() {
    return <div class="InviteByEmailForm">
      <input type="email" placeholder="john.doe@example.com" />
      <input type="submit" value="Invite" />
    </div>  

  }
}

export default InviteByEmail
