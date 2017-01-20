import React from 'react'
import ConfirmationButton from '../ConfirmationButton'
import ConfirmationLink from '../ConfirmationLink'
import StyleExample from './StyleExample'

const ConfirmationClickablesSection = (props) => {
  const sourceCode = `
  <ConfirmationButton title="Confirmation Button" message="Click a button to confirm." onAbort={onAbort} onConfirm={onConfirm} buttonName="Confirm">Click A Button</ConfirmationButton>
  
  <ConfirmationLink title="Confirmation Link" message="Click a link to confirm." onAbort={onAbort} onConfirm={onConfirm} buttonName="Confirm">Or Click A Link</ConfirmationLink>
  `

  const onConfirm = (event) => {
    if(event) event.preventDefault()
    alert('Confirmed!')
  }

  const onAbort = (event) => {
    if(event) event.preventDefault()
    alert('Aborted!')
  }

  return <StyleExample header="Confirmation Clickables" sourceCode={sourceCode}>
    <ul className= "StyleGuidePage-StyleExample-Elements">
      <li><ConfirmationButton title="Confirmation Button" message="Click a button to confirm." onAbort={onAbort} onConfirm={onConfirm} buttonName="Confirm">Click A Button</ConfirmationButton></li>
      <li><ConfirmationLink title="Confirmation Link" message="Click a link to confirm." onAbort={onAbort} onConfirm={onConfirm} buttonName="Confirm">Click A Link</ConfirmationLink></li>
    </ul>
  </StyleExample>
}

export default ConfirmationClickablesSection
