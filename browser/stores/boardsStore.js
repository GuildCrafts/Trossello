import $ from 'jquery'
import Store from 'Store'

const boardsStore = new Store({
  fetch: () => {
    return $.getJSON('/api/boards')
  }
})

export default boardsStore
