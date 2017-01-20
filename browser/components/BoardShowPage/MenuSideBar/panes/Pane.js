import React from 'react'

const Pane = (props) => {
  const className = `BoardShowPage-MenuSideBar-Pane BoardShowPage-MenuSideBar-${props.name}Pane`
  return <div className={className}>
    {props.children}
  </div>
}

export default Pane
