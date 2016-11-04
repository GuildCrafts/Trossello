import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// subclass this component to give it the toggle functionality
class ToggleComponent extends Component {

  // override this in your subclass to change the default
  static initialState = false

  // set this to false to disable setting open=false when the user clicks outside the element.
  static closeIfUserClicksOutside = true
  static closeOnEscape = true

  constructor(props){
    super(props)
    this.state = {
      open: this.constructor.initialState
    }
    this.toggle = this.toggle.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    if (this.constructor.closeOnEscape){
      this.closeIfUserHitsEscape = this.closeIfUserHitsEscape.bind(this)
      document.body.addEventListener('keydown', this.closeIfUserHitsEscape, false)
    }
    if (this.constructor.closeIfUserClicksOutside){
      this.closeIfUserClickedOutside = this.closeIfUserClickedOutside.bind(this)
      document.body.addEventListener('click', this.closeIfUserClickedOutside, false)
    }
  }

  componentWillUnmount(){
    if (this.constructor.closeIfUserClicksOutside)
      document.body.removeEventListener('click', this.closeIfUserClickedOutside)
    if (this.constructor.closeOnEscape)
      document.body.removeEventListener('keydown', this.closeIfUserHitsEscape)
  }

  toggle(){
    this.setState({
      open: !this.state.open
    })
  }

  close(){
    this.setState({
      open: false
    })
  }

  open(){
    this.setState({
      open: true
    })
  }

  closeIfUserHitsEscape(event){
    if (this.state.open && event.code === "Escape") {
      this.close()
      event.preventDefault()
    }
  }

  closeIfUserClickedOutside(event){
    if (!this.state.open) return
    const button = ReactDOM.findDOMNode(this.refs.button)
    const rootNode = ReactDOM.findDOMNode(this.refs.toggle || this)
    const targetNode = event.target
    if (button && (targetNode === button || button.contains(targetNode))) return
    if (rootNode && targetNode && !rootNode.contains(targetNode)) this.close()
  }

}

export default ToggleComponent
