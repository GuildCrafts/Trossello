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
  return knex
    .table('cards')
    .where({list_id: attributes.list_id})
    .count()
    .then( results => {
      attributes.order = results[0].count
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

const moveCard = ({board_id, list_id, card_id, order}) => {
  // move card from old list to new list
  // update order in old list
  // update order in new list
  const new_order = Number(order)
  const dest_list_id = Number(list_id)
  card_id = Number(card_id)

  return knex
    .table('cards')
    .where({board_id})
    .orderBy('order', 'asc')
    .then(cards => {
      const cardToMove = cards.find(card => card.id === card_id)
      if(!cardToMove){
        console.log(JSON.stringify(card_id));
        console.log(JSON.stringify(cards));
      }
      // console.log(cards);
      // console.log('card_id',card_id);
      // console.log('cardtoMove', cardToMove);
      const old_order = cardToMove.order
      // console.log("old_order", old_order);
      const originListId = cardToMove.list_id
      const destinationListId = dest_list_id
      let incrementOrder = card => card.order + 1
      let decrementOrder = card => card.order - 1
      const originPeerCards = cards.filter(card => {
        return card.list_id === cardToMove.list_id && card.id !== cardToMove.id
      })
      const queries = []

      // steps that need to happen
      // case: intra-list move (same list)
      if (originListId === destinationListId) {
        if (new_order === old_order) {
          return null
        }

        // change the order of the card in question
        queries.push(updateCard(card_id, { order: new_order }))

        let cardsToUpdate
        let orderChange

        //  if new order is greater than old order (move down)
        //    for every card with order <= new order, -1
        if (new_order > old_order) {
          cardsToUpdate = originPeerCards.filter(c => c.order <= new_order)
          orderChange = card => card.order - 1
        }
        //  if new order is less than old order (move down)
        //    for every card with order >= new order, +1
         else if (new_order < old_order) {
          cardsToUpdate = originPeerCards.filter(c => c.order >= new_order)
          orderChange = card => card.order + 1
        }

        // update the order of each card in origin list
        cardsToUpdate.forEach(card => {
          queries.push(updateCard(card.id, { order: orderChange(card) }))
        })
      } else {
        let originCardsToUpdate = originPeerCards.filter(card => card.order > old_order)
        let destinationCardsToUpdate = cards.filter(card => {
          return card.id !== card_id && card.list_id === destinationListId && card.order >= new_order
        })
        originCardsToUpdate.forEach(card => {
          queries.push(updateCard(card.id, {order: decrementOrder(card)}))
        })

        destinationCardsToUpdate.forEach(card => {
          queries.push(updateCard(card.id, {order: incrementOrder(card)}))
        })

        queries.push(updateCard(card_id, { order: new_order, list_id: destinationListId }))
      }

      //
      // given list
      // 1 a
      // 2 b
      // 3 c
      //
      // move down
      // 1 a
      // 2 c
      // 3 b
      //
      // move up
      // 1 b
      // 2 a
      // 3 c

      // case: inter-list move (diff lists)
      // change the list id of the card in question
      // update the order of each card in origin list
      //  only those that have an order greater than old order of card
      // update the order of each card in destination list
      //  only those that have an order greater than new order of card


      // moving within the same list ? how are we ensuring this!?
      // cardsOnOriginList.map(card => {
      //   if (card.id === card_id) {
      //     queries.push(updateCard(card_id, {
      //       list_id: dest_list_id, // this could be any list id, not just own list
      //       order: new_order,
      //     }))
      //   } else if (card.order >= new_order) {
      //     queries.push(updateCard(card.id, {
      //       order: card.order + 1,
      //     }))
      //   }
      // })
      //
      // // moving from one list to another
      // if (originListId !== destinationListId){
      //   const cardsOnDestinationList = cards.filter(card => card.list_id === dest_list_id)
      //   cardsOnDestinationList.map(card => {
      //     queries.push(updateCard(card.id, {
      //       order: card.order + 1,
      //     }))
      //   })
      // }

      return Promise.all(queries)
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
