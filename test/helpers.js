const { knex, request, queries, commands } = require('./setup')

const withTwoUsersInTheDatabase = (callback) => {
  context('when there are users in the database', () => {
    beforeEach( () => {
      return Promise.all([
        commands.createUser({
          id: 1455,
          github_id: 22312,
          name: 'Mark Zuckerburg',
          email: 'mark@zuckerburg.io',
        }),
        commands.createUser({
          id: 6672,
          github_id: 9775,
          name: 'Larry Harvey',
          email: 'larry@harvey.to',
        })
      ])
    })
    callback()
  })
}

const withBoardsListsAndCardsInTheDatabase = (callback) => {
  context('when there boards, list and cards in the database', () => {
    beforeEach( () => {
      return commands.createBoard(1455, {
        id: 101,
        name: 'Board1',
        background_color: 'orange',
      }).then( () =>
        commands.createList({
          id: 40,
          board_id: 101,
          name: 'List1',
        })
      ).then( () =>
        commands.createCard({
          id: 80,
          list_id: 40,
          board_id: 101,
          content: 'card1',
        }),
      ).then( () =>
        commands.createCard({
          id: 81,
          list_id: 40,
          board_id: 101,
          content: 'Card2',
        })
      ).then( () =>
        commands.createList({
          id: 41,
          board_id: 101,
          name: 'List2',
        })
      ).then( () =>
        commands.createCard({
          id: 82,
          list_id: 41,
          board_id: 101,
          content: 'card3',
        })
      ).then( () =>
        commands.createCard({
          id: 83,
          list_id: 41,
          board_id: 101,
          content: 'Card4',
        })
      ).then( () =>
        commands.createBoard(1455, {
          id: 102,
          name: 'Board2',
          background_color: 'purple',
        })
      )
    })
    callback()
  })
}

const loginAs = (userId) => {
  return request('get', `/__login/${userId}`) // back door hack
}

module.exports = {
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
}
