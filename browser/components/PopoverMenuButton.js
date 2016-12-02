import React, { Component } from 'react'
import Button from './Button'
import ToggleComponent from './ToggleComponent'

export default class PopoverMenuButton extends ToggleComponent {

  static propTypes = {
    popover: React.PropTypes.element.isRequired,
    buttonType: React.PropTypes.string,
    buttonClassName: React.PropTypes.string,
  }

  render(){
    const className = `PopoverMenuButton ${this.props.className || ''}`
    const popover = this.state.open ?
      React.cloneElement(
        this.props.popover,
        {ref:"toggle", onClose:this.close},
      ) : null

    const buttonProps = Object.assign({}, this.props)
    delete buttonProps.popover
    buttonProps.onClick = this.toggle
    buttonProps.className = buttonProps.buttonClassName
    delete buttonProps.buttonClassName

    return <div className={className}>
      <Button ref="button" {...buttonProps}>
        {this.props.children}
      </Button>
      {popover}
    </div>
  }
}
