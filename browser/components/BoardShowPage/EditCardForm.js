import React, { Component } from 'react'
// import Form from '../Form'
// import Link from '../Link'
// import Icon from '../Icon'
// import Card from './Card'
// import Button from '../Button'

import ContentForm from '../ContentForm'

import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import sessionStorage from '../../sessionStorage'
const KEY = "EditCardFormContent"

export default class EditCardForm extends Component {

  static propTypes = {
    card: React.PropTypes.object,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    submitButtonName: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    hideCloseX: React.PropTypes.bool,
    submitOnEnter: React.PropTypes.bool,
  }

  constructor(props) {
    super(props)
    // this.onKeyUp = this.onKeyUp.bind(this)
    // this.save = this.save.bind(this)
    // this.cancel = this.cancel.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  initialContentValue(props){
    return this.props.card ?
      this.props.card.content || '' :
      sessionStorage[KEY] || ''
  }

  onChange(event){
    const cardContent = event.target.value
    if (!this.props.card) {
      sessionStorage[KEY] = cardContent
    }
    // this.setState({content: cardContent})
  }

  render() {
    return <ContentForm
      onChange={this.onChange}
      onCancel={this.props.onCancel}
      onSave={this.props.onSave}
      submitButtonName={this.props.submitButtonName}
      defaultValue={this.initialContentValue()}
      hideCloseX={this.props.hideCloseX}
      submitOnEnter={this.props.submitOnEnter}
    />
    // const closeX = this.props.hideCloseX ? null :
    //   <Link onClick={this.cancel}>
    //     <Icon type="times" />
    //   </Link>

    // return <Form className="BoardShowPage-EditCardForm" onSubmit={this.save}>
    //   <textarea
    //     className="BoardShowPage-Card"
    //     onKeyUp={this.onKeyUp}
    //     ref="content"
    //     value={this.state.content}
    //     onChange={this.onContentChange}
    //   />
    //   <div className="BoardShowPage-EditCardForm-controls">
    //     <Button type="primary" submit>{this.props.submitButtonName}</Button>
    //     {closeX}
    //   </div>
    // </Form>
  }
}
