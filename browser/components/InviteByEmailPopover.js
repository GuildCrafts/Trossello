import React, { Component } from 'react'
import Form from './Form'
import Layout from './Layout'
import './InviteByEmailPopover.sass'
import Link from './Link'
import Icon from './Icon'
import Button from './Button'
import $ from 'jquery'
import boardStore from '../stores/boardStore'
import DialogBox from './DialogBox'

class InviteByEmailPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creatingInvite: false,
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount(){
    this.refs.email.focus()
  }

  onSubmit(event){
    event.preventDefault()
    const email = this.refs.email.value
    this.setState({creatingInvite: true})
    $.ajax({
      method: "POST",
      url: `/api/invites/${this.props.boardId}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({email}),
    }).then(_ => {
      this.setState({creatingInvite: false})
      this.props.onClose()
    })
  }

  render() {
    const closeLink = this.props.onClose ?
      <Link onClick={this.props.onClose}>
        <Icon type="times" />
      </Link> :
      null

    return <DialogBox className="InviteByEmailPopover" onClose={this.props.onClose} heading="Add Members">
      <Form onSubmit={this.onSubmit}>
        <input
          className='emailInput'
          type="email"
          ref="email"
          name='email'
          placeholder="e.g. burritos@trossello.com"
          disabled={this.state.creatingInvite}
        />
        <p className='InviteByEmailPopover-text'>
          Enter an email address to invite someone new to this board.
        </p>
        <Button
          type="primary"
          action="submit"
          disabled={this.state.creatingInvite}
        >{this.state.creatingInvite ? 'Saving…' : 'Invite'}</Button>
      </Form>
    </DialogBox>
  }
}

export default InviteByEmailPopover
