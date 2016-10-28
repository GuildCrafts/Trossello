import knex from './knex'
import queries from './queries'
import { sendWelcomeEmail } from '../mail/mailer'

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
    .then(user => {
      sendWelcomeEmail(user)
      return user
    })

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
  console.log('createCard', attributes)
  return knex.table('cards')
    .where({list_id: attributes.list_id})
    .orderBy('order', 'desc')
    .limit(1)
    .then( ([result]) => {
      attributes.order = result ? result.order + 1 : 0
      console.log('attributes2', attributes)
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
      const originListId = cardBegingMoved.list_id
      const destinationListId = listId
      const cardsOnOriginList = allCards.filter(card => card.list_id === originListId)

      const updates = []

      updates.push(updateCard(cardBegingMoved.id, {
        list_id: destinationListId,
        order: order,
      }))

      if (originListId === destinationListId){
        cardsOnOriginList.forEach(card => {
          if (card !== cardBegingMoved && card.order >= order) {
            updates.push(updateCard(card.id, {
              order: card.order + 1,
            }))
          }
        })
      }else{
        const cardsOnDestinationList = allCards.filter(card =>
          card.list_id === destinationListId
        )
        cardsOnOriginList.forEach(card => {
          if (card !== cardBegingMoved && card.order >= cardBegingMoved.order) {
            updates.push(updateCard(card.id, {
              order: card.order - 1,
            }))
          }
        })
        cardsOnDestinationList.forEach(card => {
          if (card.order >= order) {
            updates.push(updateCard(card.id, {
              order: card.order + 1,
            }))
          }
        })
      }

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

// INVITES
const createInvite = (attributes) =>
  createRecord('invites', attributes)

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
