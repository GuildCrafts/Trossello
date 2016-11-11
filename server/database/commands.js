import knex from './knex'
import queries from './queries'
import mailer from '../mailer'

const firstRecord = records => records[0]

const createRecord = (table, attributes) =>
  knex
    .table(table)
    .insert(attributes)
    .returning('*')
    .then(firstRecord)


const updateRecord = (table, id, attributes) =>
  knex
    .table(table)
    .where('id', id)
    .update(attributes)
    .returning('*')
    .then(firstRecord)

const deleteRecord = (table, id) =>
  knex
    .table(table)
    .where('id', id)
    .del()


const removeUserFromBoard = (userId, boardId) =>
  knex
    .table('user_boards')
    .where({'user_id': userId , 'board_id': boardId})
    .del()

const archiveRecord = (table, id) =>
  knex
    .table(table)
    .where('id', id)
    .update({
      archived: true,
    })

const unarchiveRecord = (table, id) =>
  knex
    .table(table)
    .where('id', id)
    .update({
      archived: false,
    })

const archiveListItems = (id) =>
  knex
    .table('cards')
    .where('list_id', id)
    .update({
      archived: true,
    })

const unarchiveListItems = (id) =>
  knex
    .table('cards')
    .where('list_id', id)
    .update({
      archived: false,
    })

const findOrCreateUserFromGithubProfile = (githubProfile) => {
  const github_id = githubProfile.id
  const userAttributes = {
    github_id: github_id,
    name: githubProfile.name,
    email: githubProfile.email,
    avatar_url: githubProfile.avatar_url,
  }
  return knex.table('users').where('github_id', github_id).first('*')
    .then(user => user ? user : createUser(userAttributes))
}

const createUser = (attributes) =>
  createRecord('users', attributes)
    .then(user =>
      mailer.sendWelcomeEmail(user)
        .then(() => user )
    )

const updateUser = (id, attributes) =>
  updateRecord('users', id, attributes)


const deleteUser = (id) =>
  deleteRecord('users', id)


//

const createList = (attributes) => {
  return createRecord('lists', attributes)
}

const updateList = (id, attributes) =>
  updateRecord('lists', id, attributes)


const deleteList = (id) =>
  Promise.all([
    deleteRecord('lists', id),
    knex.table('cards').where('list_id', id).del(),
  ])

//

const createCard = (attributes) => {
  return knex
    .table('cards')
    .where({list_id: attributes.list_id})
    .orderBy('order', 'desc')
    .limit(1)
    .then( ([result]) => {
      attributes.order = result ? result.order + 1 : 0
      return knex
        .table('cards')
        .insert(attributes)
        .returning('*')
        .then(firstRecord)
    })
}

const updateCard = (id, attributes) =>
  updateRecord('cards', id, attributes)

const deleteCard = (id) =>
  deleteRecord('cards', id)

const archiveCard = (id) =>
  archiveRecord('cards', id)

const unarchiveCard = (id) =>
  unarchiveRecord('cards', id)

const moveCard = ({ boardId, cardId, listId, order }) => {
  return knex
    .table('cards')
    .where({board_id: boardId})
    .orderBy('order', 'asc')
    .then(allCards => {

      const cardBegingMoved = allCards.find(card => card.id === cardId)
      const originalOrder = cardBegingMoved.order
      const newOrder = order
      const originListId = cardBegingMoved.list_id
      const destinationListId = listId
      const cardsOnOriginList = allCards.filter(card => card.list_id === originListId)

      allCards = allCards.filter(card =>
        card.list_id === originListId || card.list_id === destinationListId
      )

      const sortBefore = originListId !== destinationListId || originalOrder > newOrder
      console.log('sortBefore', sortBefore)

      const changes = allCards.map(card => {
        return {
          id: card.id,
          list_id: card.list_id,
          order: card.order,
        }
      })
      console.log('initial state', changes)

      changes.forEach(card => {
        if (card.id !== cardId) return
        card.list_id = listId
        card.order = order
      })

      const originalListCards = changes.filter(card => card.list_id === originListId)
      const destinationListCards = originListId === destinationListId ? [] :
        changes.filter(card => card.list_id === destinationListId)

      console.log('originalListCards', originalListCards)
      console.log('destinationListCards', destinationListCards)

      const magicSort = (a, b) => {
        if (a.order < b.order) return -1
        if (a.order > b.order) return 1
        console.log('---> same comparison', a, b)
        if (a.id === cardId) return sortBefore ? -1 : 1
        if (b.id === cardId) return sortBefore ? 1 : -1
        return 0
      }

      originalListCards
        .sort(magicSort)
        .forEach((card, index) => card.order = index)
      destinationListCards
        .sort(magicSort)
        .forEach((card, index) => card.order = index)

      console.log('originalListCards', originalListCards)
      console.log('destinationListCards', destinationListCards)

      const updates = originalListCards.concat(destinationListCards).map(card =>
        updateCard(card.id, {
          list_id: card.list_id,
          order: card.order,
        })
      )

      return Promise.all(updates)
    })
}

const archiveList = (id) =>
  Promise.all([
    archiveListItems(id),
    archiveRecord('lists', id)
  ])

const unarchiveList = (id) =>
  Promise.all([
    unarchiveRecord('lists', id),
    unarchiveListItems(id)
  ])

const archiveBoard = (id) =>
  archiveRecord('boards', id)

const unarchiveBoard = (id) =>
  unarchiveRecord('boards', id)

const createBoard = (userId, attributes) => {
  if (!attributes.background_color) delete attributes.background_color
  return createRecord('boards', attributes).then(board => {
    let attrs = {
      user_id: userId,
      board_id: board.id,
    }
    return createRecord('user_boards', attrs).then(() => board)
  })
}

const addUserToBoard = (userId, boardId) => {
  let attrs = {
    user_id: userId,
    board_id: boardId,
  }
  return knex.table('user_boards')
    .select('*')
    .where({
      user_id: userId,
      board_id: boardId
    })
    .whereNotExists( function() {
      this.select('*')
      .from('user_boards')
      return createRecord('user_boards', attrs)
    })
}


const updateBoard = (id, attributes) =>
  updateRecord('boards', id, attributes)

const deleteBoard = (boardId) =>
  Promise.all([
    deleteRecord('boards', boardId),
    knex.table('user_boards').where('board_id', boardId).del(),
  ]).then(results => results[0] + results[1])

const createInvite = (attributes) =>
  createRecord('invites', attributes)
    .then( invite =>
      mailer.sendInviteEmail( invite )
        .then(() => invite)
    )

const searchQuery = ( userId, searchTerm ) => {
  return queries.getSearchResult(userId, searchTerm)
  .then(result => {
    return result
  })
}

export default {
  createUser,
  updateUser,
  deleteUser,
  findOrCreateUserFromGithubProfile,
  createList,
  updateList,
  deleteList,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  createBoard,
  updateBoard,
  deleteBoard,
  archiveCard,
  unarchiveCard,
  archiveList,
  unarchiveList,
  archiveBoard,
  unarchiveBoard,
  createInvite,
  addUserToBoard,
  searchQuery,
  removeUserFromBoard,
}
