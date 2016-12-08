import React, { Component } from 'react'
import autosize from 'autosize'
import Form from './Form'
import Link from './Link'
import Button from './Button'
import Icon from './Icon'
import './ContentForm.sass'

export default class ContentForm extends Component {

  static propTypes = {
    onCancel: React.PropTypes.func.isRequired,
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
    this.save = this.save.bind(this)
    this.cancel = this.cancel.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
  }

  autosize(){
    autosize(this.refs.content)
  }

  componentDidMount() {
    // this.autosize()
    // this.refs.content.focus()
  }

  componentDidUpdate(){
    this.autosize()
    this.refs.content.focus()
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
    this.autosize()
  }

  onContentChange(event){
    const cardContent = event.target.value
    this.setState({content: cardContent})
  }

  reset(){
    this.setState({
      content: this.props.defaultValue
    })
  }

  save(event){
    if (event) event.preventDefault()
    this.props.onSave({
      content: this.state.content,
    })
    this.reset()
  }

  cancel(event){
    if (event) event.preventDefault()
    this.props.onCancel()
    this.reset()
  }

  render() {
    const closeX = this.props.hideCloseX ? null :
      <Link onClick={this.cancel}>
        <Icon type="times" />
      </Link>

    return <Form className="BoardShowPage-EditCardForm" onSubmit={this.save}>
      <textarea
        className="BoardShowPage-Card"
        onKeyDown={this.onKeyDown}
        ref="content"
        value={this.state.content}
        onChange={this.onContentChange}
      />
      <div className="BoardShowPage-EditCardForm-controls">
        <Button type="primary" submit>{this.props.submitButtonName}</Button>
        {closeX}
      </div>
    </Form>
  }
}
