import React from 'react'
// import { Router, browserHistory } from 'react-router'
// import routes from './routes'
import Router from './Router'
import { Provider } from 'react-redux'
import state from './state'

state.actions.loadSession()

window.DEBUG = {}
window.DEBUG.state = state
window.DEBUG.store = state.store
window.DEBUG.actions = state.actions

export default () => {
  return <Provider store={state.store}>
    <Router />
  </Provider>
}
