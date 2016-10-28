import './ConfirmationDialog.sass'
import React, { Component } from 'react'
import Link from './Link'
import Icon from './Icon'
import ModalView from './ModalView'
import DialogBox from './DialogBox'
import Button from './Button'

export default class ConfirmationDialog extends Component {
  static propTypes = {
    buttonName: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    message:  React.PropTypes.string.isRequired,
    onConfirm:  React.PropTypes.func.isRequired,
    onAbort:  React.PropTypes.func.isRequired,
  }

  componentDidMount(){
    this.refs.cancel.refs.button.focus()
  }

  render(){
    const className = `ConfirmationDialog-window ${this.props.className||''}`
    return <ModalView onAbort={this.props.onAbort}>
      <DialogBox onClose={this.props.onAbort} heading={this.props.title}>
        <h4>{this.props.message}</h4>
        <div className="ConfirmationDialog-controls">
          <Button ref="cancel" className="ConfirmationDialog-controls-button ConfirmationDialog-controls-cancel" onClick={this.props.onAbort}>
            Cancel
          </Button>
          <Button type="danger" onClick={this.props.onConfirm}>
            {this.props.buttonName}
          </Button>
        </div>
      </DialogBox>
    </ModalView>
  }
}
