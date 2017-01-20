import React from 'react'
import Link from '../../../Link'
import Icon from '../../../Icon'

const MenuPaneLink = (props) => {
  const { onClick, iconType, children } = props
  return <Link
      className='BoardShowPage-MenuSideBar-PaneButton'
      onClick={onClick}
    >
      <Icon type={iconType} />
      {children}
    </Link>
}

export default MenuPaneLink
