import React from 'react'
import Button from '../Button'
import StyleExample from './StyleExample'

const ButtonsSection = (props) => {
  const sourceCode = `<Button>A Default Button</Button>
    <Button type="primary">A Primary Button</Button>
    <Button type="danger">A Danger Button</Button>
    <Button onClick={alertClicked}>An Invisible Button</Button>
  `

  const alertClicked = (event) => {
    event.preventDefault()
    alert('clicked!')
  }

  return <StyleExample header="Buttons" sourceCode={sourceCode}>
    <ul className="StyleGuidePage-StyleExample-Elements">
      <li><Button>A Default Button</Button></li>
      <li><Button type="primary">A Primary Button</Button></li>
      <li><Button type="danger">A Danger Button</Button></li>
      <li><Button type="invisible" onClick={alertClicked}>An Invisible Button</Button></li>
    </ul>
  </StyleExample>
}

export default ButtonsSection
