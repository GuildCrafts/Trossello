import React, { Component } from 'react'
import './Navbar.sass'
import Form from './Form'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'
import CreateBoardPopover from './CreateBoardPopover'
import ToggleComponent from './ToggleComponent'
import BoardsDropdown from './BoardsDropdown'
import CardSearchForm from './CardSearchForm'

export default class Navbar extends Component {

  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }



  render(){
    const { session } = this.context
    return <div className="Navbar">
      <BoardsDropdown className="Navbar-button BoardButton" />
      <CardSearchForm className="Navbar-Search" />
      <div className="Navbar-BoardIndexButton">
        <Link to="/">Trossello</Link>
      </div>
      <CreateBoardButton className="Navbar-button">
        <Icon type="plus" />
      </CreateBoardButton>
      <button className="Navbar-button Navbar-AvatarButton">
        <img src={session.user.avatar_url} />
        <span>{session.user.name}</span>
      </button>
      <LogoutButton className="Navbar-button">Logout</LogoutButton>
      <button className="Navbar-button AlertButton">
        <Icon type="bell" />
      </button>

    </div>
  }
}



class CreateBoardButton extends ToggleComponent {
  render(){
    return <div className="CreateBoardButton">
      <button {...this.props} onClick={this.toggle}>
        {this.props.children}
      </button>
      {this.state.open ?
        <CreateBoardPopover ref="toggle" onClose={this.close} /> :
        null
      }
    </div>
  }
}
