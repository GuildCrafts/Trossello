import React, { Component } from 'react'
import './Form.sass'

class Form extends Component {

  onSubmit = (event) => {
    if (!this.props.target) event.preventDefault()
    if (this.props.onSubmit) this.props.onSubmit(event)
  }

  render(){
    const props = Object.assign({}, this.props)
    props.className = `Form ${props.className||''}`
    props.onSubmit = this.onSubmit
    return <form {...props}>{this.props.children}</form>
  }
}

export default Form
