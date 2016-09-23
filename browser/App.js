import React from 'react'
import { Router, browserHistory } from 'react-router'
import routes from './routes'

export default () => {
  return <Router history={browserHistory} routes={routes} />
}
