import React, { Component } from 'react'
import Link from './Link'
import Icon from './Icon'
import './ConfirmationDialog.sass'

export default class ConfirmationDialog extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    message:  React.PropTypes.string.isRequired,
    onConfirm:  React.PropTypes.func.isRequired,
    onAbort:  React.PropTypes.func.isRequired,
  }

  componentDidMount(){
    this.refs.cancel.refs.link.focus()
  }

  render(){
    const className = `ConfirmationDialog-window ${this.props.className||''}`
    return <div className="ConfirmationDialog">
      <div className="ConfirmationDialog-shroud" onClick={this.props.onAbort}></div>
      <div className="ConfirmationDialog-stage">
        <div className={className}>
          <div className="ConfirmationDialog-header">
            <h2 className="ConfirmationDialog-title">{this.props.title}</h2>
            <Link className="ConfirmationDialog-cancel" onClick={this.props.onAbort}>
              <Icon type="times"/>
            </Link>
            <hr/>
          </div>
          <h4>{this.props.message}</h4>

          <div className="ConfirmationDialog-controls">
            <Link ref="cancel" className="ConfirmationDialog-controls-button ConfirmationDialog-controls-cancel" onClick={this.props.onAbort}>
              Cancel
            </Link>
            <Link className="ConfirmationDialog-controls-button ConfirmationDialog-controls-ok" onClick={this.props.onConfirm}>
              {this.props.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  }
}
