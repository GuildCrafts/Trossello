import React, {Component} from 'react'
import './BigSelect.sass'

export default class BigSelect extends Component {

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    onBack: React.PropTypes.func,
  }

  render(){
    const className = `BigSelect ${this.props.className || ''}`
    return <div className={className} >
      <label> {this.props.labelText} </label>
      <span> {this.props.spanText} </span>
      <select onChange={this.props.onChange} value={this.props.optionValue}> {this.props.selectOptions} </select>
    </div>
  }
}
