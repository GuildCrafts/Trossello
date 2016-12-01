import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import Button from './Button'
import ToggleComponent from './ToggleComponent'

export default class PopoverMenuButton extends ToggleComponent {

  static propTypes = {
    popover: React.PropTypes.element.isRequired,
    buttonType: React.PropTypes.string,
    buttonClassName: React.PropTypes.string,
  }

  constructor(props){
    super(props)
    this.repositionPopover = this.repositionPopover.bind(this)
    $(window).on('resize', this.repositionPopover)
    setTimeout(this.repositionPopover, 30)
  }

  componentDidUpdate(){
    this.repositionPopover()
  }

  componentWillUnmount(){
    $(window).off('resize', this.repositionPopover)
  }

  repositionPopover(){
    const popover = ReactDOM.findDOMNode(this.refs.toggle)
    const button = ReactDOM.findDOMNode(this.refs.button)
    if (!popover || !button) return
    const popoverRect = popover.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()

    const style = {
      top: buttonRect.top+'px',
      left: buttonRect.left+'px',
    }

    if ((buttonRect.top + popoverRect.height) > window.innerHeight)
      style.top = (window.innerHeight - popoverRect.height)+'px'

    if ((buttonRect.left + popoverRect.width) > window.innerWidth)
      style.left = (window.innerWidth - popoverRect.width)+'px'

    console.log('repositionPopover', style)//, buttonRect, popoverRect)
    $(popover).css(style)
  }

  render(){
    const className = `PopoverMenuButton ${this.props.className || ''}`
    const popover = this.state.open ?
      React.cloneElement(
        this.props.popover,
        {
          ref: "toggle",
          onClose: this.close,
          // style: this.state.style,
        },
      ) : null

    const buttonProps = Object.assign({}, this.props)
    delete buttonProps.popover
    buttonProps.onClick = this.toggle
    // buttonProps.type = buttonProps.buttonType
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
