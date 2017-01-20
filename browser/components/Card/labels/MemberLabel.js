import React, { Component } from 'react'
import Avatar from '../../Avatar'
import Link from '../../Link'
import ToggleComponent from '../../ToggleComponent'
import MemberLabelPopover from './MemberLabelPopover'

export default class MemberLabel extends ToggleComponent {

  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
  }

  render() {
    const { board, card, user } = this.props
    const cardUserPopover = this.state.open
      ? <MemberLabelPopover card={card} board={board}
        user={user} onClose={this.close} />
      : null

    return <span className="Card-MemberLabel">
      <Link onClick={this.toggle}>
        <Avatar src={user.avatar_url} />
      </Link>
      {cardUserPopover}
    </span>
  }
}
