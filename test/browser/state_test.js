const { expect } = require('../setup')
import { store, actions } from '../../browser/state'

describe('browser.state', () => {

  it('should work', () => {
    // expect(store.getState()).to.eql({})
    expect(store.getState().auth).to.eql({
      "errorMessage": undefined,
      "isAuthenticated": false,
      "isFetching": true,
      "user": undefined,
    })
    store.dispatch({
      type: 'SESSION_LOADED',
      user: {
        name: 'Peter Parker',
      }
    })
    expect(store.getState().auth).to.eql({
      "errorMessage": undefined,
      "isAuthenticated": true,
      "isFetching": false,
      "user": {
        name: 'Peter Parker',
      },
    })
    store.dispatch({
      type: 'LOGOUT_SUCCESS',
    })
    expect(store.getState().auth).to.eql({
      "errorMessage": undefined,
      "isAuthenticated": false,
      "isFetching": false,
      "user": undefined,
    })
  })

})
