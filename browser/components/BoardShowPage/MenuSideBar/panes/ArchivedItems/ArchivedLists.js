import React, { Component } from 'react'
import Button from '../../../../Button'
import commands from '../../../../../commands'

export default class ArchivedLists extends Component {

  static propTypes = {
    searchTerm: React.PropTypes.string,
    board: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.unarchiveList = this.unarchiveList.bind(this)
  }

  unarchiveList(id){
    commands.unarchiveList(id)
  }

  render(){
    const lists = this.props.board.lists
        .filter(list => list.archived)
        .filter(list => list.name.toUpperCase().indexOf(this.props.searchTerm.ToUpperCase))
        .sort((a, b) => a.name - b.name)
    const listNodes = lists.map((list, index) =>
        <div key={list.id}> {list.name}
        <Button onClick={()=> this.unArchiveList(list.id)} className="BoardShowPage-MenuSideBar-ArchivedItems-UnarchiveButton">Send to Board</Button>
        </div>
      )

    return(
      <div className="BoardShowPage-MenuSideBar-ArchivedItems-archivedLists">
        {listNodes}
      </div>
      )
   }
}
