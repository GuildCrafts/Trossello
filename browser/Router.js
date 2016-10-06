import React from 'react'
import SimpleReactRouter from 'simple-react-router'

// Pages
import NotFound from './components/NotFound'
import HomePage from './components/HomePage'
import BoardShowPage from './components/BoardShowPage'

export default class Router extends SimpleReactRouter {
  getRoutes(map){
    map('/',                HomePage)
    map('/boards/:boardId', BoardShowPage)
    map('*path',            NotFound)
  }
}
