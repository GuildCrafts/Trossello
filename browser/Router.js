import React from 'react'
import SimpleReactRouter from 'simple-react-router'

// Pages
import NotFound from './components/NotFound'
import LoggedInHomepage from './components/HomePage/LoggedInHomepage'
import LoggedOutHomepage from './components/HomePage/LoggedOutHomepage'
import BoardShowPage from './components/BoardShowPage'
import StyleGuidePage from './components/StyleGuidePage'

export default class Router extends SimpleReactRouter {
  getRoutes(map, props){
    if (!props) debugger
    const { session } = props

    if (session.loading){
      map('*path', ()=> <div>loadingzzzzz</div>)
      return
    }

    // logged in routes
    if (session.user){
      map('/',                LoggedInHomepage)
      map('/boards/:boardId', BoardShowPage)
      map('/boards/:boardId/cards/:cardId', BoardShowPage)

    // logged out routes
    }else{
      map('/', LoggedOutHomepage)
    }

    map('/styleguide', StyleGuidePage)
    // catchall route
    map('*path', NotFound)
  }
}
