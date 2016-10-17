import React, { Component } from 'react'
import Form from './Form'
import Layout from './Layout'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import boardStore from '../stores/boardStore'
import InviteByEmail from './InviteByEmail'

class InviteByEmailButton extends Component{

  constructor(props) {
    super(props);
  }

  onSubmit(event){
    event.preventDefault()
    alert('this worked')
  }



  render() {
    return <div> <input type="email"/>
    <button type="submit" value="Invite"/> </div>
  }
}

export default InviteByEmailButton
