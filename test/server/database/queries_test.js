const { expect, knex, queries, commands } = require('../../setup')
const {
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
} = require('../../helpers')


describe('database.queries', () => {

  describe('getUsers', () => {
    withTwoUsersInTheDatabase(() => {
      it('should return an array of all users', () => {
        return queries.getUsers().then( users => {
          expect(users).to.be.a('array')
          expect(users.length).to.eql(3)

          users.forEach(user => {
            if (user.id === 1455){
              expect(user).to.be.a('object')
              expect(user.id).to.eql(1455)
              expect(user.name).to.eql('Mark Zuckerburg')
              expect(user.email).to.eql('mark@zuckerburg.io')
            }else if (user.id === 6672){
              expect(user).to.be.a('object')
              expect(user.id).to.eql(6672)
              expect(user.name).to.eql('Larry Harvey')
              expect(user.email).to.eql('larry@harvey.to')
            }else if (user.id === 10000) {
              expect(user).to.be.a('object')
              expect(user.id).to.eql(10000)
              expect(user.name).to.eql('Bob Taylor')
              expect(user.email).to.eql('bob@bob.com')
            } else {
              throw new Error('unexpected user record')
            }
          })
        })
      })
    })
  })

  describe('getUserById', () => {
    withTwoUsersInTheDatabase(() => {
      it('should return json by user id', () => {
        return queries.getUserById(1455).then( user => {
          expect(user).to.be.a('object')
          expect(user.id).to.eql(1455)
          expect(user.name).to.eql('Mark Zuckerburg')
          expect(user.email).to.eql('mark@zuckerburg.io')
        })
      })
    })
  })

  describe('getCardById', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return json by card id', () => {
        return queries.getCardById(82).then( card => {
          expect(card).to.be.a('object')
          expect(card.id).to.eql(82)
          expect(card.list_id).to.eql(40)
          expect(card.content).to.eql('happy')
        })
      })
    })
  })

  describe('getBoardsByUserId', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return an array of all boards', () => {
        return queries.getBoardsByUserId(1455).then( boards => {
          expect(boards.length).to.eql(3)
          const boardNames = boards.map(board => board.name).sort()
          expect(boardNames).to.eql(['Board1', 'Board2', 'Board3'])
        })
      })
    })
  })

  describe('getBoardById', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return one board by boardId', () => {
        return queries.getBoardById(101).then( board => {
          board.activity.forEach( activity => {
            expect(activity.created_at).to.match(
              /^[A-Z][a-z]{2} [A-Z][a-z]{2} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} GMT-[0-9]{4} \([A-Z]{3}\)$/
            )
          })
          expect(board).to.eql({
            id: 101,
            name: 'Board1',
            archived: false,
            starred: false,
            background_color: 'orange',

            lists:[
              { id: 40, board_id: 101, name: 'List1', archived: false, order: 0},
              { id: 41, board_id: 101, name: 'List2', archived: false, order: 1},
            ],
            cards: [
              { id: 80, board_id: 101, list_id: 40, content: 'card1', archived: false, order: 0, description: ''},
              { id: 81, board_id: 101, list_id: 40, content: 'Card2', archived: false, order: 1, description: ''},
              { id: 82, board_id: 101, list_id: 40, content: 'happy', archived: false, order: 2, description: ''},
              { id: 90, board_id: 101, list_id: 40, content: 'Card 90', archived: false, order: 3, description: ''},
              { id: 91, board_id: 101, list_id: 40, content: 'Card 91', archived: false, order: 4, description: ''},
              { id: 83, board_id: 101, list_id: 41, content: 'card3', archived: false, order: 0, description: ''},
              { id: 84, board_id: 101, list_id: 41, content: 'Card4', archived: false, order: 1, description: ''},
              { id: 85, board_id: 101, list_id: 41, content: 'happy card', archived: false, order: 2, description: ''},
              { id: 86, board_id: 101, list_id: 41, content: 'HAPPY', archived: false, order: 3, description: ''},
              { id: 87, board_id: 101, list_id: 41, content: 'HAPPYS', archived: false, order: 4, description: ''}
            ],
            users: [
              {
                "id": 1455,
                "github_id": 22312,
                "avatar_url": null,
                "email": "mark@zuckerburg.io",
                "name": "Mark Zuckerburg",
                "created_at": null,
                "updated_at": null,
                "boards_dropdown_lock": false
              },
            ],
            activity: [
              {id: 1, created_at: board.activity[0].created_at, user_id: 1455, type: 'CreatedBoard', board_id: 101, card_id: null, metadata: '{"board_name":"Board1"}'},
              {id: 2, created_at: board.activity[1].created_at, user_id: 1455, type: 'AddedList', board_id: 101, card_id: null, metadata: '{"list_id":40,"list_name":"List1"}'},
              {id: 3, created_at: board.activity[2].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 80, metadata: '{"content":"card1"}'},
              {id: 4, created_at: board.activity[3].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 81, metadata: '{"content":"Card2"}'},
              {id: 5, created_at: board.activity[4].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 82, metadata: '{"content":"happy"}'},
              {id: 6, created_at: board.activity[5].created_at, user_id: 1455, type: 'AddedList', board_id: 101, card_id: null, metadata: '{"list_id":41,"list_name":"List2"}'},
              {id: 7, created_at: board.activity[6].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 83, metadata: '{"content":"card3"}'},
              {id: 8, created_at: board.activity[7].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 84, metadata: '{"content":"Card4"}'},
              {id: 9, created_at: board.activity[8].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 85, metadata: '{"content":"happy card"}'},
              {id: 10, created_at: board.activity[9].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 86, metadata: '{"content":"HAPPY"}'},
              {id: 11, created_at: board.activity[10].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 87, metadata: '{"content":"HAPPYS"}'},
              {id: 12, created_at: board.activity[11].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 90, metadata: '{"content":"Card 90"}'},
              {id: 13, created_at: board.activity[12].created_at, user_id: 1455, type: 'AddedCard', board_id: 101, card_id: 91, metadata: '{"content":"Card 91"}'}
            ]
          })
        })
      })
    })
  })

  describe('getSearchResult', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should return an empty array if searchTerm does not exist', () => {
        return queries.getSearchResult(1455, null ).then( result => {
          expect(result, 'Empty resolved promise').to.eql([])
        })
      })
      it('should return a card if searchTerm exists', () => {
        return queries.getSearchResult(1455, 'card1').then( card => {
          expect(card, 'Card1 length').to.have.length(1)
        })
      })
    })
  })

  describe('getListById', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return one board by boardId', () => {
        return queries.getListById(40).then( board => {
          expect(board).to.eql({
            id: 40,
            board_id: 101,
            name: 'List1',
            archived: false,
            order: 0,
          })
        })
      })
    })
  })

  describe('getCardById', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return one board by boardId', () => {
        return queries.getCardById(80).then( board => {
          expect(board).to.eql({
            id: 80,
            list_id: 40,
            board_id: 101,
            content: 'card1',
            description: '',
            archived: false,
            order: 0
          })
        })
      })
    })
  })

  describe('getInviteByToken', () => {
    it('should return first row with given token', () => {
      return commands.createInvite(1455, {
        boardId: 123,
        email: 'larry@david.org',
      })
      .then(invite =>
        queries.getInviteByToken(invite.token).then( invite => {
          expect(invite).to.be.an('object')
          expect(invite.boardId).to.eql(123)
          expect(invite.email).to.eql('larry@david.org')
        })
      )
    })
  })

  describe('getActivityByBoardId', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should get Activities by boardId', () => {
        return queries.getActivityByBoardId(101)
          .then( activities => {
            activities.forEach( activity => {
              expect(activity.created_at).to.match(
                /^[A-Z][a-z]{2} [A-Z][a-z]{2} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} GMT-[0-9]{4} \([A-Z]{3}\)$/
              )
            })
            expect(activities).to.eql([
              {
                id: 1,
                created_at: activities[0].created_at,
                user_id: 1455,
                type: 'CreatedBoard',
                board_id: 101,
                card_id: null,
                metadata: '{"board_name":"Board1"}'
              },
              {
                id: 2,
                created_at: activities[1].created_at,
                user_id: 1455,
                type: 'AddedList',
                board_id: 101,
                card_id: null,
                metadata: '{"list_id":40,"list_name":"List1"}'
              },
              {
                id: 3,
                created_at: activities[2].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 80,
                metadata: '{"content":"card1"}'
              },
              {
                id: 4,
                created_at: activities[3].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 81,
                metadata: '{"content":"Card2"}'
              },
              {
                id: 5,
                created_at: activities[4].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 82,
                metadata: '{"content":"happy"}'
              },
              {
                id: 6,
                created_at: activities[5].created_at,
                user_id: 1455,
                type: 'AddedList',
                board_id: 101,
                card_id: null,
                metadata: '{"list_id":41,"list_name":"List2"}'
              },
              {
                id: 7,
                created_at: activities[6].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 83,
                metadata: '{"content":"card3"}'
              },
              {
                id: 8,
                created_at: activities[7].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 84,
                metadata: '{"content":"Card4"}'
              },
              {
                id: 9,
                created_at: activities[8].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 85,
                metadata: '{"content":"happy card"}'
              },
              {
                id: 10,
                created_at: activities[9].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 86,
                metadata: '{"content":"HAPPY"}'
              },
              {
                id: 11,
                created_at: activities[10].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 87,
                metadata: '{"content":"HAPPYS"}'
              },
              {
                id: 12,
                created_at: activities[11].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 90,
                metadata: '{"content":"Card 90"}'
              },
              {
                id: 13,
                created_at: activities[12].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 91,
                metadata: '{"content":"Card 91"}'
              }
            ])
          })
      })
    })
  })

})
