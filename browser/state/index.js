import store from './store'
import actions from './actions'

const getState = store.getState.bind(store)

export {
  store,
  actions,
  getState
}

export default {
  store,
  actions,
  get: getState
}
