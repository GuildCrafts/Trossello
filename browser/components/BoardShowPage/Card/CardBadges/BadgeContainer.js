import React, {Component} from 'react'
import './BadgeContainer.sass'

export default class BadgeContainer extends Component {
  static propTypes = {
    heading: React.PropTypes.string,
  }

  render(){
    return <div className="BadgeContainer">
      <div className="BadgeContainer-header">
        {this.props.heading}
      </div>
      <div className="BadgeContainer-content">
        {this.props.children}
      </div>
    </div>
  }
}
