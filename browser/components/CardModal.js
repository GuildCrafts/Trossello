import React, { Component } from 'react'
import Link from './Link'
import Icon from './Icon'
import Form from './Form'
import Card from './BoardShowPage/Card'
import boardStore from '../stores/boardStore'
import './CardModal.sass'
import $ from 'jquery'

export default class CardModal extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,
  }
  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props)
    this.state = {
      editingDescription: false,
      editingName: false,
    }
    this.editDescription = this.editDescription.bind(this)
    this.stopEditingDescription = this.stopEditingDescription.bind(this)
    this.displayDescription = this.displayDescription.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.submitDescription = this.submitDescription.bind(this)
    this.updateName = this.updateName.bind(this)
    this.submitName = this.submitName.bind(this)
    this.editName = this.editName.bind(this)
    this.stopEditingName = this.stopEditingName.bind(this)
  }

  submitName(event) {
    const { card } = this.props
    const content = {
      content: this.refs.content.value
    }
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.updateName(content)
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.updateName(content)
    }
  }

  submitDescription(event) {
    const { card } = this.props
    const description = {
      description: this.refs.description.value,
    }
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.updateDescription(description)
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.updateDescription(description)
    }
  }

  editName(){
    this.setState({editingName: true})
  }

  stopEditingName(){
    this.setState({editingName: false})
  }

  editDescription(){
    this.setState({editingDescription: true})
  }

  stopEditingDescription(){
    this.setState({editingDescription: false})
  }

  displayDescription(description){
    if(description==''){
      description = 'Enter notes or a description here.'

    }
    return <div>
        {description}
      </div>
  }

  updateDescription(description){
    const { card } = this.props
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(description),
    }).then(() => {
      this.stopEditingDescription()
      boardStore.reload()
    })
  }
  updateName(content){
    const { card } = this.props
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(content),
    }).then(() => {
      this.stopEditingName()
      boardStore.reload()
    })
  }


  render(){
    const { session } = this.context
    const description = this.displayDescription(this.props.card.description)
    const editDescriptionForm = this.state.editingDescription ?
      <Form className="CardModal-description-Edit" onSubmit={this.updateDescription}>
        <textarea
          className="CardModal-description-Edit-input"
          onKeyDown={this.submitDescription}
          ref="description"
          defaultValue={this.props.card.description}
        />
        <Link className="CardModal-description-Edit-cancel" onClick={this.stopEditingDescription}>
          <Icon type="times" />
        </Link>
        </Form> : <div className="CardModal-description-text">{description}</div>
    const editCardNameForm = this.state.editingName ?
    <Form className="CardModal-header-Edit" onSubmit={this.updateName}>
      <textarea
        className="CardModal-header-Edit-input"
        onKeyDown={this.submitName}
        ref="content"
        defaultValue={this.props.card.content}
      />
      <Link className="CardModal-header-Edit-cancel" onClick={this.stopEditingName}>
        <Icon type="times" />
      </Link>
      </Form> : <div onClick={this.editName} className="CardModal-name">{this.props.card.content}</div>

    return <div className="CardModal">
      <div onClick={this.props.onClose} className="CardModal-shroud">
      </div>
      <div className="CardModal-stage">
        <div className="CardModal-window">
          <div className="CardModal-header">
            {editCardNameForm}
            <hr />
          </div>
          <div className="CardModal-details">
            <div className="CardModal-details-margin">
              <span className="CardModal-details-list">in List: {this.props.list.name}</span>
              <span className="CardModal-details-board">in Board: {this.props.board.name}</span>
              <div className="CardModal-description">
                <div className="CardModal-description-title">
                  Description
                  <Link className="CardModal-description-Edit-button" onClick={this.editDescription}>
                  <Icon type="pencil"/>
                </Link></div>
                {editDescriptionForm}
              </div>
              <div className="CardModal-comments">
                <div className="CardModal-comments-icon">
                <Icon size="2" type="comment-o"/>
                </div>
                <div className="CardModal-comments-header">Add Comment:</div>
                <Form className="CardModal-comments-Form">
                  <textarea
                    className="CardModal-comments-Form-input"
                    ref="comment"
                    defaultValue=''
                  />
                  <img className="CardModal-comments-userimage" src={session.user.avatar_url}></img>
                  <input type="submit" value="Send"/>
                </Form>
              </div>
            </div>
          </div>
        <div className="CardModal-controls">
          <div className="CardModal-controls-add">
            <span className="CardModal-controls-title">Add</span>
            <div className="CardModal-controls-add-buttons">
            </div>
          </div>
          <div className="CardModal-controls-actions">
            <span className="CardModal-controls-title">Actions</span>

          </div>
        </div>

      </div>
      </div>
    </div>
  }
}
