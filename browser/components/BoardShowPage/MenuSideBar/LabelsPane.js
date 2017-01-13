import React, { Component } from 'react'

export default class LabelsPane extends Component {
  render(){
    return <div> is this working? </div>
  }
}

// import Pane from './Pane' ????
//where does Board come from?
// import boardStore from '../../../stores/boardStore'
// import SearchBar from './SearchBar'
//
// export default class LabelsPane extends Component {
//
//   static propTypes = {
//     board: React.PropTypes.object.isRequired,
//     // onClose: React.PropTypes.func.isRequired
//   }
//
//   constructor(props){
//     super(props)
//     this.state = {
//       //states for this component
//       searchTerm: '',
//
//     }
//     // bind properties like this:
//     this.setSearchTerm = this.setSearchTerm.bind(this)
//   }
//
//   setSearchTerm(event) {
//     this.setState({
//       searchTerm: event.target.value
//     })
//   }
//
//   render() {
//     const { board } = this.props
//
//     return <div>
//       <SearchBar
//         type="text"
//         className="BoardShowPage-MenuSideBar-ArchivedItems-SearchBox"
//         placeholder="Placeholder for searching unarchive."
//         value={this.state.searchTerm}
//         onChange={this.setSearchTerm}
//       />
//   }
// }
