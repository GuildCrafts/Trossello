import React from 'react'
import StyleExample from './StyleExample'
import ActionsMenu from '../BoardShowPage/ActionsMenu'
import ActionsMenuPane from '../BoardShowPage/ActionsMenuPane'
import Button from '../Button'

const ActionsMenuSection = (props) => {
  const sourceCode = `
    <ActionsMenuPane
      className="StyleGuidePage-StyleExample-ActionsMenu-pane"
      heading="Main Pane"
      onClose={onClose}
    >
      <Button onClick={props.goToPane('Other Pane')}>Go to Other Pane</Button>
    </ActionsMenuPane>

    <ActionsMenuPane
      className="StyleGuidePage-StyleExample-ActionsMenu-pane"
      heading="Other Pane"
      onClose={onClose}
      onBack={props.goToPane('Main Pane')}
    >
      Click Arrow To Go Back
    </ActionsMenuPane>

    <ActionsMenu
      className="StyleGuidePage-StyleExample-ActionsMenu"
      defaultPane="Main Pane"
      panes={{ "Main Pane": MainPane, "Other Pane": OtherPane }}
    />
  `
const onClose = (event) => {
  if (event) event.preventDefault()
  alert("Closing!")
}


const MainPane = (props) => {
  return <ActionsMenuPane className="StyleGuidePage-StyleExample-ActionsMenu-pane" heading="Main Pane" onClose={onClose}>
    <Button onClick={props.goToPane('Other Pane')}>Go to Other Pane</Button>
  </ActionsMenuPane>
}
const OtherPane = (props) => {
  return <ActionsMenuPane className="StyleGuidePage-StyleExample-ActionsMenu-pane" heading="Other Pane" onClose={onClose} onBack={props.goToPane('Main Pane')}>
    Click Arrow To Go Back
  </ActionsMenuPane>
}

  return <StyleExample header="ActionsMenu" sourceCode={sourceCode}>
    <ul className="StyleGuidePage-StyleExample-Elements">
      <li>
        <ActionsMenu
          className="StyleGuidePage-StyleExample-ActionsMenu"
          defaultPane="Main Pane"
          panes={{ "Main Pane": MainPane, "Other Pane": OtherPane }}
        />
      </li>
    </ul>
  </StyleExample>
}

export default ActionsMenuSection
