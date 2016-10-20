import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// subclass this component to give it the toggle functionality
class ToggleComponent extends Component {

  // override this in your subclass to change the default
  static initialState = false

  // set this to false to disable setting open=false when the user clicks outside the element.
  static closeIfUserClicksOutside = true

  constructor(props){
    super(props)
    this.state = {
      open: this.constructor.initialState
    }
    this.toggle = this.toggle.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    if (this.constructor.closeIfUserClicksOutside){
      this.closeIfUserClickedOutside = this.closeIfUserClickedOutside.bind(this)
      document.body.addEventListener('click', this.closeIfUserClickedOutside)
    }
  }

  componentWillUnmount(){
    if (this.constructor.closeIfUserClicksOutside)
     document.body.removeEventListener('click', this.closeIfUserClickedOutside)
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

  closeIfUserClickedOutside(event){
    if (!this.state.open) return
    const targetNode = event.target
    const rootNode = ReactDOM.findDOMNode(this.refs.toggle || this)
    if (rootNode && targetNode && !rootNode.contains(targetNode)) this.close()
  }


}

export default ToggleComponent
