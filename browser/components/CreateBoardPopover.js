import React, { Component } from 'react'
import $ from 'jquery'
import './CreateBoardPopover.sass'
import Form from './Form'
import boardsStore from '../stores/boardsStore'

class CreateBoardPopover extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount(){
    this.refs.name.focus()
  }

  onSubmit(event){
    event.preventDefault()
    const board = {
      name: this.refs.name.value,
      background_color: this.refs.color.value,
    }
    $.ajax({
      method: "POST",
      url: '/api/boards',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(board),
    }).then((board) => {
      boardsStore.reload()
      this.context.redirectTo('/boards/'+board.id)
    })
  }

  render(props){
    return <div className="CreateBoardPopover">
      <div className="CreateBoardPopover-header">
        Create A Board
        <hr/>
      </div>
      <Form onSubmit={this.onSubmit}>
        <label>
          <div>Name</div>
          <input type="text" ref="name"/>
        </label>
        <label>
          <div>Color</div>
          <input type="text" ref="color" defaultValue="#2E86AB" />
        </label>
        <input type="submit" value="Create" />
      </Form>
    </div>
  }
}

export default CreateBoardPopover
