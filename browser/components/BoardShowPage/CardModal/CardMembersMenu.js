import React, { Component } from 'react'
import DialogBox from '../../DialogBox'
import Link from '../../Link'
import Avatar from '../../Avatar'
import Icon from '../../Icon'
import commands from '../../../commands'
import './CardMembersMenu.sass'

export default class CardMembersMenu extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      boardUsers: this.props.board.users,
      cardId: this.props.card.id,
    }
  }

  componentDidMount() {
    this.refs.searchMembers.focus()
  }

  addUserToCard(userId, event) {
    const { card, board } = this.props
    commands.addUserToCard(userId, card.id, board.id)
  }

  removeCardUser(userId, event) {
    const { card, board } = this.props
    commands.removeUserFromCard(userId, card.id, board.id)
  }

  render() {
    const { card, board } = this.props
    const boardUserImages = board.users.map( user => {
      const isMember = card.user_ids.includes(user.id)
      const onClick = isMember
        ? this.removeCardUser.bind(this, user.id)
        : this.addUserToCard.bind(this, user.id)

      return <UserAvatar
        key={user.id}
        user={user}
        onClick={onClick}
        isMember={isMember}
      />
    })

    return <DialogBox onClose={this.props.onClose}
      heading='Members'
      className='BoardShowPage-CardModal-CardMembersMenu'
    >
      <div className='BoardShowPage-CardModal-CardMembersMenu-content'>
        <input ref='searchMembers'
          name='searchMembers'
          placeholder='Search Member'
          className='BoardShowPage-CardModal-CardMembersMenu-search'
        />
        <div className='BoardShowPage-CardModal-CardMembersMenu-users'>
          <div className='BoardShowPage-CardModal-CardMembersMenu-users-header'>
            Board Members
          </div>
          <DialogBox.Divider />
          <div className='BoardShowPage-CardModal-CardMembersMenu-users-images'>
            {boardUserImages}
          </div>
        </div>
      </div>
    </DialogBox>
  }
}

const UserAvatar = (props) => {
  const { user, onClick, isMember } = props
  const checkmark = isMember
    ? <Icon type="check-square" className="BoardShowPage-CardModal-CardMembersMenu-Users-images-User-checkmark" />
    : null

  return <Link onClick={onClick} className='BoardShowPage-CardModal-CardMembersMenu-Users-images-User-avatar'>
    <Avatar src={user.avatar_url} />
    {checkmark}
  </Link>
}
