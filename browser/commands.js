import $ from 'jquery'
import boardsStore from './stores/boardsStore'
import boardStore from './stores/boardStore'
import sessionStore from './stores/sessionStore'
import createStoreProvider from './components/createStoreProvider'

// helpers:

const reloadSessionStore = result => {
  sessionStore.reload()
  return result
}

const reloadBoardsStore = result => {
  boardsStore.reload()
  return result
}

const reloadBoardStore = result => {
  boardStore.reload()
  return result
}

const post = (path, data) =>
  $.ajax({
    method: 'post',
    url: path,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(data)
  })


// commands:

const logout = () =>
  post('/logout').then(() => {
    // reload to the homepage
    location.assign('/')
  })

const boardsDropdownToggle = user =>
  post(`/api/users/${user.id}/${user.boards_dropdown_lock ? 'unlock' : 'lock'}dropdown`)
    .then(reloadSessionStore)

const moveList = (listId, boardId, order) =>
  post(`/api/lists/${listId}/move`, {
    boardId: boardId,
    order: order,
  })
    .then(reloadBoardStore)

const moveCard = (cardId, boardId, listId, order) =>
  post(`/api/cards/${cardId}/move`, {
    boardId: boardId,
    listId: listId,
    order: order,
  })
    .then(reloadBoardStore)

const toggleStar = (boardId, starred) =>
  post(`/api/boards/${boardId}/${ starred ? 'unstar' : 'star'}`)
    .then(reloadBoardStore)
    .then(reloadBoardsStore)

const search = (searchTerm) =>
  post("/api/boards/search", {searchTerm})

const createBoard = (board) =>
  post('/api/boards', board)
    .then(reloadBoardsStore)

const createEmailInvite = (boardId, email) =>
  post(`/api/invites/${boardId}`, {email})

const duplicateList = (boardId, listId, name) =>
  post(`/api/boards/${boardId}/lists/${listId}/duplicate`, {name})
    .then(reloadBoardStore)

const moveCardsToList = (oldListId, newListId) =>
  post(`/api/lists/${oldListId}/cards/move-to/${newListId}`)
    .then(reloadBoardStore)

const archiveCardsInList = (listId) =>
  post(`/api/lists/${listId}/archivecards`)
    .then(reloadBoardStore)

const archiveList = (listId) =>
  post(`/api/lists/${listId}/archive`)
    .then(reloadBoardStore)

const updateCard = (cardId, updates) =>
  post(`/api/cards/${cardId}`, updates)
    .then(reloadBoardStore)

const updateListName = (listId, name) =>
  post(`/api/lists/${listId}`, {name})
    .then(reloadBoardStore)

const createCard = (boardId, listId, card) =>
  post(`/api/boards/${boardId}/lists/${listId}/cards`, card)
    .then(reloadBoardStore)

const archiveRecord = (resource, id) =>
  post(`/api/${resource}/${id}/archive`)
    .then(reloadBoardStore)

const unarchiveRecord = (resource, id) =>
  post(`/api/${resource}/${id}/unarchive`)
    .then(reloadBoardStore)

const createList = (boardId, newList) =>
  post(`/api/boards/${boardId}/lists`, newList)
    .then(reloadBoardStore)

const updateBoardName = (boardId, name) =>
  post(`/api/boards/${boardId}`, {name})
    .then(reloadBoardStore)

const updateBoardColor = (boardId, background_color) =>
  post(`/api/boards/${boardId}`, {background_color})
    .then(reloadBoardStore)
    .then(reloadBoardsStore)

const archiveBoard = (boardId) =>
  post(`/api/boards/${boardId}/archive`)
    .then(reloadBoardsStore)

const leaveBoard = (boardId) =>
  post(`/api/boards/${boardId}/leave`,)
    .then(reloadBoardsStore)

const unarchiveCard = (id) =>
  post(`/api/cards/${id}/unarchive`)
    .then(reloadBoardStore)

const deleteCard = (id) =>
  post(`/api/cards/${id}/delete`)
    .then(reloadBoardStore)

const unarchiveList = (id) =>
  post(`/api/lists/${id}/unarchive`)
    .then(reloadBoardStore)

const archiveCard = (id) =>
  post(`/api/cards/${id}/archive`)
    .then(reloadBoardStore)

const updateCardAttribute = (cardId, content) =>
  post(`/api/cards/${cardId}`, Object.assign({}, content))
    .then(reloadBoardStore)

const addOrRemoveLabel = (cardId, labelId) =>
  post(`/api/cards/${cardId}/labels/${labelId}`)
    .then(reloadBoardStore)

const deleteLabel = (boardId, labelId) =>
  post(`/api/boards/${boardId}/labels/${labelId}/delete`)
    .then(reloadBoardStore)

const updateLabel = (boardId, labelId, data) =>
  post(`/api/boards/${boardId}/labels/${labelId}`, data)
    .then(reloadBoardStore)

const createLabel = (boardId, data) =>
  post(`/api/boards/${boardId}/labels`, data)
    .then(reloadBoardStore)

const newCardForm = (boardId, listId, card) =>
  post(`/api/boards/${boardId}/lists/${listId}/cards`, card)
    .then(reloadBoardStore)

const addComment = (cardId, userId, content) =>
  post(`/api/cards/${cardId}/comments`, {
    userId: userId,
    content: content,
  })
    .then(reloadBoardStore)

const updateComment = (cardId, commentId, content) =>
  post(`/api/cards/${cardId}/comments/${commentId}`, {
    content: content
  })
    .then(reloadBoardStore)

const deleteComment = (cardId, commentId) =>
  post(`/api/cards/${cardId}/comments/${commentId}/delete`)
    .then(reloadBoardStore)

const editCardForm = (cardId, content) =>
  post(`/api/cards/${cardId}`, {
    content: content
  })
    .then(reloadBoardStore)

const removeUserFromCard = (userId, cardId, boardId) =>
  post(`/api/cards/${cardId}/users/remove`, {
    boardId,
    targetId: userId
  })
    .then(reloadBoardStore)

const addUserToCard = (userId, cardId, boardId) =>
  post(`/api/cards/${cardId}/users/add`, {
    boardId,
    targetId: userId
  })
    .then(reloadBoardStore)

export default {
  logout,
  boardsDropdownToggle,
  moveList,
  moveCard,
  toggleStar,
  search,
  createBoard,
  createEmailInvite,
  duplicateList,
  moveCardsToList,
  archiveCardsInList,
  archiveList,
  updateCard,
  updateListName,
  createCard,
  archiveRecord,
  unarchiveRecord,
  createList,
  updateBoardName,
  updateBoardColor,
  archiveBoard,
  leaveBoard,
  unarchiveCard,
  deleteCard,
  unarchiveList,
  archiveCard,
  updateCardAttribute,
  addOrRemoveLabel,
  deleteLabel,
  updateLabel,
  createLabel,
  newCardForm,
  addComment,
  updateComment,
  deleteComment,
  editCardForm,
  removeUserFromCard,
  addUserToCard,
}
