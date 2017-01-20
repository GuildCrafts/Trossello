import React, {Component} from 'react'
import DialogBox from '../DialogBox'
import Button from '../Button'
import Form from '../Form'
import commands from '../../commands'
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
    commands.updateBoardName(board.id, this.state.value)
      .then(this.props.onClose)
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
    return <DialogBox className="BoardShowPage-RenameBoardDropdown" heading="Rename Board" onClose={this.props.onClose}>
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
