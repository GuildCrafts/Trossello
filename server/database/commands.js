import knex from './knex'
import queries from './queries'
import mailer from '../mailer'
import uuid from 'uuid'

const firstRecord = records => records[0]

const createRecord = (table, attributes) =>
  knex
    .table(table)
    .insert(attributes)
    .returning('*')
    .then(firstRecord)


const updateRecord = (table, id, attributes) => {
  return knex
    .table(table)
    .where('id', id)
    .update(attributes)
    .returning('*')
    .then(firstRecord)
}

const deleteRecord = (table, id) =>
  knex
    .table(table)
    .where('id', id)
    .del()



const ACTIVITY_TYPES = [
  'JoinedBoard',
  'InvitedToBoard',
  'UpdatedBoard',
  'AddedCard',
  'MovedCard',
  'ArchivedCard',
  'UnarchivedCard',
  'AddedList',
  'CreatedBoard',
  'ArchivedList',
  'UnarchivedList',
  'DeletedCard',
]

const recordActivity = (attributes) => {
  if (!ACTIVITY_TYPES.includes(attributes.type))
    throw new Error(`invalid activity type ${attributes.type}`)
  attributes.metadata = JSON.stringify(attributes.metadata || {})
  return createRecord('activity', attributes)
}




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
      updated_at: new Date(),
    })
    .returning('*')
    .then(firstRecord)

const unarchiveRecord = (table, id) =>
  knex
    .table(table)
    .where('id', id)
    .update({
      archived: false,
      updated_at: new Date(),
    })
    .returning('*')
    .then(firstRecord)

const archiveListItems = (currentUserId, id) =>
  knex
    .table('cards')
    .where('list_id', id)
    .update({
      archived: true,
      updated_at: new Date(),
    })
    .returning('*')
    .then(cards => Promise.all(
      cards.map(card =>{
        recordActivity({
          type: 'ArchivedCard',
          user_id: currentUserId,
          board_id: card.board_id,
          card_id: card.id,
          metadata: {
            content: card.content
          }
        })
      })
    ))


const unarchiveListItems = (currentUserId, id) =>
  knex
    .table('cards')
    .where('list_id', id)
    .update({
      archived: false,
      updated_at: new Date(),
    })
    .returning('*')
    .then(cards => Promise.all(
      cards.map(card =>{
        recordActivity({
          type: 'UnarchivedCard',
          user_id: currentUserId,
          board_id: card.board_id,
          card_id: card.id,
        })
      })
    ))

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

const updateUser = (id, attributes) =>{
  attributes.updated_at = new Date()
  return updateRecord('users', id, attributes)
}

const deleteUser = (id) =>
  deleteRecord('users', id)

const lockDropdown = (id) =>
  knex
    .table('users')
    .where('id', id)
    .update({
      boards_dropdown_lock: true,
    })

const unlockDropdown = (id) =>
  knex
    .table('users')
    .where('id', id)
    .update({
      boards_dropdown_lock: false,
    })

const createList = (currentUserId, attributes) => {
  return knex
    .table('lists')
    .where('board_id', attributes.board_id)
    .count()
    .then(results =>
      createRecord('lists', {...attributes, order: results[0].count})
    )
    .then( list =>
      recordActivity({
        type: 'AddedList',
        user_id: currentUserId,
        board_id: list.board_id,
        metadata: {
          'list_id': list.id,
          'list_name': list.name
        }
      }).then( () => list)
    )
}

const updateList = (id, attributes) =>
  updateRecord('lists', id, attributes)

const copyCardsFromListToList = (oldListId, newListId) =>
  knex.table('cards')
    .where('list_id', oldListId)
    .where('archived', false)
    .then(oldCards => {
      const newCards = oldCards.map(oldCard => {
        const newCard = Object.assign({}, oldCard)
        delete newCard.id
        newCard.list_id = newListId
        return newCard
      })
      return knex.table('cards').insert(newCards).returning('*')
        .then(newCards =>
          Promise.all(
            newCards.map((newCard, index) =>
              knex.raw(
                `
                  INSERT INTO
                    card_labels (card_id, label_id)
                  SELECT
                    ?, label_id
                  FROM
                    card_labels
                  WHERE
                    card_id=?
                  RETURNING
                    *
                `,
                [newCard.id, oldCards[index].id]
              )
            )
          )
        )
    })


const duplicateList = (userId, boardId, listId, name) =>
  Promise.all([
    queries.getListById(listId),
    createList(userId, {name: name, board_id: boardId}),
  ])
  .then( ([oldList, newList]) =>
    copyCardsFromListToList(oldList.id, newList.id)
      .then( () =>
        moveList({
          boardId: boardId,
          listId: newList.id,
          order: oldList.order + 1,
        })
      )
      .then( () => newList )
  )

const deleteList = (id) =>
  Promise.all([
    deleteRecord('lists', id),
    knex.table('cards').where('list_id', id).del(),
  ])

