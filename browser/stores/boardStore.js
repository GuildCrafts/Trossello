import Store from 'Store'

const boardStore = new Store({
  fetch(){
    return this.getJSON('/api/boards/' + this.boardId)
  }
})

boardStore.setBoardId = function (boardId) {
  if (this.boardId !== boardId) {
    this.value = null
    this.boardId = boardId
    this.reload()
  }
}

window.boardStore = boardStore

export default boardStore
