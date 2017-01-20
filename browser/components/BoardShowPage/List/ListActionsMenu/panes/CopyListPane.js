import React, { Component } from 'react'
import Form from '../../../../Form'
import Button from '../../../../Button'
import ActionsMenuPane from '../../../ActionsMenuPane'
import commands from '../../../../../commands'

export default class CopyListPane extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.list.name
    }
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.copyListHandler = this.copyListHandler.bind(this)
  }

  copyListHandler(event) {
    event.preventDefault()
    if (this.state.value.replace(/\s+/g,'') === '') {
      this.focusAndSelect()
      return
    }
    const { list } = this.props
    commands.duplicateList(list.board_id, list.id, this.state.value)
      .then(this.props.onClose)
  }

  onChangeHandler(event) {
    this.setState({value: event.target.value})
  }

  componentDidMount(){
    this.focusAndSelect()
  }

  focusAndSelect(){
    this.refs.textarea.focus()
    this.refs.textarea.select()
  }

  render() {
    return <ActionsMenuPane
      className="BoardShowPage-List-ListActionsMenu-CopyListPane"
      heading="Copy List"
      onClose={this.props.onClose}
      onBack={this.props.goToPane('List Actions')}
    >
      <Form onSubmit={this.copyListHandler}>
        <div>Name</div>
        <textarea
          ref="textarea"
          value={this.state.value}
          onChange={this.onChangeHandler}
        />
        <Button type="primary" submit>Create List</Button>
      </Form>
    </ActionsMenuPane>
  }
}
