import React, {Component} from 'react'
import ToggleComponent from '../ToggleComponent'
import './ModalView.sass'

export default class ModalView extends Component {
  static propTypes = {
    onAbort: React.PropTypes.func.isRequired,
  }

  render(){
    return <div className="ConfirmationClickable-ModalView">
      <div className="ConfirmationClickable-ModalView-shroud" onClick={this.props.onAbort}></div>
      <div className="ConfirmationClickable-ModalView-stage">
        <div className="ConfirmationClickable-ModalView-window">{this.props.children}</div>
      </div>
    </div>
}
}
