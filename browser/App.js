import React from 'react'
import { Router, browserHistory } from 'react-router'
import routes from './routes'


import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
const store = createStore(reducer)


export default () => {
  return <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
}
