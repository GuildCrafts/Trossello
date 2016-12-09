import React, {Component} from 'react'
import moment from 'moment'

export default class TimeFromNow extends Component {
  static PropTypes = {
    time: React.PropTypes.string.isRequired
  };

  constructor(props){
    super(props)
    this.timeout = setInterval(() => this.forceUpdate(), 1000)
  }

  componentWillUnmount(){
    clearInterval(this.timeout)
  }

  render(){
    return <span className="TimeFromNow">
      {moment(this.props.time).fromNow()}
    </span>
  }
}
