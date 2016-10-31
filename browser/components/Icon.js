import './Icon.sass'
import React, { Component } from 'react'

const Sizes = ['fa-sm','','fa-lg','fa-2x','fa-3x','fa-4x','fa-5x']

const Icon = ({className, children, type, size}) => {
  size = Number(size)
  if (isNaN(size)) size = 1
  className = `fa fa-${type} ${Sizes[size]} ${className||''}`
  return <i className={className}>{children}</i>
}

export default Icon
