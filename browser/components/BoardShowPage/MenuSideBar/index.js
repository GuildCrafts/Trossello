import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import MenuSideBarHeader from './MenuSideBarHeader'
import './index.sass'

// panes
import MainPane from './panes/MainPane'
import MorePane from './panes/MorePane'
import ActivityPane from './panes/ActivityPane'
import ChangeBackgroundPane from './panes/ChangeBackgroundPane'
import FilterCardsPane from './panes/FilterCardsPane'
import LabelsPane from './panes/LabelsPane'
import PowerUpsPane from './panes/PowerUpsPane'
import SettingsPane from './panes/SettingsPane'
import StickersPane from './panes/StickersPane'
import UnarchivePane from './panes/UnarchivePane'

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
      "Labels":             LabelsPane,
    }
    const PaneComponent = panesMap[paneName]

    return <div className="BoardShowPage-MenuSideBar">
      <MenuSideBarHeader
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
