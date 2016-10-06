import React, { Component } from 'react'

// subclass this component to give it the toggle functionality
class ToggleComponent extends Component {

  // override this in your subclass to change the default
  static initialState = false

  constructor(props){
    super(props)
    this.state = {
      open: this.constructor.initialState
    }
    this.toggle = this.toggle.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

  toggle(event){
    if (event) event.preventDefault()
    this.setState({
      open: !this.state.open
    })
  }

  close(event){
    if (event) event.preventDefault()
    this.setState({
      open: false
    })
  }

  open(event){
    if (event) event.preventDefault()
    this.setState({
      open: true
    })
  }

}

export default ToggleComponent
