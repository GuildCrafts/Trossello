import React, { Component } from 'react'
import Icon from '../Icon'
import Link from '../Link'
import Button from '../Button'
import ToggleComponent from '../ToggleComponent'
import DeleteBoardButton from './DeleteBoardButton'
import LeaveBoardButton from './LeaveBoardButton'
import InviteByEmailButton from '../InviteByEmailButton'
import './MenuSideBar.sass'
import Card from './Card'
import List from './List'
import $ from 'jquery'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

export default class MenuSideBar extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      panes: [],
      goingBack: false,
    }
    this.close = this.close.bind(this)
    this.gotoPane = this.gotoPane.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  close(event) {
    if (event) event.preventDefault()
    this.props.onClose()
  }

  gotoPane(pane) {
    return (event) => {
      if (event) event.preventDefault()
      this.setState({
        panes: [pane].concat(this.state.panes),
        goingBack: false,
      })
    }
  }

  goBack() {
    this.setState({
      panes: this.state.panes.slice(1),
      goingBack: true,
    })
  }

  render() {
    const { board } = this.props
    const paneName = this.state.panes[0] || 'Main'
    const panesMap = {
      "Main":              MainPane,
      "Change Background": ChangeBackgroundPane,
      "More":              MorePane,
      "Settings":          SettingsPane,
      "Filter Cards": FilterCardsPane,
      "Unarchive": UnarchivePane,
    }
    const PaneComponent = panesMap[paneName]
    return <div className="BoardShowPage-MenuSideBar">
      <Header
        panes={this.state.panes}
        goBack={this.goBack}
        onClose={this.close}
      />
      <ReactCSSTransitionGroup
        component="div"
        className="BoardShowPage-MenuSideBar-panes"
        transitionName={this.state.goingBack ? "leftIn" : "rightIn"}
        transitionEnterTimeout={200}
        transitionLeave={false}
      >
        <PaneComponent
          key={paneName}
          board={board}
          onClose={this.close}
          gotoPane={this.gotoPane}
          goBack={this.goBack}
        />
      </ReactCSSTransitionGroup>
    </div>
  }
}

const Header = (props) => {
  const goBackLink = props.panes.length === 0 ? null :
    <Link onClick={props.goBack}><Icon type="arrow-left" /></Link>
  return <div className="BoardShowPage-MenuSideBar-Header">
    {goBackLink}
    <span>{props.panes[0] || 'Menu'}</span>
    <Link onClick={props.onClose} className="BoardShowPage-MenuSideBar-close">
      <Icon type="times" />
    </Link>
  </div>
}

const Pane = (props) => {
  const className = `BoardShowPage-MenuSideBar-Pane BoardShowPage-MenuSideBar-${props.name}Pane`
  return <div className={className}>
    {props.children}
  </div>
}

const boardMembers = board => board.users.map( user => {
  console.log('userlog', user );
  return <BoardMember key={user.id} user={user} />
})

const MainPane = ({board, onClose, gotoPane}) => {
  return <Pane name="Main">
    <h1>MainPane</h1>
    <div className='BoardShowPage-MenuSideBar-members'>
      { boardMembers( board ) }
    </div>
    <div className="BoardShowPage-MenuSideBar-invite">
      <InviteByEmailButton boardId={board.id}/>
    </div>
    <div>
      <Button type="invisible" onClick={gotoPane('Change Background')}>
        Change Background
      </Button>
    </div>
    <div>
      <Button onClick={gotoPane('Filter Cards')}>
        Filter Cards
      </Button>
    </div>
    <div>
      <Button onClick={gotoPane('More')}>More</Button>
    </div>
  </Pane>
}

const ChangeBackgroundPane = ({board, onClose, gotoPane, goBack}) => {
  return <Pane name="ChangeBackground">
    <div>Change Background TBD</div>
  </Pane>
}

const FilterCardsPane = ({board, onClose, gotoPane, goBack}) => {
  return <Pane name="FilterCards">
    <div>Change Background</div>
  </Pane>
}

const MorePane = ({board, onClose, gotoPane, goBack}) => {
  return <Pane name="More">
    <Link onClick={gotoPane('Settings')}>Settings</Link>
    <div>
      <DownloadBoardButton className='BoardShowPage-MenuSideBar-options' boardId={board.id}/>
    </div>
    <div>
      <Button onClick={gotoPane('Unarchive')}>Unarchive</Button>
    </div>
    <div>
      <LeaveBoardButton className='BoardShowPage-MenuSideBar-options' boardId={board.id}/>
    </div>
  </Pane>
}

const SettingsPane = ({board, onClose, gotoPane, goBack}) => {
  return <Pane name="Settings">
    <div> settings TBD </div>
  </Pane>
}

