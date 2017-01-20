import React, { Component } from 'react'

export default class ActionsMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pane: null,
    }
    this.goToPane = this.goToPane.bind(this)
  }

  goToPane(pane) {
    if (!(pane in this.props.panes))
      throw new Error(`cannot go to pane ${pane} it was not defined in panes prop`)
    return event => {
      if (event) event.preventDefault()
      this.setState({
        pane: pane
      })
    }
  }

  render(){
    const paneName = this.state.pane || this.props.defaultPane
    const PaneComponent = this.props.panes[paneName]
    const className = `BoardShowPage-ActionsMenu ${this.props.className||''}`
    const paneProps = Object.assign({}, this.props.paneProps || {})
    paneProps.goToPane = this.goToPane
    return <div className={className}>
      <PaneComponent {...paneProps} />
    </div>
  }

}
