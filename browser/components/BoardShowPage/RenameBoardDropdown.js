import React, {Component} from 'react'
import $ from 'jquery'
import DialogBox from '../DialogBox'
import Button from '../Button'
import Form from '../Form'
import './RenameBoardDropdown.sass'

export default class RenameBoardDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.board.name
    }
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.updateNameHandler = this.updateNameHandler.bind(this)
  }

  updateNameHandler(event) {
    event.preventDefault()
    if (this.state.value.replace(/\s+/,'') === ''){
      this.focusAndSelect()
      return
    }
    const { board } = this.props
    $.ajax({
      method: 'post',
      url: `/api/boards/${board.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({name: this.state.value}),
    }).then(() => {
      boardStore.reload()
      this.props.onClose()
    })
  }

  onChangeHandler(event) {
    this.setState({value: event.target.value})
  }

  focusAndSelect() {
    this.refs.input.focus()
    this.refs.input.select()
  }

  componentDidMount() {
    this.focusAndSelect()
  }

  render() {
    return <DialogBox className="RenameBoardDropdown" heading="Rename Board" onClose={this.props.onClose}>
      <Form onSubmit={this.updateNameHandler}>
        <div>Name</div>
        <input
          ref="input"
          value={this.state.value}
          onChange={this.onChangeHandler}
        />
        <Button type="primary" submit>Rename</Button>
      </Form>
    </DialogBox>
  }
}
