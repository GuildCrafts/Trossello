import React from 'react'
import { Router, browserHistory } from 'react-router'
import routes from './routes'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import Actions from './actions'
const store = createStore(reducer)
const actions = new Actions(store.dispatch)

window.DEBUG = {}
window.DEBUG.reducer = reducer
window.DEBUG.store = store
window.DEBUG.actions = actions

actions.loadSession()



export default () => {
  return <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
}
