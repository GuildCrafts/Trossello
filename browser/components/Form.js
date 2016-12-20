import React, { Component, PropTypes } from 'react'
import './Form.sass'

class Form extends Component {

  static defaultProps = {
    preventSubmit: true,
  }

  static propTypes = {
    preventSubmit: PropTypes.bool.isRequired,
  }

  onSubmit = (event) => {
    if (this.props.preventSubmit) event.preventDefault()
    if (this.props.onSubmit) this.props.onSubmit(event)
  }

  render(){
    const props = Object.assign({}, this.props)
    delete props.preventSubmit
    props.className = `Form ${props.className||''}`
    props.onSubmit = this.onSubmit
    return <form {...props}>{this.props.children}</form>
  }
}

export default Form
