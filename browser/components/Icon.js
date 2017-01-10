import React, { Component } from 'react'
import './Icon.sass'

const Sizes = ['fa-sm','','fa-lg','fa-2x','fa-3x','fa-4x','fa-5x']

const Icon = (props) => {
  let size = Number(props.size)
  if (isNaN(size)) size = 1
  const iProps = Object.assign({}, props)
  delete iProps.size
  delete iProps.type
  iProps.className = `Icon fa fa-${props.type} ${Sizes[size]} ${props.className||''}`
  return <i {...iProps}>{props.children}</i>
}

export default Icon
