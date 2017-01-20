import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import ContentForm from './ContentForm'
const KEY = "EditCardFormContent"
import commands from '../../commands'

export default class NewCardForm extends Component {

  static propTypes = {
    board: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    order: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onSave: React.PropTypes.func,
  };

  static defaultProps = {
    hideCloseX: false,
    submitOnEnter: true,
  };

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.closeIfUserClickedOutside = this.closeIfUserClickedOutside.bind(this)
    document.body.addEventListener('click', this.closeIfUserClickedOutside, false)
  }

  componentWillUnmount(){
    document.body.removeEventListener('click', this.closeIfUserClickedOutside)
  }

  closeIfUserClickedOutside(event) {
    const container = ReactDOM.findDOMNode(this.refs.container)
    if (!container.contains(event.target) && container !== event.target) {
      this.props.onCancel(event)
    }
  }

  setLastValue(value){
    sessionStorage[KEY] = value
  }

  onChange(event){
    this.setLastValue(event.target.value)
    if (this.props.onChange) this.props.onChange(event)
  }

  onCancel(event){
    this.setLastValue('')
    if (this.props.onCancel) this.props.onCancel(event)
  }

  onSave(content){
    if (content.replace(/\s+/g,'') === '') return

    const { board, list } = this.props
    const card = {
      content,
      order: this.props.order
    }

    commands.newCardForm(board.id, list.id, card)
      .then(card => {
        if (this.props.onSave) this.props.onSave(card)
        this.setLastValue('')
        this.refs.container.setContent('')
      })
  }

  render() {
    return <ContentForm
      ref="container"
      className="BoardShowPage-NewCardForm"
      onChange={this.onChange}
      onCancel={this.onCancel}
      onSave={this.onSave}
      submitButtonName="Add"
      defaultValue={sessionStorage[KEY] || ''}
      hideCloseX={this.props.hideCloseX}
      submitOnEnter={this.props.submitOnEnter}
    />
  }
}
