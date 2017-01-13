import React, { Component, PropTypes } from 'react'
import CardLabel from '../Card/CardBadges/CardLabel'
import SearchBar from './SearchBar'
import PopoverMenuButton from '../../PopoverMenuButton'
import './LabelsPane.sass'


// This component is designed to be given to ActionsMenu
export default class LabelsPane extends Component {

  static propTypes = {
    board: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    
    // states for this component
    this.state = {
      searchTerm: '',
    }
    // bind properties like this:
    this.setSearchTerm = this.setSearchTerm.bind(this)
  }

  setSearchTerm(event) {
    this.setState({
      searchTerm: event.target.value
    })
  }

  render(){
    const { board } = this.props

    const labels = board.labels.map( label => {
      return <CardLabel 
        key={label.id}
        className="BoardShowPage-MenuSideBar-LabelsPane-Label"
        color={label.color} 
        text={label.text} 
        checked={false}
      />
    })

    return <div className="BoardShowPage-MenuSideBar-LabelsPane">
      <SearchBar
        type="text"
        className="BoardShowPage-MenuSideBar-LabelsPane-SearchBox"
        placeholder="Placeholder for searching unarchive."
        value={this.state.searchTerm} 
        onChange={this.setSearchTerm}
      />

      {labels}

   <PopoverMenuButton 
    className="BoardShowPage-RenameBoardButton" 
    type="invisible" 
    popover={labels} />
      
    </div>
  }

}