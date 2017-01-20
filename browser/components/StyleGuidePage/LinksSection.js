import React from 'react'
import Link from '../Link'
import StyleExample from './StyleExample'

const LinksSection = (props) => {
  const sourceCode = `
    <Link to={"/"}>A Regular (to homepage) Link</Link>
    <Link>Add a card...</Link>
  `
  return <StyleExample header="Links" sourceCode={sourceCode}>
      <ul className="StyleGuidePage-StyleExample-Elements">
        <li><Link to={"/"}>A Regular (to homepage) Link</Link></li>
        <li><Link>Add a card...</Link></li>
      </ul>
    </StyleExample>
}

export default LinksSection
