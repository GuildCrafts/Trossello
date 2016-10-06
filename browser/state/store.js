import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'
import reducer from './reducers'

const logger = createLogger({
  collapsed: true
});
const store = process.env.NODE_ENV === 'development' ?
  createStore(reducer, applyMiddleware(thunk, promise, logger)) :
  createStore(reducer)
;

export default store
