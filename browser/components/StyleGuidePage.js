import React, { Component } from 'react'
import './StyleGuidePage.sass'
import Layout from './Layout'
import ToggleComponent from './ToggleComponent'
import Link from './Link'
import Button from './Button'
import Icon from './Icon'
import Spinner from './Spinner'
import ContentForm from './ContentForm'
import List from './BoardShowPage/List'
import Card from './BoardShowPage/Card'

export default class StyleGuidePage extends Component {
  render(){
    return <div className="StyleGuidePage">
      <h1>Style Guide</h1>
      <SpinnerSection />
      <ButtonsSection />
      <IconsSection />
      <LinksSection />
      <BrandColorsSection />
      <CardsSection />
      <ContentFormSection />
    </div>
  }
}

const ButtonsSection = (props) => {
  const sourceCode = `<Button>A Default Button</Button>
    <Button type="primary">A Primary Button</Button>
    <Button type="danger">A Danger Button</Button>
    <Button onClick={alertClicked}>An Invisible Button</Button>
  `
  return <div>
    <h3>Buttons</h3>
    <StyleExample sourceCode={sourceCode}>
      <ul className="StyleGuidePage-StyleExample-Elements">
        <li><Button>A Default Button</Button></li>
        <li><Button type="primary">A Primary Button</Button></li>
        <li><Button type="danger">A Danger Button</Button></li>
        <li><Button type="invisible" onClick={alertClicked}>An Invisible Button</Button></li>
      </ul>
    </StyleExample>
  </div>
}


const IconsSection = (props) => {
  const sourceCode = `<Icon type='pencil' />
    <Icon type='archive' />
    <Icon type='bell' />
    <Icon type='times' />
    <Icon type='download' />
    <Icon type='square' />
    <Icon type='filter' />
    <Icon type='rocket' />
    <Icon type='sticky-note-o' />
    <Icon type='ellipsis-h' />
    <Icon type='arrow-left' />
    <Icon type='user-plus' />`
  return <div>
    <h3>Icons</h3>
    <StyleExample sourceCode={sourceCode}>
      <ul className="StyleGuidePage-StyleExample-Elements">
        <li><Icon type='pencil' /><p>Edit</p></li>
        <li><Icon type='archive' /><p>Archive</p></li>
        <li><Icon type='bell'/><p>Notifications</p></li>
        <li><Icon type='times' /><p>Delete</p></li>
        <li><Icon type='download' /><p>Export Board</p></li>
        <li><Icon type='square' /><p>Theme Color</p></li>
        <li><Icon type='filter' /><p>Filter Results</p></li>
        <li><Icon type='rocket' /><p>Power Up</p></li>
        <li><Icon type='sticky-note-o' /><p>Stickers</p></li>
        <li><Icon type='ellipsis-h' /><p>More</p></li>
        <li><Icon type='arrow-left' /><p>Leave</p></li>
        <li><Icon type='user-plus' /><p>Add Member</p></li>
        <li><Icon type='search' /><p>Search</p></li>
      </ul>
      <ul className="StyleGuidePage-StyleExample-Elements">
        <li><Link className="Link Secondary-Hover" ><Icon type='archive' /></Link><p>Icon with 'Secondary-Hover' class</p></li>
      </ul>
    </StyleExample>
    <p>****Trosello is using Font Awesome icons and the Icon component is confgured so type attribute is name of any Font Awesome icon without the fa</p>
  </div>
}

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

const BrandColorsSection = (props) => {
  return <div>
    <h3>Brand Colors</h3>
    <StyleExample>
      <ul className="StyleGuidePage-StyleExample-Elements">
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Black"></div></li>
          <li><p>$black</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Medium-Grey"></div></li>
          <li><p>$medium-grey</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Grey"></div></li>
          <li><p>$grey</p></li>
        </ul>
      </ul>
      <ul className="StyleGuidePage-StyleExample-Elements">
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Trosello-Blue"></div></li>
          <li><p>$TroselloBlue</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Green"></div></li>
          <li><p>$green</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Orange"></div></li>
          <li><p>$orange</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Red"></div></li>
          <li><p>$red</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Yellow"></div></li>
          <li><p>$yellow</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Purple"></div></li>
          <li><p>$purple</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Pink"></div></li>
          <li><p>$pink</p></li>
        </ul>
        <ul className="Brand-Colors">
          <li><div className="Brand-Colors-Circle Sky"></div></li>
          <li><p>$sky</p></li>
        </ul>
      </ul>
    </StyleExample>
  </div>
}

const CardsSection = (props) => {
  return <div>
    <h3>Cards</h3>
    <StyleExample sourceCode='<Card editable archivable card={{id: 2, board: 2, list_id: 4}}></Card>'>
      <Card editable archivable card={{id: 2, board_id: 2, list_id: 4, content: "Create Style Guide"}}/>
    </StyleExample>
  </div>
}


const SpinnerSection = (props) => {
  return <div>
    <h3>Spinner</h3>
    <StyleExample sourceCode='<Spinner />'>
      <Spinner />
    </StyleExample>
  </div>
}

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




class StyleExample extends ToggleComponent {
  static closeIfUserClicksOutside = false
  static closeOnEscape = false
  render(){
    const sourceCode = this.state.open ?
      <SourceCode code={this.props.sourceCode} /> :
      <Link onClick={this.open} className="Link Secondary-Hover">source code</Link>
    return <div className="StyleGuidePage-StyleExample">
      <div className="StyleGuidePage-StyleExample-content">{this.props.children}</div>
      {sourceCode}
    </div>
  }
}

// const ColorCircle = (props) =>
//   return

const SourceCode = (props) =>
  <code className="StyleGuidePage-SourceCode">{props.code}</code>

const alertClicked = (event) => {
  event.preventDefault()
  alert('clicked!')
}
