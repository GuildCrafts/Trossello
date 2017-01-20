import React, { Component } from 'react'
import Pane from './Pane'
import MenuPaneLink from './MenuPaneLink'
import LeaveBoardButton from '../LeaveBoardButton'
import ExportBoardButton from '../ExportBoardButton'

export default class MorePane extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    this.refs.input.focus()
    this.refs.input.select()
  }

  render() {
    const { board, onClose, gotoPane, goBack } = this.props
    const url = window.location.href

    return <Pane name="More">
      <MenuPaneLink
        onClick={gotoPane('Settings')}
        iconType='gear'
      >
        Settings
      </MenuPaneLink>
      <MenuPaneLink
        onClick={gotoPane('Labels')}
        iconType='tag'
      >
        Labels
      </MenuPaneLink>
      <MenuPaneLink
        onClick={gotoPane('Unarchive')}
        iconType='archive'
      >
        Unarchive
      </MenuPaneLink>
      <div className="BoardShowPage-MenuSideBar-separator" />
      <ExportBoardButton boardId={board.id}/>
      <div className="BoardShowPage-MenuSideBar-separator" />
      <LeaveBoardButton boardId={board.id}/>
      <div className="BoardShowPage-MenuSideBar-separator" />
      <form className="BoardShowPage-MenuSideBar-form" >
        <label>Link to this board:</label>
        <input type="text" ref='input' readOnly value={url} ></input>
      </form>
    </Pane>
  }
}