const createCard = (currentUserId, attributes) => {
  let order = null
  if (attributes.hasOwnProperty('order')) {
    order = attributes.order
  }
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
    .then( card => {
      if (order === null) return card
      card.order = order
      return moveCard(currentUserId, {
        boardId: card.board_id,
        cardId: card.id,
        listId: card.list_id,
        order: order
      }, true).then(_ => card)
    })
    .then( card => {
      return recordActivity({
        type: 'AddedCard',
        user_id: currentUserId,
        board_id: card.board_id,
        card_id: card.id,
        metadata: {content: card.content}
      }).then( () => card)
    })
}

const updateCard = (id, attributes) =>
  updateRecord('cards', id, attributes)

const moveAllCards = (fromListId, toListId) =>
  knex
    .table('cards')
    .select('*')
    .whereIn('list_id', [fromListId, toListId])
    .then(cards => {
      const fromListCards = cards.filter(card => card.list_id === fromListId)
      const toListCards = cards.filter(card => card.list_id === toListId)
      const orderOffset = toListCards.length === 0 ?
        0 :
        toListCards.sort((a,b) => b.order - a.order)[0].order + 1

      return knex.raw(`
        UPDATE
          cards
        SET
          list_id = ?,
          "order" = "order" + ?
        WHERE
          list_id = ?
        `,
        [toListId, orderOffset, fromListId]
      )
    })


const deleteCard = (currentUserId, boardId, id) =>
  deleteRecord('cards', id)
    .then( _ => deleteAllActivityByCardId(id))
      .then( _ =>
        recordActivity({
          type: 'DeletedCard',
          user_id: currentUserId,
          board_id: boardId,
          card_id: id
        })
      )

const deleteAllActivityByCardId = (cardId) =>
  knex.table('activity').select('*').where('card_id', cardId).del()

const archiveCard = (currentUserId, id) =>
  archiveRecord('cards', id)
    .then(card =>
      recordActivity({
        type: 'ArchivedCard',
        user_id: currentUserId,
        board_id: card.board_id,
        card_id: card.id,
        metadata: {
          content: card.content
        }
      }).then( () => card)
    )

const unarchiveCard = (currentUserId, id) =>
  unarchiveRecord('cards', id)
    .then( card =>
      recordActivity({
        type: 'UnarchivedCard',
        user_id: currentUserId,
        board_id: card.board_id,
        card_id: card.id,
        metadata: {
          content: card.content
        }
      }).then( () => card)
    )

const sortBoardItems = (unsortedItems, itemId, sortBefore) => {
  const subSort = (a, b) => {
    if (a.order < b.order) return -1
    if (a.order > b.order) return 1
    if (a.id === itemId) return sortBefore ? -1 : 1
    if (b.id === itemId) return sortBefore ? 1 : -1
    return 0
  }

  unsortedItems.sort(subSort)
}

const moveCard = (currentUserId, {boardId, cardId, listId, order }, dontRecordActivity) => {
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

      const changes = allCards.map(card => {
        return {
          id: card.id,
          list_id: card.list_id,
          order: card.order,
        }
      })

      changes.forEach(card => {
        if (card.id !== cardId) return
        card.list_id = listId
        card.order = order
      })

      const originalListCards = changes.filter(card => card.list_id === originListId)
      const destinationListCards = originListId === destinationListId ? [] :
        changes.filter(card => card.list_id === destinationListId)


      sortBoardItems(originalListCards, cardId, sortBefore)
      originalListCards.forEach((card, index) => card.order = index)

      sortBoardItems(destinationListCards, cardId, sortBefore)
      destinationListCards.forEach((card, index) => card.order = index)

      const updates = originalListCards.concat(destinationListCards).map(card =>
        updateCard(card.id, {
          list_id: card.list_id,
          order: card.order,
        })
      )

      return Promise.all(updates)
        .then(updates => {
          const card = updates.find( update => update.id === cardId )
          if (dontRecordActivity || originListId === listId) return updates
          return recordActivity({
            type: 'MovedCard',
            user_id: currentUserId,
            board_id: boardId,
            card_id: cardId,
            metadata: {
              prev_list_id: originListId,
              new_list_id: listId,
              content: card.content
            }
          }).then(() => updates)
        })
    })
}

const moveList = ({ boardId, listId, order }) => {
  return knex
    .table('lists')
    .where({board_id: boardId})
    .orderBy('order', 'asc')
    .then(allLists => {
      const listBeingMoved = allLists.find(list => list.id === listId)
      const originalOrder = listBeingMoved.order
      const newOrder = order

      const sortBefore = originalOrder > newOrder

      const changes = allLists.map(list => {
        return {
          id: list.id,
          order: list.order
        }
      })

      changes.forEach(list => {
        if (list.id != listId) return
        list.order = order
      })

      sortBoardItems(changes, listId, sortBefore)
      changes.forEach((list, index) => list.order = index)

      const updates = changes.map( list =>
        updateList(list.id, {
          order: list.order
        })
      )

      return Promise.all(updates)
    })
}

