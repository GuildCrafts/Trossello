import React from 'react'
import Icon from '../Icon'
import Link from '../Link'
import StyleExample from './StyleExample'

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
    <StyleExample header="Icons" sourceCode={sourceCode}>
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
    <p>****Trossello is using Font Awesome icons and the Icon component is confgured so type attribute is name of any Font Awesome icon without the fa</p>
  </div>
}

export default IconsSection
