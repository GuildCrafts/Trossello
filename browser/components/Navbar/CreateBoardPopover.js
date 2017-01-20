import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'
import Form from '../Form'
import Button from '../Button'
import DialogBox from '../DialogBox'
import ColorBoxGroup from '../ColorBoxGroup'
import commands from '../../commands'
import './CreateBoardPopover.sass'

class CreateBoardPopover extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.state = {
      color: '',
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.updateColor = this.updateColor.bind(this)
  }

  componentDidMount(){
    this.refs.name.focus()
  }

  updateColor(event){
    event.preventDefault()
    this.setState({color: event.target.attributes.color.value})
  }

  onSubmit(event){
    event.preventDefault()
    const board = {
      name: this.refs.name.value,
      background_color: this.state.color,
      archived: false
    }
    if (board.name.replace(/\s+/g,'') === '') return
    commands.createBoard(board)
      .then((board) => {
        if (this.props.onClose) this.props.onClose()
        this.context.redirectTo('/boards/'+board.id)
        this.reset()
      })
  }

  reset(){
    if (this.refs.name) this.refs.name.value = ''
    if (this.refs.color) this.refs.color.value = ''
  }

  render(props){
    return <DialogBox
      heading="Create A Board"
      onClose={this.props.onClose}
      className="CreateBoardPopover"
    >
      <Form onSubmit={this.onSubmit}>
        <label>
          <div>Name</div>
          <input type="text" ref="name" className="CreateBoardPopover-boardName-input"/>
        </label>
        <div className="CreateBoardPopover-createBackgroundColor">
          <ColorBoxGroup
            onClick={this.updateColor}
          />
        </div>
        <label>
          <input
            type="text"
            ref="color"
            placeholder="#2E86AB"
            value={this.state.color || ''}
            onChange={this.updateColor}
          />
        </label>
        <Button type="primary" action="submit" className="CreateBoardPopover-submit-button">Create</Button>
      </Form>
    </DialogBox>
  }
}

const colors = [
  "#0079bf",
  "#d8a359",
  "#70a95d",
  "#bc6858",
  "#9d7cae",
  "#d478a4",
  "#6cc885",
  "#30bbd3",
  "#98a0a4"
]

export default CreateBoardPopover
