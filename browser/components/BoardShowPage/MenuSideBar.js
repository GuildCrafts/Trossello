import React, { Component } from 'react'
import Icon from '../Icon'
import Link from '../Link'
import Button from '../Button'
import ToggleComponent from '../ToggleComponent'
import DeleteBoardButton from './DeleteBoardButton'
import LeaveBoardButton from './LeaveBoardButton'
import ChangeBackground from './ChangeBackground'
import './MenuSideBar.sass'
import Card from './Card'
import List from './List'
import $ from 'jquery'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import Unarchive from './Unarchive'

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

const MainPane = ({board, onClose, gotoPane}) => {
  return <Pane name="Main">
    <div className='BoardShowPage-MenuSideBar-members'>
      { boardMembers( board ) }
    </div>
    <InviteByEmailButton boardId={board.id}/>
    <div className="BoardShowPage-MenuSideBar-separator" />
    <div>
      <Link
        className='BoardShowPage-MenuSideBar-options'
        type="invisible"
        onClick={gotoPane('Change Background')}
      >
        <span className='BoardShowPage-MenuSideBar-icons'>
          <Icon type='square' />
        </span>
        Change Background
      </Link>
    </div>
    <div>
      <Link
        className='BoardShowPage-MenuSideBar-options'
        onClick={gotoPane('Filter Cards')}
      >
        <span className='BoardShowPage-MenuSideBar-icons'>
          <Icon type='filter' />
        </span>
        Filter Cards
      </Link>
    </div>
    <div>
      <Link
        className='BoardShowPage-MenuSideBar-options'
        onClick={gotoPane('Power-Ups')}
      >
        <span className='BoardShowPage-MenuSideBar-icons'>
          <Icon type='rocket' />
        </span>
        Power-Ups
      </Link>
    </div>
    <div>
      <Link
        className='BoardShowPage-MenuSideBar-options'
        onClick={gotoPane('Stickers')}
      >
        <span className='BoardShowPage-MenuSideBar-icons'>
          <Icon type='sticky-note' />
        </span>
        Stickers
      </Link>
    </div>
    <div>
      <Link
        className='BoardShowPage-MenuSideBar-options'
        onClick={gotoPane('More')}
      >
        <span className='BoardShowPage-MenuSideBar-icons'>
          <Icon type='ellipsis-h' />
        </span>
        More
      </Link>
    </div>
    <div className="BoardShowPage-MenuSideBar-separator" />
    <div>
      <Link
        className='BoardShowPage-MenuSideBar-options'
        onClick={gotoPane('Activity')}
      >
        <span className='BoardShowPage-MenuSideBar-icons'>
          <Icon type='list' />
        </span>
        Activity
      </Link>
    </div>
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
    <div>Activity Panel</div>
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
      <div>
        <Link
          className='BoardShowPage-MenuSideBar-options'
          onClick={gotoPane('Settings')}
        >
          <span className='BoardShowPage-MenuSideBar-icons'>
            <Icon type='gear' />
          </span>
          Settings
        </Link>
      </div>
      <div>
        <Link
          className='BoardShowPage-MenuSideBar-options'
          onClick={gotoPane('Labels')}
        >
          <span className='BoardShowPage-MenuSideBar-icons'>
            <Icon type='tag' />
          </span>
          Labels
        </Link>
      </div>
      <div>
        <Link
          className='BoardShowPage-MenuSideBar-options'
          onClick={gotoPane('Unarchive')}
        >
          <span className='BoardShowPage-MenuSideBar-icons'>
            <Icon type='archive' />
          </span>
          Unarchive
        </Link>
      </div>
      <div className="BoardShowPage-MenuSideBar-separator" />
      <div>
        <DownloadBoardButton className='BoardShowPage-MenuSideBar-options' boardId={board.id}/>
      </div>
      <div className="BoardShowPage-MenuSideBar-separator" />
      <div>
        <LeaveBoardButton className='BoardShowPage-MenuSideBar-options BordShowPage-MenuSideBar-options-delete' boardId={board.id}/>
      </div>
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
  return <Button
    type="invisible"
    className="BoardShowPage-MenuSideBar-options"
    href={`/api/boards/${props.boardId}?download=1`}
  >
    <span className='BoardShowPage-MenuSideBar-icons'>
      <Icon type='download' />
    </span>
    Export Board
  </Button>
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
    const inviteByEmail = null
    // const inviteByEmail = this.state.open ?
    //   <InviteByEmailPopover onClose={this.close} boardId={this.props.boardId} /> :
    //   null

    return <span ref="root" className="BoardShowPage-MenuSideBar-InviteByEmailButton">
      <Button onClick={this.toggle}>
        <Icon type='user-plus' />
        Add Members
      </Button>
      {inviteByEmail}
    </span>
  }
}
