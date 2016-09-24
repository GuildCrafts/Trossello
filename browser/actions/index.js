export default class Actions {

  constructor(dispatch){
    this.dispatch = dispatch
  }

  login(creds) {
    console.log('LOGIN ACTION')
    this.dispatch({
      type: 'LOGIN_SUCCESS',
      creds: creds,
      user: {
        name: 'Laura Croft'
      }
    })
  }

  logout() {
    console.log('LOGOUT ACTION')
    this.dispatch({
      type: 'LOGOUT_SUCCESS',
    })
  }

}
