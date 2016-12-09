import $ from 'jquery'
import boardsStore from './stores/boardsStore'
import sessionStore from './stores/sessionStore'
import createStoreProvider from './components/createStoreProvider'

const boardsDropdownToggle = user => {
  const locked = user.boards_dropdown_lock
  return $.ajax({
    method: 'post',
    url: `/api/users/${user.id}/${locked ? 'unlock' : 'lock'}dropdown`,
  }).then(() => {
    sessionStore.reload()
  })
}

const moveList = (listId, boardId, order) =>
  $.ajax({
    method: 'post',
    url: `/api/lists/${listId}/move`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
      boardId: boardId,
      order: order,
    })
  }).then(() => {
    boardStore.reload()
  })

const moveCard = (cardId, boardId, listId, order) =>
  $.ajax({
    method: 'post',
    url: `/api/cards/${cardId}/move`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
      boardId: boardId,
      listId: listId,
      order: order,
    }),
  }).then(() => {
    boardStore.reload()
  })

const toggleStar = (boardId, starred, onChange) =>
  $.ajax({
    method: "POST",
    url: `/api/boards/${boardId}/${ starred ? 'unstar' : 'star'}`,
  }).then(() => {
    if (onChange) onChange()
  })

const searchRequest = (searchTerm) =>
  $.ajax({
    method: "POST",
    url: "/api/boards/search",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({searchTerm}),
  })

const createBoard = (board) =>
  $.ajax({
    method: "POST",
    url: '/api/boards',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(board),
  })


const createEmailInvite = (boardId, email) =>
  $.ajax({
    method: "POST",
    url: `/api/invites/${boardId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({email}),
  })

const duplicateList = (boardId, listId, name, onClose) =>
  $.ajax({
    method: 'post',
    url: `/api/boards/${boardId}/lists/${listId}/duplicate`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({name}),
  }).then(() => {
    boardStore.reload()
    onClose()
  })

const moveCardsToList = (oldListId, newListId, onClose) =>
  $.ajax({
    method: 'post',
    url: `/api/lists/${oldListId}/cards/move-to/${newListId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  }).then(() => {
    boardStore.reload()
    onClose()
  })

const archiveCardsInList = (listId) =>
  $.ajax({
    method: "POST",
    url: `/api/lists/${listId}/archivecards`
  }).then(() => {
    boardStore.reload()
  })

const archiveList = (listId) =>
  $.ajax({
    method: "POST",
    url: `/api/lists/${listId}/archive`
  }).then(() => {
    boardStore.reload()
  })

const updateCard = (cardId, updates) =>
  $.ajax({
    method: 'post',
    url: `/api/cards/${card.id}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(updates),
  })

const updateListName = (listId, name) =>
  $.ajax({
    method: 'post',
    url: `/api/lists/${listId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({name})
  })

const createCard = (boardId, listId, card) =>
  $.ajax({
    method: 'post',
    url: `/api/boards/${boardId}/lists/${listId}/cards`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(card),
  }).then(() => {
    boardStore.reload()
  })

const archiveRecord = (resource, id) =>
  $.ajax({
    method: "POST",
    url: `/api/${resource}/${id}/archive`
  }).then(() => {
    boardStore.reload()
  })

const unarchiveRecord = (resource, id) =>
  $.ajax({
    method: "POST",
    url: `/api/${resource}/${id}/unarchive`
  }).then(() => {
    boardStore.reload()
  })

const createList = (boardId, newList, afterCreate) =>
  $.ajax({
    method: "post",
    url: `/api/boards/${boardId}/lists`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(newList),
  }).then(() => {
    boardStore.reload()
    afterCreate()
  })

const updateBoardName = (boardId, name, onClose) =>
  $.ajax({
    method: 'post',
    url: `/api/boards/${boardId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({name}),
  }).then(() => {
    boardStore.reload()
    onClose()
  })

const updateBoardColor = (boardId, background_color) =>
  $.ajax({
    method: 'post',
    url: `/api/boards/${boardId}`,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({background_color}),
  }).then(() => {
    boardStore.reload()
    boardsStore.reload()
  })

const archiveBoard = (boardId, redirect) =>
$.ajax({
  method: "POST",
  url: `/api/boards/${boardId}/archive`,
}).then( () => {
  redirect
  boardsStore.reload()
})

const leaveBoard = (boardId, redirect) =>
  $.ajax({
    method: "POST",
    url: `/api/boards/${boardId}/leave`,
  }).then( () => {
    redirect
    boardsStore.reload()
  })

const unarchiveCard = (id) =>
  $.ajax({
    method: "POST",
    url: `/api/cards/${id}/unarchive`
  }).then(() => {
    boardStore.reload()
  })

const deleteCard = (id, onDelete) =>
  $.ajax({
    method: "POST",
    url: `/api/cards/${id}/delete`
  }).then(() => {
    if(onDelete) onDelete()
    boardStore.reload()
  })

const unarchiveList = (id) =>
  $.ajax({
    method: "POST",
    url: `/api/lists/${id}/unarchive`
  }).then(() => {
    boardStore.reload()
  })

const archiveCard = (id) =>
  $.ajax({
    method: "POST",
    url: `/api/cards/${this.props.card.id}/archive`
  }).then(() =>
    boardStore.reload()
  )

const updateCardName = (cardId, content) =>
  $.ajax({
    method: 'post',
    url: `/api/cards/${cardId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({content}),
  }).then(() => {
    boardStore.reload()
  })

const updateCardDescription = (cardId, description, onClose) =>
  $.ajax({
    method: 'post',
    url: `/api/cards/${cardId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({description}),
  }).then(() => {
    boardStore.reload()
    if(onClose) onClose()
  })

const addOrRemoveLabel = (cardId, labelId) =>
  $.ajax({
    method: 'POST',
    url:`/api/cards/${cardId}/labels/${labelId}`
  })
  .then(() => boardStore.reload())

const deleteLabel = (boardId, labelId, goBack) =>
  $.ajax({
    method: 'POST',
    url: `/api/boards/${boardId}/labels/${labelId}/delete`
  })
  .then(label => {
    boardStore.reload()
    if(goBack) goBack()
  })

const updateLabel = (boardId, labelId, data, goBack) =>
  $.ajax({
    method: 'POST',
    url: `/api/boards/${boardId}/labels/${labelId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(data)
  })
  .then(() => {
    boardStore.reload()
    if (goBack) goBack()
  })

const createLabel = (boardId, data, goBack) =>
  $.ajax({
    method: 'POST',
    url: `/api/boards/${boardId}/labels`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(data)
  })
    .then(() => {
      boardStore.reload()
      goBack()
    })

const copyCard = (boardId, listId, data, onClose) =>
  $.ajax({
    method: 'post',
    url: `/api/boards/${boardId}/lists/${listId}/cards`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(data)
  })
  .then( () => {
    boardStore.reload()
    onClose()
  })

export default {
  boardsDropdownToggle,
  moveList,
  moveCard,
  toggleStar,
  searchRequest,
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
  updateCardName,
  updateCardDescription,
  addOrRemoveLabel,
  deleteLabel,
  updateLabel,
  createLabel,
  copyCard,
}
