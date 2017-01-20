import React from 'react'
import Link from '../Link'
import StyleExample from './StyleExample'

const LinksSection = (props) => {
  const sourceCode = `
    <Link to={"/"}>A Regular (to homepage) Link</Link>
    <Link>Add a card...</Link>
  `
  return <div>
    <h3>Links</h3>
    <StyleExample sourceCode={sourceCode}>
      <ul className="StyleGuidePage-StyleExample-Elements">
        <li><Link to={"/"}>A Regular (to homepage) Link</Link></li>
        <li><Link>Add a card...</Link></li>
      </ul>
    </StyleExample>
  </div>
}

export default LinksSection
