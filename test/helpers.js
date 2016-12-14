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
          avatar_url: 'https://thumbs.dreamstime.com/t/android-robot-thumb-up-22927887.jpg',
        }),
        commands.createUser({
          id: 6672,
          github_id: 9775,
          name: 'Larry Harvey',
          email: 'larry@harvey.to',
          avatar_url: 'https://thumbs.dreamstime.com/t/android-robot-thumb-up-22927887.jpg',
        }),
        commands.createUser({
          id: 10000,
          github_id: 5000,
          name: 'Bob Taylor',
          email: 'bob@bob.com',
          avatar_url: 'https://thumbs.dreamstime.com/t/android-robot-thumb-up-22927887.jpg',
        })
      ])
    })
    callback()
  })
}

const withBoardsListsAndCardsInTheDatabase = (callback) => {
  withTwoUsersInTheDatabase(()=>{
    context('when there are boards, lists and cards in the database', () => {
      beforeEach( () => {
        return commands.createBoard(1455, {
          id: 101,
          name: 'Board1',
          background_color: 'orange',
        }).then( () =>
          commands.createList(1455, {
            id: 40,
            board_id: 101,
            name: 'List1',
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 80,
            list_id: 40,
            board_id: 101,
            content: 'card1',
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 81,
            list_id: 40,
            board_id: 101,
            content: 'Card2',
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 82,
            list_id: 40,
            board_id: 101,
            content: 'happy',
          }),
        ).then( () =>
          commands.createList(1455, {
            id: 41,
            board_id: 101,
            name: 'List2',
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 83,
            list_id: 41,
            board_id: 101,
            content: 'card3',
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 84,
            list_id: 41,
            board_id: 101,
            content: 'Card4',
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 85,
            list_id: 41,
            board_id: 101,
            content: 'happy card'
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 86,
            list_id: 41,
            board_id: 101,
            content: 'HAPPY'
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 87,
            list_id: 41,
            board_id: 101,
            content: 'HAPPYS'
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 90,
            list_id: 40,
            board_id: 101,
            content: 'Card 90',
          })
        ).then( () =>
          commands.createCard(1455, {
            id: 91,
            list_id: 40,
            board_id: 101,
            content: 'Card 91',
          })
        ).then( () =>
          commands.createLabel({
            id: 301,
            board_id: 101,
            color: 'purple',
            text: 'purple label'
          })
        ).then( () =>
          commands.addOrRemoveCardLabel(90, 301)
        ).then( () =>
          commands.addComment(80, 1455, 'old comment')
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
          commands.createList(6672, {
            id: 42,
            board_id: 104,
            name: 'Unhappy list'
          })
        ).then( () =>
          commands.createCard(6672, {
            id:88,
            list_id:42,
            board_id: 104,
            content: 'Not happy on board 2'
          })
        ).then( () =>
          commands.addUserToCard(1455, 101, 87, 1455)
        )
      })
      callback()
    })
  })
}

const loginAs = (userId) => {
  return request('get', `/__login/${userId}`) // back door hack
}

const ACTIVITY_REGEXP_JSONTIMESTAMP =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/

module.exports = {
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
  ACTIVITY_REGEXP_JSONTIMESTAMP,
}
