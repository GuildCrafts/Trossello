import React, {Component} from 'react'
import ToggleComponent from './ToggleComponent'
import './ModalView.sass'

export default class ModalView extends Component {
  static propTypes = {
    onAbort: React.PropTypes.func.isRequired,
  }

  render(){
    return <div className="ModalView">
      <div className="ModalView-shroud" onClick={this.props.onAbort}></div>
      <div className="ModalView-stage">
        <div className="ModalView-window">{this.props.children}</div>
      </div>
    </div>
}
}
