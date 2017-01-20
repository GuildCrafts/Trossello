import React from 'react'
import StyleExample from './StyleExample'
import PopoverMenuButton from '../PopoverMenuButton'

const PopoverMenuButtonSection = (props) => {
  const sourceCode = `
    <PopoverMenuButton popover={popover}>
      PopoverMenuButton
    </PopoverMenuButton>
  `
  const popover=<div className="StyleGuidePage-StyleExample-popoverExample">
    Here is a popover
  </div>

  return <StyleExample header="PopoverMenuButton" sourceCode={sourceCode}>
    <ul className="StyleGuidePage-StyleExample-Elements">
      <li>
        <PopoverMenuButton popover={popover}>
          PopoverMenuButton
        </PopoverMenuButton>
      </li>
    </ul>
  </StyleExample>
}

export default PopoverMenuButtonSection
