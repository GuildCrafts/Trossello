import React, { Component } from 'react'
import Form from './Form'
import Layout from './Layout'
import './InviteByEmail.sass'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import boardStore from '../stores/boardStore'

class InviteByEmail extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount(){
    this.refs.email.focus()
  }

  reset(){
    if (this.refs.email) this.refs.email.value = ''
  }

  onSubmit(event){
    event.preventDefault()
    const email = this.refs.email.value
    $.ajax({
      method: "POST",
      url: `/api/invites/${this.props.boardId}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({email}),
    })
  }

  render() {
    const closeLink = this.props.onClose ?
      <Link onClick={this.props.onClose}>
        <Icon type="times" />
      </Link> :
      null

    return <div className="InviteByEmail">
      <div className="InviteByEmail-header">
        Invite to Board With Email
        {closeLink}
      </div>
      <Form onSubmit={this.onSubmit}>
        <label>
          <div className="label">Email</div>
          <input className='emailInput' type="email" ref="email" name='email' placeholder="john.doe@example.com" />
        </label>
        <input type="submit" value="Invite"/>
      </Form >
    </div>
  }
}

export default InviteByEmail