const archiveList = (currentUserId, id) =>
  Promise.all([
    archiveListItems(currentUserId, id),
    archiveRecord('lists', id)
  ])
  .then( results => {
    recordActivity({
      type: 'ArchivedList',
      user_id: currentUserId,
      board_id: results[1].board_id,
      metadata: {
        list_id: id,
        list_name: results[1].name
      }
    }).then( () => results[1])
  })

const unarchiveList = (currentUserId, id) =>
  Promise.all([
    unarchiveListItems(currentUserId, id),
    unarchiveRecord('lists', id)
  ])
  .then( results => {
    recordActivity({
      type: 'UnarchivedList',
      user_id: currentUserId,
      board_id: results[1].board_id,
      metadata: {
        list_id: id,
        list_name: results[1].name
      }
    }).then( () => results[1])
  })

const archiveCardsInList = (currentUserId, id) =>
  archiveListItems(currentUserId, id)

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
  .then( board => {
    return recordActivity({
      type: 'CreatedBoard',
      user_id: userId,
      board_id: board.id,
      metadata: {board_name: board.name}
    }).then( () => board)
  })
}

const addUserToBoard = (userId, boardId) => {
  const insert = knex
    .table('user_boards')
    .insert({
      user_id: userId,
      board_id: boardId
    })

  return knex.raw(`${insert} ON CONFLICT DO NOTHING RETURNING *`)
    .then( data => {
      return recordActivity( {
        type: 'JoinedBoard',
        user_id: userId,
        board_id: boardId,
      })
    })
}

const starBoard = (id) =>
  knex
    .table('boards')
    .where('id', id)
    .update({
      starred: true
    })

const unstarBoard = (id) =>
  knex
    .table('boards')
    .where('id', id)
    .update({
      starred: false
    })

const updateBoard = (currentUserId, boardId, attributes) => {
  let updatedBoardValue
  return queries.getBoardById(boardId)
    .then(prevBoard => {
      return updateRecord('boards', boardId, attributes)
        .then( board => {
          const activityInserts = []

          if (attributes.hasOwnProperty('name') && prevBoard.name !== attributes.name ){
            activityInserts.push(
              recordActivity({
                type: 'UpdatedBoard',
                board_id: boardId,
                user_id: currentUserId,
                metadata: {
                  attribute_updated: 'name',
                  prev_board_name: prevBoard.name,
                  new_board_name: board.name
                }
              })
            )
          }

          if (attributes.hasOwnProperty('background_color') && prevBoard.background_color !== attributes.background_color ){
            activityInserts.push(
              recordActivity({
                type: 'UpdatedBoard',
                board_id: boardId,
                user_id: currentUserId,
                metadata: {
                  attribute_updated: 'background_color'
                }
              })
            )
          }

          return Promise.all(activityInserts).then(() => board)
        })
    })
}

const deleteBoard = (boardId) =>
  Promise.all([
    deleteRecord('boards', boardId),
    knex.table('user_boards').where('board_id', boardId).del(),
  ]).then(results => results[0] + results[1])

const createInvite = (currentUserId, attributes) => {
  attributes.token = uuid.v1()
  return createRecord('invites', attributes)
    .then( invite =>
      Promise.all([
        recordActivity({
          type: 'InvitedToBoard',
          board_id: invite.boardId,
          user_id: currentUserId,
          metadata: {
            invited_email: invite.email
          }
        }),
        mailer.sendInviteEmail( invite )
      ]).then( () => invite)
    )
}

const searchQuery = ( userId, searchTerm ) => {
  return queries.getSearchResult(userId, searchTerm)
  .then(result => {
    return result
  })
}

const createLabel = (attributes) =>
  createRecord('labels',attributes)

const updateLabel = (labelId, attributes) =>
  updateRecord('labels', labelId, attributes)

const deleteLabel = (labelId) =>
  Promise.all([
    deleteRecord('labels', labelId),
    knex.table('card_labels').where('label_id', labelId).del(),
  ])

const addOrRemoveCardLabel = (cardId, labelId) => {
  const attributes = {card_id: cardId, label_id: labelId}

  return knex.table('card_labels')
    .select('*')
    .where(attributes)
    .returning('*')
    .then( result => {
      if (result.length === 0) {
        return createRecord('card_labels', attributes)
      } else {
        return knex.table('card_labels')
        .select('*')
        .where(attributes)
        .del()
      }
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
  duplicateList,
  createCard,
  updateCard,
  moveAllCards,
  deleteCard,
  moveCard,
  moveList,
  createBoard,
  updateBoard,
  deleteBoard,
  archiveCard,
  unarchiveCard,
  archiveList,
  unarchiveList,
  archiveBoard,
  unarchiveBoard,
  archiveCardsInList,
  starBoard,
  unstarBoard,
  createInvite,
  addUserToBoard,
  searchQuery,
  removeUserFromBoard,
  lockDropdown,
  unlockDropdown,
  addOrRemoveCardLabel,
  createLabel,
  updateLabel,
  deleteLabel,
  recordActivity,
}
