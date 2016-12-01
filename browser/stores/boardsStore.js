import Store from 'Store'

const boardsStore = new Store({
  initialValue: [],
  fetch(){
    return this.getJSON('/api/boards')
  }
})

export default boardsStore
