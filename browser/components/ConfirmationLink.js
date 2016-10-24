import React, { Component } from 'react'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import ConfirmationDialog from './ConfirmationDialog'


export default class ConfirmationLink extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
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
        name={this.props.name}
        title={this.props.title}
        message={this.props.message}
        onConfirm={this.onConfirm}
        onAbort={this.onAbort}
      /> : null

    return <span className='ConfirmationLink'>
      <Link className={this.props.className} onClick={this.openDialog} >
        {this.props.children}
      </Link>
      {confirmationDialog}
    </span>

  }
}