const UnarchivePane = ({board, onClose, gotoPane, goBack}) => {
  const archivedListsAndCards = board.lists.map( list => {
    const cards = board.cards.filter( card => card.list_id === list.id)
    if( list.archived === true ) {
      return <div key={list.id} className="ArchivedItems-item ArchivedItems-list">
        <List
          archivable={ false }
          showOptions={ false }
          key={ list.id }
          board={ board }
          list={ list }
          cards={ cards }
        />
        <UnarchiveListButton
          className="BoardShowPage-MenuSideBar-ArchivedItems-UnarchiveButton"
          list={ list }
        />
      </div>
    } else {
      const cardArray = []
      for( let i = 0; i < cards.length; i++ ) {
        if( cards[i].archived === true ) {
          cardArray.push( <div
            key={ cards[i].id }
            className="BoardShowPage-MenuSideBar-ArchivedItems-item BoardShowPage-MenuSideBar-ArchivedItems-card"
          >
            <Card
              editable={ false }
              archivable={ false }
              key={ cards[i].id }
              card={ cards[i] }
            />
            <UnarchiveCardButton
              className="BoardShowPage-MenuSideBar-ArchivedItems-UnarchiveButton" card={cards[i]}
            />
          </div> )
        }
      }
      return cardArray
    }
  })
  return <Pane name="Unarchive">
    <div> Unarchive Things TBD </div>
    <div className="BoardShowPage-MenuSideBar-ArchivedItems">
      {archivedListsAndCards}
    </div>
  </Pane>
}


const DownloadBoardButton = (props) => {
  return <a className='BoardShowPage-MenuSideBar-options' href={`/api/boards/${props.boardId}?download=1`}>
    <span className='BoardShowPage-MenuSideBar-icons'>
      <Icon type='download' />
    </span>
    Export Board
  </a>
}

const BoardMember = (props) => {
  const { user } = props
  return <div className='BoardShowPage-MenuSideBar-member'>
    <img src={user.avatar_url} className='BoardShowPage-MenuSideBar-member-img' />
  </div>
}

const MenuSideBarMain = (props) => {
  // const boardMembers = props.board.users.map( user => {
  //   console.log('userlog', user );
  //   return <BoardMember key={user.id} user={user} />
  // })
  return <div className='MenuSideBar-show'>
    <div className="MenuSideBar-header" >
      Menu
      <Link className="MenuSideBar-cancel" onClick={props.closeMenu}>
        <Icon type="times" />
      </Link>
    </div>
    <div className='MenuSideBar-members'>
      { boardMembers }
    </div>
    <div className="MenuSideBar-invite">
      <InviteByEmailButton boardId={props.board.id}/>
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
    </div>
    <div className="MenuSideBar-buttons">
      <div className="MenuSideBar-buttons-box">
        <DownloadBoardButton className='MenuSideBar-options' boardId={props.board.id}/>
        <ViewArchiveButton onClick={props.showArchive} className='MenuSideBar-options' boardId={props.board.id}/>
      </div>
      <LeaveBoardButton className='MenuSideBar-options' boardId={props.board.id}/>
    </div>
  </div>
}
const ViewArchiveButton = (props) => {
  return <button onClick={props.onClick} className='MenuSideBar-options' >
    <span className='MenuSideBar-icons'>
      <Icon type='archive' />
    </span>
    Archived Items
  </button>
}
class ArchivedItems extends Component {

  render() {
    const { board, closeMenu } = this.props
    const archivedListsAndCards = board.lists.map(list => {
      const cards = board.cards.filter(card => card.list_id === list.id)
      if(list.archived) {
        return <div key={list.id} className="ArchivedItems-item ArchivedItems-list">
          <List
          archivable={false}
          showOptions={false}
          key={list.id}
          board={board}
          list={list}
          cards={cards}
          />
          <UnarchiveListButton className="MenuSideBar-ArchivedItems-UnarchiveButton" list={list}/>
        </div>
      } else {
        const cardArray = []
        for(var i=0; i<cards.length; i++){
          if(cards[i].archived===true){
            cardArray.push(<div key={cards[i].id} className="MenuSideBar-ArchivedItems-item MenuSideBar-ArchivedItems-card">
              <Card
              editable={false}
              archivable={false}
              key={cards[i].id}
              card={cards[i]}
              />
              <UnarchiveCardButton className="MenuSideBar-ArchivedItems-UnarchiveButton" card={cards[i]}/>
            </div>)
          }
        }
        return cardArray
      }
    })
    console.log(board)
    return <div className="MenuSideBar">
      <div className="MenuSideBar-header">
        <Link className="MenuSideBar-backArrow" onClick={this.props.closeArchived}>
          <Icon type="arrow-left" />
        </Link>
        Archived Items
        <Link className="MenuSideBar-cancel" onClick={closeMenu}>
          <Icon type="times" />
        </Link>
      </div>
      <div className="MenuSideBar-ArchivedItems">
      {archivedListsAndCards}
      </div>
    </div>
  }
}

const unarchiveRecord = (event, resource, id) => {
  event.preventDefault()
  console.log('unarchive Record has ->', resource, id)
  $.ajax({
    method: "POST",
    url: `/api/${resource}/${id}/unarchive`
  }).then(() => {
    boardStore.reload()
  })
}

const UnarchiveListButton = (props) => {
  const className = `BoardShowPage-ArchiveListButton ${props.className||''}`
  const onClick = (event) => {
    unarchiveRecord(event, 'lists', props.list.id)
  }
  console.log(props)
  return <Link
    onClick={onClick}
    className={className}>
    Unarchive Item
  </Link>
}

const UnarchiveCardButton = (props) => {
  const className = `BoardShowPage-ArchiveListButton ${props.className||''}`
  const onClick = (event) => {
    unarchiveRecord(event, 'cards', props.card.id)
  }
  console.log(props)
  return <Link
    onClick={onClick}
    className={className}>
    Unarchive Item
  </Link>
}
