import request from 'request'

export default (dispatch) => {
  request('post', '/logout')
    .then(() => {
      dispatch({
        type: 'LOGOUT_SUCCESS',
      })
    })
    .catch( error => {
      dispatch({
        type: 'LOGOUT_FAIL',
        error: error,
      })
    })
}
