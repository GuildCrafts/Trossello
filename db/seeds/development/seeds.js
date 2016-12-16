const fs = require('fs')
const JSON = require('JSON2')
const seeds = JSON.parse(fs.readFileSync(__dirname+'/seeds.json', 'utf8'))

exports.seed = (knex) => {

  const truncateAllTables = () => {
    return Promise.all([
      knex.truncate('user_boards'),
      knex.truncate('cards'),
      knex.truncate('lists'),
      knex.truncate('boards'),
      knex.truncate('users'),
      knex.truncate('invites'),
      knex.truncate('labels'),
      knex.truncate('card_labels'),
      knex.truncate('comments'),
      knex.truncate('card_users'),
    ])
  }

  const createUsers = () => {
    return knex
      .insert(seeds.users)
      .into('users')
      .returning('*')
  }

  const createBoards = () => {
    const boardRecords = seeds.boards.map(board => cloneWithout(board,['lists']))
    return knex
      .insert(boardRecords)
      .into('boards')
      .returning('*')
      .then(createListsAndCardsForBoards)
  }

  const createListsAndCardsForBoards = (boardRecords) => {
    const listRecords = []
    const cardRecordsForList = []
    seeds.boards.forEach((board, index) => {
      const boardRecord = boardRecords[index]
      board.lists.forEach((list, index) => {
        const listRecord = cloneWithout(list,['cards'])
        listRecord.board_id = boardRecord.id
        listRecord.order = index
        listRecords.push(listRecord)
        cardRecordsForList.push(list.cards.map(card => cloneWithout(card, [])))
      })
    })
    const createCardsForLists = (listRecords) => {
      const cardRecords = []
      listRecords.forEach((listRecord, index) => {
        cardRecordsForList[index].forEach((cardRecord, index) => {
          cardRecord.list_id = listRecord.id
          cardRecord.board_id = listRecord.board_id
          cardRecord.order = index
          cardRecords.push(cardRecord)
        })
      })
      return knex
        .insert(cardRecords)
        .into('cards')
    }
    return knex
      .insert(listRecords)
      .into('lists')
      .returning('*')
      .then(createCardsForLists)
      .then(() => boardRecords)
  }

  const createUsersAndBoards = () => {
    return Promise.all([
      createUsers(),
      createBoards(),
    ])
  }

  const addEachUserToEachBoard = ([users, boards]) => {
    const records = []
    users.forEach(user => {
      boards.forEach(board => {
        records.push({board_id: board.id, user_id: user.id})
      })
    })
    return knex.table('user_boards').insert(records)
  }

  return truncateAllTables()
    .then(createUsersAndBoards)
    .then(addEachUserToEachBoard)
};

const cloneWithout = (object, keys) => {
  const clone = Object.assign({}, object)
  keys.forEach(key => { delete clone[key] })
  return clone
}
