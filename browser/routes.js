import React, { Component } from 'react'
import PresentationalComponent from './components/PresentationalComponent'

import HomePage from './components/HomePage'
import BoardShowPage from './components/BoardShowPage'
import NotFound from './components/NotFound'


const Main = PresentationalComponent((props) => {
  const { auth } = props.state
  return  auth.isFetching ?
    <div>Loading...</div> :
   props.children
})

export default {
  path: '/',
  component: Main,
  indexRoute: {
    component: HomePage,
  },
  childRoutes: [
    {
      path: 'boards/:boardId',
      component: BoardShowPage,
    },
    {
      path: '**',
      component: NotFound,
    },
  ]
}
