import React, { Component } from 'react'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import LogoutButton from '../LogoutButton'
import ToggleComponent from '../ToggleComponent'
import PopoverMenuButton from '../PopoverMenuButton'
import Button from '../Button'
import CreateBoardPopover from './CreateBoardPopover'
import CardSearchForm from './CardSearchForm'
import BoardsDropdown from './BoardsDropdown'
import './index.sass'

export default class Navbar extends Component {

  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }

  render(){
    const { user } = this.context.session
    const createBoardPopover = <CreateBoardPopover />
    const boardsDropdownButton = user.boards_dropdown_lock ?
      null :
      <BoardsDropdownButton className="Navbar-button BoardButton" />
    const styleguideLink = ( process.env.NODE_ENV === 'development' ) ?
        <Button className="Navbar-button" type={'navbar'} href="/styleguide" >
          <Icon type="paint-brush" />
        </Button>: null

    return <div className="Navbar">
      {boardsDropdownButton}
      <CardSearchForm className="Navbar-Search" />
      <div className="Navbar-BoardIndexButton">
        <Link to="/">Trossello</Link>
      </div>
      <PopoverMenuButton
        className="Navbar-CreateBoardButton"
        type={false}
        buttonClassName="Navbar-button"
        popover={createBoardPopover}
      >
        <Icon type="plus" />
      </PopoverMenuButton>
      <button className="Navbar-button Navbar-AvatarButton">
        <img src={user.avatar_url} />
        <span>{user.name}</span>
      </button>
      <LogoutButton className="Navbar-button">Logout</LogoutButton>
      {styleguideLink}
      <button className="Navbar-button AlertButton">
        <Icon type="bell" />
      </button>
    </div>
  }
}

class BoardsDropdownButton extends ToggleComponent {
  render() {
    const boardsdropdown = this.state.open ?
      <BoardsDropdown ref="toggle" boards={this.props.boards} onBoardClick={this.close} /> :
      null
    return <div className="BoardsDropdownButton" >
      <button ref="button" className={this.props.className} onClick={this.toggle}>Boards</button>
      {boardsdropdown}
    </div>
  }
}
