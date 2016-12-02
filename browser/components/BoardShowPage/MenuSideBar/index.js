import './index.sass'
import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import $ from 'jquery'
import Icon from '../../Icon'
import Link from '../../Link'
import Button from '../../Button'
import ToggleComponent from '../../ToggleComponent'
import Card from '../Card'
import List from '../List'
import Unarchive from './Unarchive'
import InviteByEmailPopover from '../../InviteByEmailPopover'

// panes
import { ActivityPanel, MainPaneActivity }  from './ActivityPanel'
import ChangeBackground from './ChangeBackground'
import DeleteBoardButton from './DeleteBoardButton'
import LeaveBoardButton from './LeaveBoardButton'

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
    this.goBackIfUserHitsEscape = this.goBackIfUserHitsEscape.bind(this)
  }

  componentDidMount(){
    document.addEventListener('keydown', this.goBackIfUserHitsEscape, false)
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.goBackIfUserHitsEscape)
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

  goBackIfUserHitsEscape(event) {
    if (event.key === "Escape") {
      event.preventDefault()
      this.goBack()
    }
  }

  render() {
    const { board } = this.props
    const paneName = this.state.panes[0] || 'Main'
    const panesMap = {
      "Main":               MainPane,
      "Change Background":  ChangeBackgroundPane,
      "Settings":           SettingsPane,
      "Filter Cards":       FilterCardsPane,
      "Unarchive":          UnarchivePane,
      "Power-Ups":          PowerUpsPane,
      "Stickers":           StickersPane,
      "Activity":           ActivityPane,
      "More":               MorePane,
      "Settings":           SettingsPane,
      "Labels":             LabelsPane,
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
    <Link className="BoardShowPage-MenuSideBar-Header-link" onClick={props.goBack}><Icon type="arrow-left" /></Link>
  return <div className="BoardShowPage-MenuSideBar-Header">
    {goBackLink}
    <span>{props.panes[0] || 'Menu'}</span>
    <Link onClick={props.onClose} className="BoardShowPage-MenuSideBar-Header-link">
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

const boardMembers = board => board.users.map( user =>
  <BoardMember key={user.id} user={user} />
)

const BoardMember = (props) => {
  const { user } = props
  return <span className='BoardShowPage-MenuSideBar-member'>
    <img src={user.avatar_url} className='BoardShowPage-MenuSideBar-member-img' />
  </span>
}

const BoardMembersArea = (props) => {
  const { board } = props
  return <div>
    <div className='BoardShowPage-MenuSideBar-members'>
      { boardMembers( board ) }
    </div>
    <InviteByEmailButton boardId={board.id}/>
    </div>
}

const MenuPaneLink = (props) => {
  const { onClick, iconType, children } = props
  return <Link
      className='BoardShowPage-MenuSideBar-options'
      onClick={onClick}
    >
      <Icon type={iconType} />
      {children}
    </Link>
}

const MainPane = ({board, onClose, gotoPane}) => {
  return <Pane name="Main">
    <BoardMembersArea board={board} />
    <div className="BoardShowPage-MenuSideBar-separator" />
    <MenuPaneLink
      onClick={gotoPane('Change Background')}
      iconType='square'
    >
      Change Background
    </MenuPaneLink>
    <MenuPaneLink
      onClick={gotoPane('Filter Cards')}
      iconType='filter'
    >
      Filter Cards
    </MenuPaneLink>
    <MenuPaneLink
      onClick={gotoPane('Power-Ups')}
      iconType='rocket'
    >
      Power-Ups
    </MenuPaneLink>
    <MenuPaneLink
      onClick={gotoPane('Stickers')}
      iconType='sticky-note'
    >
      Stickers
    </MenuPaneLink>
    <MenuPaneLink
      onClick={gotoPane('More')}
      iconType='ellipsis-h'
    >
      More
    </MenuPaneLink>
    <div className="BoardShowPage-MenuSideBar-separator" />
    <MenuPaneLink
      onClick={gotoPane('Activity')}
      iconType='list'
    >
      Activity
    </MenuPaneLink>
    <MainPaneActivity board={board} openPanel={gotoPane('Activity')}/>
  </Pane>
}

const ChangeBackgroundPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="ChangeBackground">
    <ChangeBackground
      board={board}
    />
  </Pane>


const FilterCardsPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="FilterCards">
    <div>Filter Cards Panel</div>
  </Pane>


const PowerUpsPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="PowerUps">
    <div>Power-Ups Panel</div>
  </Pane>


const StickersPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="Stickers">
    <div>Stickers Panel</div>
  </Pane>


const ActivityPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="Activity">
    <ActivityPanel board={board}/>
  </Pane>

class MorePane extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    this.refs.input.focus()
    this.refs.input.select()
  }


  render() {
    const { board, onClose, gotoPane, goBack } = this.props
    const url = window.location.href

    return <Pane name="More">
      <MenuPaneLink
        onClick={gotoPane('Settings')}
        iconType='gear'
      >
        Settings
      </MenuPaneLink>
      <MenuPaneLink
        onClick={gotoPane('Labels')}
        iconType='tag'
      >
        Labels
      </MenuPaneLink>
      <MenuPaneLink
        onClick={gotoPane('Unarchive')}
        iconType='archive'
      >
        Unarchive
      </MenuPaneLink>
      <div className="BoardShowPage-MenuSideBar-separator" />
      <DownloadBoardButton className='BoardShowPage-MenuSideBar-options' boardId={board.id}/>
      <div className="BoardShowPage-MenuSideBar-separator" />
      <LeaveBoardButton className='BoardShowPage-MenuSideBar-options' boardId={board.id}/>
      <div className="BoardShowPage-MenuSideBar-separator" />
      <form className="BoardShowPage-MenuSideBar-form" >
        <label>Link to this board:</label>
        <input type="text" ref='input' readOnly value={url} ></input>
      </form>
    </Pane>
  }
}

const SettingsPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="Settings">
    <div>Settings Label TBD</div>
  </Pane>


const LabelsPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="Labels">
    <div>Labels Panel</div>
  </Pane>


const DownloadBoardButton = (props) => {
  return <a
    className="BoardShowPage-MenuSideBar-options"
    href={`/api/boards/${props.boardId}?download=1`}
  >
    <Icon type='download' />
    Export Board
  </a>
}

const UnarchivePane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="Labels">
    <Unarchive board={board} />
  </Pane>


const unarchiveRecord = (event, resource, id) => {
  event.preventDefault()
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
  return <Link
    onClick={onClick}
    className={className}>
    Unarchive List
  </Link>
}

const UnarchiveCardButton = (props) => {
  const className = `BoardShowPage-ArchiveListButton ${props.className||''}`
  const onClick = (event) => {
    unarchiveRecord(event, 'cards', props.card.id)
  }
  return <Link
    onClick={onClick}
    className={className}>
    Unarchive Card
  </Link>
}

class InviteByEmailButton extends ToggleComponent {

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
