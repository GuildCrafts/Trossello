import React, { Component } from 'react'
import Icon from '../../Icon'
import ContentForm from '../ContentForm'
import commands from '../../../commands'
import './CommentForm.sass'

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

    return <div className="BoardShowPage-CardModal-CommentForm">
      <div className="BoardShowPage-CardModal-CommentForm-header">
        <div className="BoardShowPage-CardModal-CommentForm-header-icon">
          <Icon size="2" type="comment-o"/>
        </div>
        <div className="BoardShowPage-CardModal-CommentForm-header-title">
          Add Comment
        </div>
      </div>
      <div className="BoardShowPage-CardModal-CommentForm-body">
        <div className="BoardShowPage-CardModal-CommentForm-image-container">
          <img className="BoardShowPage-CardModal-CommentForm-image" src={session.user.avatar_url}></img>
        </div>
        <ContentForm
          ref="comment"
          className="BoardShowPage-CardModal-CommentForm"
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
