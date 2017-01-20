import React from 'react'
import StyleExample from './StyleExample'
import TimeFromNow from '../TimeFromNow'

const TimeFromNowSection = (props) => {
  const sourceCode = `
    <TimeFromNow time="2017-01-20T19:41:10.372Z"/>
  `

  return <StyleExample header="TimeFromNow component" sourceCode={sourceCode}>
    <ul className="StyleGuidePage-StyleExample-Elements">
      <li><TimeFromNow time="2017-01-20T19:41:10.372Z"/></li>
    </ul>
  </StyleExample>
}

export default TimeFromNowSection
