import React, { Component } from 'react'
import Link from './Link'
import Icon from './Icon'
import './ConfirmationDialog.sass'

export default class ConfirmationDialog extends Component {
  static propTypes = {
    message:  React.PropTypes.string.isRequired,
    onConfirm:  React.PropTypes.func.isRequired,
    onAbort:  React.PropTypes.func,
  }
  render(){
    const className = `ConfirmationDialog ${this.props.className||''}`
    return <div className={className}>
      <h4>{this.props.message}</h4>
      <div className="ConfirmationDialog-controls">
        <Link className="ConfirmationDialog-controls-button" onClick={this.props.onAbort}>
          Cancel
        </Link>
        <Link className="ConfirmationDialog-controls-button ConfirmationDialog-controls-ok" onClick={this.props.onConfirm}>OK</Link>
      </div>

    </div>
  }
}
