import React, { Component } from 'react'
import './Avatar.sass'

export default class Avatar extends Component {

  static propTypes = {
    src: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOf(['small', 'default', 'large']),
  };

  static defaultProps = {
    size: 'default',
  };

  render(){
    const className = `Avatar Avatar-${this.props.size}`
    return <img src={this.props.src} className={className} />
  }
}
