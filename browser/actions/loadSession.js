import request from 'request'

import { LOADING_SESSION, SESSION_LOADED } from './types'

export default (dispatch) => {
  dispatch({
    type: 'LOADING_SESSION',
  })
  request('get', '/session')
    .then(session => {
      console.log('SESSION LOADED', session)
      dispatch({
        type: 'SESSION_LOADED',
        user: session.user,
      })
    })
    .catch(error => {
      console.log('SESSION LOAD ERROR', error)
      dispatch({
        type: 'SESSION_LOADED',
        error: error,
      })
    })
}
