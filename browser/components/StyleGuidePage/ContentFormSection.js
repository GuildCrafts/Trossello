import React from 'react'
import ContentForm from '../BoardShowPage/ContentForm'
import StyleExample from './StyleExample'

const ContentFormSection = (props) => {
  return <div>
    <h3>ContentForm</h3>
    <StyleExample sourceCode='<ContentForm />'>
      <div style={{backgroundColor: 'lightblue', padding: '10px'}}>
        <ContentForm
          onCancel={_ => alert('canceled') }
          onSave={_ => alert('saved') }
          submitButtonName="Save it!"
          defaultValue="this form submits on enter"
          hideCloseX
          submitOnEnter
        />
      </div>
      <div style={{backgroundColor: 'lightblue', padding: '10px'}}>
        <ContentForm
          onCancel={_ => alert('canceled') }
          onSave={_ => alert('saved') }
          submitButtonName="Save it!"
          defaultValue="this form submits on cmd-enter"
        />
      </div>
    </StyleExample>
  </div>
}

export default ContentFormSection
