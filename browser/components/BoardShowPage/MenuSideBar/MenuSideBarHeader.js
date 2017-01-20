import React from 'react'
import Link from '../../Link'
import Icon from '../../Icon'

const MenuSideBarHeader = (props) => {
  const goBackLink = props.panes.length === 0 ? null :
    <Link className="BoardShowPage-MenuSideBar-MenuSideBarHeader-link" onClick={props.goBack}><Icon type="arrow-left" /></Link>

  return <div className="BoardShowPage-MenuSideBar-MenuSideBarHeader">
    {goBackLink}
    <span>{props.panes[0] || 'Menu'}</span>
    <Link onClick={props.onClose} className="BoardShowPage-MenuSideBar-MenuSideBarHeader-link">
      <Icon type="times" />
    </Link>
  </div>
}

export default MenuSideBarHeader
