import React from 'react'
import ToggleComponent from '../../ToggleComponent'
import Button from '../../Button'
import Icon from '../../Icon'
import InviteByEmailPopover from './InviteByEmailPopover'

export default class InviteByEmailButton extends ToggleComponent {

  constructor(props){
    super(props)
  }

  render(){
    const inviteByEmail = this.state.open ?
      <InviteByEmailPopover onClose={this.close} boardId={this.props.boardId} /> :
      null

    return <span ref="root">
      <Button className="BoardShowPage-MenuSideBar-InviteByEmailButton" onClick={this.toggle}>
        <Icon type='user-plus' />
        Add Members...
      </Button>
      {inviteByEmail}
    </span>
  }
}
