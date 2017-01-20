import React from 'react'
import ToggleComponent from '../ToggleComponent'
import Link from '../Link'

export default class StyleExample extends ToggleComponent {
  static closeIfUserClicksOutside = false
  static closeOnEscape = false

  render(){
    const sourceCode = this.state.open ?
      <SourceCode code={this.props.sourceCode} /> :
      <Link onClick={this.open} className="Link Secondary-Hover">source code</Link>

    return<div className="StyleGuidePage-StyleExample">
      <div className="StyleGuidePage-header">
        <h3>{this.props.header}</h3>
      </div>
      <div className="StyleGuidePage-StyleExample-content">{this.props.children}</div>
      {sourceCode}
    </div>
  }
}

const SourceCode = (props) =>
  <code className="StyleGuidePage-SourceCode">{props.code}</code>
