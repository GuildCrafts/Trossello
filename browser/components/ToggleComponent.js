import React, { Component } from 'react'

// subclass this component to give it the toggle functionality
class ToggleComponent extends Component {

  // override this in your subclass to change the default
  static initialState = false

  // set this to true to close the toggle when the user clicks outside the element.
  // note: you must add `ref="root"` to the root node of your render
  static closeIfUserClicksOutside = false

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
    const targetNode = event.target
    let rootNode = this.refs.root
    while(rootNode && ('refs' in rootNode)){ rootNode = rootNode.refs.root }
    if (rootNode && targetNode && !rootNode.contains(targetNode)) this.close()
  }


}

export default ToggleComponent
