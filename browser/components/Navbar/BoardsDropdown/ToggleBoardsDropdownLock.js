import React, { Component } from 'react'
import Button from '../../Button'
import commands from '../../../commands'

export default class ToggleBoardsDropdownLock extends Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.toggle = this.toggle.bind(this)
  }

  toggle(){
    const { user } = this.props
    commands.boardsDropdownToggle(user)
  }

  render(){
    const locked = this.props.user.boards_dropdown_lock
    return <Button
      onClick={this.toggle}
      className="Navbar-BoardsDropdown-Button"
      type="invisible"
    >
      {locked ? 'Don\'t keep this menu open.' : 'Always keep this menu open.'}
    </Button>
  }
}
