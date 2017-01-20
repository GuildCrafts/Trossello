import React, { Component } from 'react'
import boardStore from '../../../../../stores/boardStore'
import Form from '../../../../Form'
import Card from '../../../../Card'
import Link from '../../../../Link'
import ConfirmationLink from '../../../../ConfirmationLink'
import Icon from '../../../../Icon'
import Button from '../../../../Button'
import ArchivedCards from './ArchivedCards'
import ArchivedLists from './ArchivedLists'
import commands from '../../../../../commands'


export default class ArchivedItems extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      searchTerm: '',
      display: 'Cards'
    }
    this.setSearchTerm = this.setSearchTerm.bind(this)
    this.toggleDisplay = this.toggleDisplay.bind(this)
  }

  setSearchTerm(event){
    const searchTerm = event.target.value
    this.setState({searchTerm: searchTerm})
  }

  toggleDisplay(){
    const display = this.state.display === 'Cards' ? 'Lists' : 'Cards'
    this.setState( {
      display: display
    })
  }

  render(){
    const { board } = this.props
    const toggleButtonText = this.state.display === 'Cards' ? 'Switch to lists':"Switch to cards"
    const toggleDisplayStatus = this.state.display === 'Cards' ?
      <ArchivedCards board={board} searchTerm={this.state.searchTerm} className="BoardShowPage-MenuSideBar-ArchivedItems-List" /> :
      <ArchivedLists board={board} searchTerm={this.state.searchTerm} className="BoardShowPage-MenuSideBar-ArchivedItems-List"/>
    return <div className="BoardShowPage-MenuSideBar-ArchivedItems">
      <span className="BoardShowPage-MenuSideBar-ArchivedItems-Header" >
        <input
          type="text"
          className="BoardShowPage-MenuSideBar-ArchivedItems-SearchBox"
          placeholder="Search archive..."
          value={this.state.searchTerm}
          onChange={this.setSearchTerm}
        />
        <Link
          onClick={this.toggleDisplay}
          className="BoardShowPage-MenuSideBar-ArchivedItems-ToggleDisplay"
        >
          {toggleButtonText}
        </Link>
      </span>
      {toggleDisplayStatus}
    </div>
  }
}
