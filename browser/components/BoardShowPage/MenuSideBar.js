import React, { Component } from 'react'
import Icon from '../Icon'
import Link from '../Link'
import ToggleComponent from '../ToggleComponent'
import DeleteBoardButton from './DeleteBoardButton'
import LeaveBoardButton from './LeaveBoardButton'
import InviteByEmailButton from '../InviteByEmailButton'
import './MenuSideBar.sass'
import Card from './Card'

export default class MenuSideBar extends ToggleComponent {

  static PropTypes = {
    board: React.PropTypes.object.required
  }

  constructor(props){
    super(props)
    this.state = {
      showArchive: false,
      archivedItems: null,
    }
    this.showArchivedItems = this.showArchivedItems.bind(this)
    this.stopShowingArchivedItems = this.stopShowingArchivedItems.bind(this)
  }

  showArchivedItems(event) {
    event.preventDefault()
    this.setState({showArchive: true})
  }

  stopShowingArchivedItems(event) {
    event.preventDefault()
    this.setState({showArchive: false})
  }


  render(){
    const more = this.state.showArchive ?
        <ArchivedItems
          board={this.props.board}
          archivedItems={this.state.archivedItems}
          /> :
          <MenuSideBarMore
            board={this.props.board}
            closeMore={this.close}
            closeMenu={this.props.onClose}
            showArchive={this.showArchivedItems}
            />

    const content = this.state.open ?
      <div>{more}</div> :
      <MenuSideBarMain
        board={this.props.board}
        showMore={this.open}
        closeMenu={this.props.onClose}
      />


    return <div className="MenuSideBar">
      {content}
    </div>

  }
}

const DownloadBoardButton = (props) => {
  return <a className='MenuSideBar-options' href={`/api/boards/${props.boardId}?download=1`}>
    <span className='MenuSideBar-icons'>
      <Icon type='download' />
    </span>
    Export Board
  </a>
}

const MenuSideBarMain = (props) => {
  return <div className='MenuSideBar'>
    <div className="MenuSideBar-header" >
      Menu
      <Link className="MenuSideBar-cancel" onClick={props.closeMenu}>
        <Icon type="times" />
      </Link>
      <hr/>
    </div>
    <div className="MenuSideBar-members">
      <InviteByEmailButton boardId={props.board.id}/>
      <hr/>
    </div>
    <div className="MenuSideBar-buttons">
      <button className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='square' />
        </span>
        Change Background
      </button>
      <button className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='filter' />
        </span>
        Filter Cards
      </button>
      <button className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='rocket' />
        </span>
        Power Ups
      </button>
      <button className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='sticky-note-o' />
        </span>
        Stickers
      </button>
      <Link onClick={props.showMore} className='MenuSideBar-options'>
        <span className='MenuSideBar-icons'>
          <Icon type='ellipsis-h' />
        </span>
        More
      </Link>
      <hr/>
    </div>
  </div>
}

const MenuSideBarMore = (props) => {
  return <div className='MenuSideBar'>
    <div className="MenuSideBar-header" >
      More
      <Link className="MenuSideBar-backArrow" onClick={props.closeMore}>
        <Icon type="arrow-left" />
      </Link>
      <Link className="MenuSideBar-cancel" onClick={props.closeMenu}>
        <Icon type="times" />
      </Link>
      <hr/>
    </div>
    <div className="MenuSideBar-buttons">
      <DownloadBoardButton className='MenuSideBar-options' boardId={props.board.id}/>
      <Link onClick={props.showArchive} className='MenuSideBar-options'>
        <ViewArchiveButton boardId={props.board.id}/>
      </Link>
      <hr/>
      <LeaveBoardButton className='MenuSideBar-options' boardId={props.board.id}/>
    </div>
  </div>
}
const ViewArchiveButton = (props) => {
  return <div className='MenuSideBar-options' >
    <span className='MenuSideBar-icons'>
      <Icon type='download' />
    </span>
    Archived Cards and Lists
  </div>
}
class ArchivedItems extends Component {
  render() {
    const { board, cards } = this.props
    const archivedCards = board.cards.map(card => {
      if(card.archived === true) {
        return <Card
          editable={false}
          archivable={false}
          key={card.id}
          card={card}
        />
      }
    })
    console.log(board)
    return <div className="MenuSideBar-ArchivedItems">{archivedCards}</div>
  }
}
