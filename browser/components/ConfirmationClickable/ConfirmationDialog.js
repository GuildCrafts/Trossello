import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'
import DialogBox from '../DialogBox'
import Button from '../Button'
import ModalView from './ModalView'
import './ConfirmationDialog.sass'

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
    const className = `ConfirmationClickable-ConfirmationDialog-window ${this.props.className||''}`
    return <ModalView onAbort={this.props.onAbort}>
      <DialogBox onClose={this.props.onAbort} heading={this.props.title}>
        <h4>{this.props.message}</h4>
        <div className="ConfirmationClickable-ConfirmationDialog-controls">
          <Button
            ref="cancel"
            className="ConfirmationClickable-ConfirmationDialog-controls-button ConfirmationDialog-controls-cancel"
            onClick={this.props.onAbort}
          >
            Cancel
          </Button>
          <Button
            className="ConfirmationClickable-ConfirmationDialog-controls-button ConfirmationClickable-ConfirmationDialog-controls-confirm" 
            type="danger"
            onClick={this.props.onConfirm}
          >
            {this.props.buttonName}
          </Button>
        </div>
      </DialogBox>
    </ModalView>
  }
}
