import React, { Component } from 'react'
import { connect } from 'react-redux'

import PresentationalComponent from './components/PresentationalComponent'
import Link from './components/Link'
import NotFound from './components/NotFound'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import BoardsIndexPage from './components/BoardsIndexPage'
import BoardShowPage from './components/BoardShowPage'


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
    component: HomePage
  },
  childRoutes: [
    {
      path: 'login',
      component: LoginPage
    },
    {
      path: 'boards',
      indexRoute: {
        component: BoardsIndexPage
      },
      childRoutes: [
        {
          path: ':boardId',
          component: BoardShowPage
        }
      ]
    },
    {
      path: '**',
      component: NotFound,
    }
  ]
}
