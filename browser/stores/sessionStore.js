import Store from 'Store'

const sessionStore = new Store({
  initialValue: {
    loading: true
  },
  fetch(){
    return this.getJSON('/session')
  }
})

sessionStore.load()

export default sessionStore
