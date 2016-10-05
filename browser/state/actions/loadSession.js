import request from 'request'

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
