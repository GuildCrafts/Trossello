import Store from 'Store'

const boardsStore = new Store({
  fetch(){
    return this.getJSON('/api/boards')
  }
})

export default boardsStore
