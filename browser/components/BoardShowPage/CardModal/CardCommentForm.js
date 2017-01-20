import React, { Component } from 'react'
import Icon from '../../Icon'
import ContentForm from '../ContentForm'
import commands from '../../../commands'
import './CardCommentForm.sass'

export default class CardCommentForm extends Component {
  static PropTypes = {
    card: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.addComment = this.addComment.bind(this)
  }

  addComment(content, event){
    const { card } = this.props
    const { user } = this.props.session
    if (event) event.preventDefault()
    commands.addComment(card.id, user.id, content)
      .then(() => {
        this.refs.comment.setContent('')
      })
  }

  render(){
    const { session } = this.props

    return <div className="BoardShowPage-CardModal-CardCommentForm">
      <div className="BoardShowPage-CardModal-CardCommentForm-header">
        <div className="BoardShowPage-CardModal-CardCommentForm-header-icon">
          <Icon size="2" type="comment-o"/>
        </div>
        <div className="BoardShowPage-CardModal-CardCommentForm-header-title">
          Add Comment
        </div>
      </div>
      <div className="BoardShowPage-CardModal-CardCommentForm-body">
        <div className="BoardShowPage-CardModal-CardCommentForm-image-container">
          <img className="BoardShowPage-CardModal-CardCommentForm-image" src={session.user.avatar_url}></img>
        </div>
        <ContentForm
          ref="comment"
          className="BoardShowPage-CardModal-CommentEditForm"
          onSave={this.addComment}
          submitButtonName="Send"
          placeholder="Write a comment…"
          defaultValue=""
          hideCloseX
          autoFocus={false}
        />
      </div>
    </div>
  }
}
