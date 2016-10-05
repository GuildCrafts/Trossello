import store from '../store'
import eventTypes from '../eventTypes'

// import actions
import loadSession from './loadSession'
import logout from './logout'

const actions = {
  loadSession,
  logout,
}

// dispatch with event type checking
const dispatch = (event) => {
  if (
    typeof event === 'object' &&
    'type' in event &&
    !eventTypes.includes(event.type)
  ) throw new Error('unknown event type '+JSON.stringify(event.type))
  return store.dispatch.call(store, event)
}

// bind actions to the store dispatch method and force logging
const wrapAction = (actionName, actionFunction) => {
  return function(){
    console.log('Action: '+actionName, arguments)
    return actionFunction.apply(this, [dispatch, ...arguments])
  }
}

for (let key in actions) {
  actions[key] = wrapAction(key, actions[key])
}

export default actions
