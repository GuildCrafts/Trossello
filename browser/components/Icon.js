import React, { Component } from 'react'

const Sizes = ['','fa-lg','fa-2x','fa-3x','fa-4x','fa-5x']

const Icon = ({children, type, size}) => {
  size = Number(size || 0)
  let className = `fa fa-${type} ${Sizes[size]}`
  return <i className={className}>{children}</i>
}

export default Icon
