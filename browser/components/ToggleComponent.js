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
  }

  toggle(event){
    if (event) event.preventDefault()
    this.setState({
      open: !this.state.open
    })
  }

}

export default ToggleComponent
