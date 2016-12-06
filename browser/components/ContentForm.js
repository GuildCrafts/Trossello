import React, { Component } from 'react'
import autosize from 'autosize'
import Form from './Form'
import Link from './Link'
import Button from './Button'
import Icon from './Icon'
import './ContentForm.sass'

export default class ContentForm extends Component {

  static propTypes = {
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onSave: React.PropTypes.func.isRequired,
    submitButtonName: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    hideCloseX: React.PropTypes.bool,
    submitOnEnter: React.PropTypes.bool,
  };

  static defaultProps = {
    submitButtonName: 'Save',
    defaultValue: '',
    hideCloseX: false,
    submitOnEnter: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      content: this.props.defaultValue
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.save = this.save.bind(this)
    this.cancel = this.cancel.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
  }

  autosize(){
    autosize(this.refs.content)
  }

  componentDidMount(){
    this.refs.content.focus()
    this.autosize()
  }

  componentDidUpdate(){
    this.autosize()
  }

  onKeyDown(event) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      (this.props.submitOnEnter || event.metaKey)
    ){
      return this.save(event)
    }
    if (event.key === 'Escape') {
      return this.cancel(event)
    }
  }

  onKeyUp(event){
    if (this.props.onChange)
      this.props.onChange(event)

    this.autosize()
  }

  onContentChange(event){
    const cardContent = event.target.value
    this.setState({content: cardContent})
  }

  setContent(content){
    this.setState({content})
  }

  save(event){
    if (event) event.preventDefault()
    this.props.onSave(this.refs.content.value)
  }

  cancel(event){
    if (event) event.preventDefault()
    this.props.onCancel()
    this.setContent(this.props.defaultValue)
  }

  render() {
    const closeX = this.props.hideCloseX ? null :
      <Link onClick={this.cancel}>
        <Icon type="times" />
      </Link>

    const className = `ContentForm ${this.props.className||''}`

    return <Form className={className} onSubmit={this.save}>
      <textarea
        className="ContentForm-textarea"
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        ref="content"
        value={this.state.content}
        onChange={this.onContentChange}
        placeholder={this.props.placeholder}
      />
      <div className="ContentForm-controls">
        <Button type="primary" submit>{this.props.submitButtonName}</Button>
        {closeX}
      </div>
    </Form>
  }
}
