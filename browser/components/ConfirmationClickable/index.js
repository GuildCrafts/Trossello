import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'
import ConfirmationDialog from './ConfirmationDialog'


export default class ConfirmationClickable extends Component {
  static propTypes = {
    clickable: React.PropTypes.element.isRequired,
    buttonName: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    message:  React.PropTypes.string.isRequired,
    onConfirm:  React.PropTypes.func.isRequired,
    onAbort:  React.PropTypes.func,
  }
  constructor(props){
    super(props)
    this.state = {
      confirming: false,
    }
    this.onConfirm = this.onConfirm.bind(this)
    this.onAbort = this.onAbort.bind(this)
    this.openDialog = this.openDialog.bind(this)
  }

  openDialog(event) {
    event.preventDefault()
    this.setState({ confirming: true })
  }

  onConfirm(event) {
    event.preventDefault()
    this.setState({ confirming: false })
    this.props.onConfirm()
  }

  onAbort(event) {
    event.preventDefault()
    this.setState({ confirming: false })
    if (this.props.onAbort) this.props.onAbort()
  }

  render(){
    const confirmationDialog = this.state.confirming ?
      <ConfirmationDialog
        buttonName={this.props.buttonName}
        title={this.props.title}
        message={this.props.message}
        onConfirm={this.onConfirm}
        onAbort={this.onAbort}
      /> : null

    const clickable = React.cloneElement(this.props.clickable, {
      onClick: this.openDialog,
    })
    return <span className='ConfirmationClickable'>
      {clickable}
      {confirmationDialog}
    </span>

  }
}
