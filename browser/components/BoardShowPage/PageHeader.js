import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'
import PopoverMenuButton from '../PopoverMenuButton'
import BoardStar from '../BoardStar'
import './PageHeader.sass'

export default class PageHeader extends Component {
  render(){
    const { board, sideBarOpen, toggleSideBar, renameBoardDropdown } = this.props
    const className = `BoardShowPage-PageHeader-BoardStar BoardShowPage-PageHeader-BoardStar-${board.starred ? 'active' : 'inactive'}`

    return <div className="BoardShowPage-PageHeader">
      <PopoverMenuButton className="BoardShowPage-PageHeader-RenameBoardButton" type="invisible" popover={renameBoardDropdown}>
        <h1>{board.name}</h1>
      </PopoverMenuButton>
      <BoardStar className={className} board={board}/>
      <div className="flex-spacer" />
      <Link
        className="BoardShowPage-PageHeader-menuButton"
        onClick={toggleSideBar}
      >
        <Icon className="BoardShowPage-PageHeader-menuButton-icon" type="ellipsis-h" />
        {sideBarOpen ? 'Hide' : 'Show'} Menu
      </Link>
    </div>
  }
}
