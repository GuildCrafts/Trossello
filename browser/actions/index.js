const request = (path, options={}) => {
  if ('credentials' in options); else {
    options.credentials = 'same-origin'
  }
  return fetch(path, options)
    .then(response => response.json())
}

export default class Actions {

  constructor(dispatch){
    this.dispatch = dispatch
  }

  loadSession(){
    console.log('Action:loadSession')
    request('/session')
      .then(session => {
        console.log('SESSION LOADED', session)
        this.dispatch({
          type: 'SESSION_LOADED',
          user: session.user,
        })
      })
      .catch(error => {
        console.log('SESSION LOAD ERROR', error)
        this.dispatch({
          type: 'SESSION_LOADED',
          error: error,
        })
      })
  }

  logout() {
    console.log('Action:logout')

    request('/logout', {method:'POST'})
      .then(() => {
        this.dispatch({
          type: 'LOGOUT_SUCCESS',
        })
      })
      .catch( error => {
        this.dispatch({
          type: 'LOGOUT_FAIL',
          error: error,
        })
      })
  }

}
