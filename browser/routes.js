import React, { Component } from 'react'
import { connect } from 'react-redux'

import Link from './components/Link'
import NotFound from './components/NotFound'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import BoardsIndexPage from './components/BoardsIndexPage'
import BoardShowPage from './components/BoardShowPage'



export default {
  path: '/',
  component: (props) => props.children,
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
