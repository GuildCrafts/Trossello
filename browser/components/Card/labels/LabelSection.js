import React, { Component } from 'react'
import './LabelSection.sass'

export default class LabelSection extends Component {
  static propTypes = {
    heading: React.PropTypes.string,
  }

  render(){
    return <div className="Card-LabelSection">
      <div className="Card-LabelSection-header">
        {this.props.heading}
      </div>
      <div className="Card-LabelSection-content">
        {this.props.children}
      </div>
    </div>
  }
}
