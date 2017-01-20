import React, {Component} from 'react'
import DialogBox from '../DialogBox'
import Link from '../Link'
import Icon from '../Icon'

export default class ActionsMenuPane extends Component {

  static propTypes = {
    onClose: React.PropTypes.func.isRequired,
    onBack: React.PropTypes.func,
  }

  render(){
    const className = `BoardShowPage-ActionsMenuPane ${this.props.className||''}`
    const backArrow = this.props.onBack ?
      <Link className="BoardShowPage-ActionsMenuPane-backarrow" onClick={this.props.onBack}>
        <Icon type="arrow-left" />
      </Link> :
      null
    return <DialogBox
      className={className}
      heading={this.props.heading}
      onClose={this.props.onClose}
    >
      {backArrow}
      {this.props.children}
    </DialogBox>
  }
}
