import React, {Component} from 'react'
import Link from './Link'
import Icon from './Icon'
import './DialogBox.sass'

export default class DialogBox extends Component {
  static propTypes = {
    heading: React.PropTypes.string,
    onClose: React.PropTypes.func.isRequired
  }


  render(){
    const className = `DialogBox ${this.props.className || ''}`
    return <div className={className}>
      <div className="DialogBox-header">
        {this.props.heading}
        <Link className="DialogBox-cancel" onClick={this.props.onClose}>
          <Icon type="times"/>
        </Link>
      </div>
      {this.props.children}
    </div>
  }
}
