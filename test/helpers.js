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
  withTwoUsersInTheDatabase(()=>{
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
          commands.createCard({
            id: 82,
            list_id: 40,
            board_id: 101,
            content: 'happy',
          }),
        ).then( () =>
          commands.createList({
            id: 41,
            board_id: 101,
            name: 'List2',
          })
        ).then( () =>
          commands.createCard({
            id: 83,
            list_id: 41,
            board_id: 101,
            content: 'card3',
          })
        ).then( () =>
          commands.createCard({
            id: 84,
            list_id: 41,
            board_id: 101,
            content: 'Card4',
          })
        ).then( () =>
          commands.createCard({
            id:85,
            list_id:41,
            board_id: 101,
            content: 'happy card'
          })
        ).then( () =>
          commands.createCard({
            id:86,
            list_id:41,
            board_id: 101,
            content: 'HAPPY'
          })
        ).then( () =>
          commands.createCard({
            id:87,
            list_id:41,
            board_id: 101,
            content: 'HAPPYS'
          })
        ).then( () =>
          commands.createBoard(1455, {
            id: 102,
            name: 'Board2',
            background_color: 'purple',
          })
        ).then( () =>
          commands.createBoard(1455, {
            id: 103,
            name: 'Board3',
            background_color: 'yellow',
            starred: true,
          })
        ).then( () =>
          commands.createBoard(6672, {
            id: 104,
            name: 'Board4',
            background_color: 'purple',
          })
        ).then( () =>
          commands.createList({
            id: 42,
            board_id: 104,
            name: 'Unhappy list'
          })
        ).then( () =>
          commands.createCard({
            id:88,
            list_id:42,
            board_id: 104,
            content: 'Not happy on board 2'
          })
        )
      })
      callback()
    })
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
