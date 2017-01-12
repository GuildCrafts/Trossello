import React, { Component } from 'react'
import SearchBar from './SearchBar'
import Pane from './index'


export default class LabelsPane extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,

  }

  constructor(props){
    super(props)
    this.state = {
      display: 'Cards',
      value: ''
    }
    this.setSearchTerm = this.setSearchTerm.bind(this)
    this.toggleDisplay = this.toggleDisplay.bind(this)
    this.goToPane = this.goToPane.bind(this)
    this.goBack = this.goBack.bind(this)


  }

  setSearchTerm(event){
    const value = event.target.value
    this.setState({value: value})
  }

  goToPane(pane) {
    if (!(pane in this.props.panes))
      throw new Error(`cannot go to pane ${pane} it was not defined in panes prop`)
    return event => {
      if (event) event.preventDefault()
      this.setState({
        pane: pane
      })
    }
  }

  goBack(){
    //TODO: this needs to go back to the More Pane; look above
    this.props.goToPane('Main Label Pane')()
  }

  render(){
    const { board } = this.props
    // TODO: component for displaying search results
    return(
      <div className="">
        <Pane name="Labels">
          <div>Labels Panel</div>
          <SearchBar
            type="text"
            className="BoardShowPage-MenuSideBar-ArchivedItems-SearchBox"
            placeholder="Placeholder for searching labels."
            value={this.state.value}
            onChange={this.setSearchTerm}
          />
        </Pane>
      </div>
      )
  }
}
// const LabelsPane = ({board, onClose, gotoPane, goBack}) =>
//   <Pane name="Labels">
//     <div>Labels Panel</div>
//     <SearchBar
//       type="text"
//       className="BoardShowPage-MenuSideBar-ArchivedItems-SearchBox"
//       placeholder="Placeholder for searching labels."
//       value={this.state.value}
//       onChange={this.setSearchTerm}
//     />
//   </Pane>
module.exports = LabelsPane
