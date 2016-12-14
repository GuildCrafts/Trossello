const { expect, knex, queries, commands } = require('../../setup')
const {
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  ACTIVITY_REGEXP_JSONTIMESTAMP,
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
          const card87 = board.cards.find( card => card.id === 87)
          board.activity.forEach( activity => {
            expect(activity.created_at.toJSON()).to.match(ACTIVITY_REGEXP_JSONTIMESTAMP)
          })
          expect(board.id).to.eql(101)
          expect(board.name).to.eql('Board1')
          expect(board.archived).to.eql(false)
          expect(board.starred).to.eql(false)
          expect(board.background_color).to.eql('orange')
          expect(board.users[0].id).to.eql(1455)
          expect(board.users[0].github_id).to.eql(22312)
          expect(board.users[0].avatar_url).to.eql('https://thumbs.dreamstime.com/t/android-robot-thumb-up-22927887.jpg')
          expect(board.users[0].email).to.eql("mark@zuckerburg.io")
          expect(board.users[0].name).to.eql("Mark Zuckerburg")
          expect(board.users[0].created_at).to.eql(null)
          expect(board.users[0].updated_at).to.eql(null)
          expect(board.users[0].boards_dropdown_lock).to.eql(false)
          expect(board.lists.map(list => list.id)).to.eql([40,41])
          expect(board.lists.map(list => list.board_id)).to.eql([101,101])
          expect(board.lists.map(list => list.name)).to.eql(['List1','List2'])
          expect(board.lists.map(list => list.archived)).to.eql([false,false])
          expect(board.lists.map(list => list.order)).to.eql([0,1])
          expect(board.cards.map(card => card.id)).to.eql([80,81,82,90,91,83,84,85,86,87])
          expect(board.cards.map(card => card.board_id)).to.eql([101,101,101,101,101,101,101,101,101,101])
          expect(board.cards.map(card => card.list_id)).to.eql([40,40,40,40,40,41,41,41,41,41])
          expect(board.cards.map(card => card.content)).to.eql(['card1','Card2','happy','Card 90','Card 91','card3','Card4','happy card','HAPPY','HAPPYS'])
          expect(board.cards.map(card => card.description)).to.eql(['','','','','','','','','',''])
          expect(board.cards.map(card => card.archived)).to.eql([false,false,false,false,false,false,false,false,false,false])
          expect(board.cards.map(card => card.order)).to.eql([0,1,2,3,4,0,1,2,3,4])
          expect(card87.user_ids).to.be.an('array')
          expect(card87.user_ids).to.eql([1455])
          expect(board.activity).to.eql([
            {
              id: 19,
              created_at: board.activity[0].created_at,
              user_id: 1455,
              type: 'AddedUserToCard',
              board_id: 101,
              card_id: 87,
              metadata: '{"added_card_user":1455}'
            },
            {
              id: 13,
              created_at: board.activity[1].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 91,
              metadata: '{"content":"Card 91"}' },
            {
              id: 12,
              created_at: board.activity[2].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 90,
              metadata: '{"content":"Card 90"}' },
            {
              id: 11,
              created_at: board.activity[3].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 87,
              metadata: '{"content":"HAPPYS"}' },
            {
              id: 10,
              created_at: board.activity[4].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 86,
              metadata: '{"content":"HAPPY"}' },
            {
              id: 9,
              created_at: board.activity[5].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 85,
              metadata: '{"content":"happy card"}' },
            {
              id: 8,
              created_at: board.activity[6].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 84,
              metadata: '{"content":"Card4"}' },
            {
              id: 7,
              created_at: board.activity[7].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 83,
              metadata: '{"content":"card3"}' },
            {
              id: 6,
              created_at: board.activity[8].created_at,
              user_id: 1455,
              type: 'AddedList',
              board_id: 101,
              card_id: null,
              metadata: '{"list_id":41,"list_name":"List2"}' },
            {
              id: 5,
              created_at: board.activity[9].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 82,
              metadata: '{"content":"happy"}' },
            {
              id: 4,
              created_at: board.activity[10].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 81,
              metadata: '{"content":"Card2"}' },
            {
              id: 3,
              created_at: board.activity[11].created_at,
              user_id: 1455,
              type: 'AddedCard',
              board_id: 101,
              card_id: 80,
              metadata: '{"content":"card1"}' },
            {
              id: 2,
              created_at: board.activity[12].created_at,
              user_id: 1455,
              type: 'AddedList',
              board_id: 101,
              card_id: null,
              metadata: '{"list_id":40,"list_name":"List1"}' },
            {
              id: 1,
              created_at: board.activity[13].created_at,
              user_id: 1455,
              type: 'CreatedBoard',
              board_id: 101,
              card_id: null,
              metadata: '{"board_name":"Board1"}'
            }
          ])
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
          expect(board.id).to.eql(40)
          expect(board.board_id).to.eql(101)
          expect(board.name).to.eql('List1')
          expect(board.archived).to.eql(false)
          expect(board.order).to.eql(0)
        })
      })
    })
  })

  describe('getCardById', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return one board by boardId', () => {
        return queries.getCardById(80).then( board => {
          expect(board.id).to.eql(80)
          expect(board.list_id).to.eql(40)
          expect(board.board_id).to.eql(101)
          expect(board.content).to.eql('card1')
          expect(board.description).to.eql('')
          expect(board.archived).to.eql(false)
          expect(board.order).to.eql(0)
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

  describe('getBoardMoveTargetsForUserId', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return boards, lists, and card counts for user', () => {
        return queries.getBoardMoveTargetsForUserId(1455)
          .then(boards => {
            expect(boards).to.have.length(3)
            expect(boards[0].lists).to.have.length(2)
            expect(boards[1].lists).to.have.length(0)
            expect(boards[2].lists).to.have.length(0)
            expect(boards[0].lists[0].card_count).to.eql(5)
            expect(boards[0].lists[1].card_count).to.eql(5)
          })
      })
    })
  })

  describe('getActivityByBoardId', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should get Activities by boardId', () => {
        return queries.getActivityByBoardId(101)
          .then( activities => {
            activities.forEach( activity => {
              expect(activity.created_at.toJSON()).to.match(ACTIVITY_REGEXP_JSONTIMESTAMP)
            })
            expect(activities).to.eql([
              {
                id: 19,
                created_at: activities[0].created_at,
                user_id: 1455,
                type: 'AddedUserToCard',
                board_id: 101,
                card_id: 87,
                metadata: '{"added_card_user":1455}'
              },
              {
                id: 13,
                created_at: activities[1].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 91,
                metadata: '{"content":"Card 91"}' },
              {
                id: 12,
                created_at: activities[2].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 90,
                metadata: '{"content":"Card 90"}' },
              {
                id: 11,
                created_at: activities[3].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 87,
                metadata: '{"content":"HAPPYS"}' },
              {
                id: 10,
                created_at: activities[4].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 86,
                metadata: '{"content":"HAPPY"}' },
              {
                id: 9,
                created_at: activities[5].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 85,
                metadata: '{"content":"happy card"}' },
              {
                id: 8,
                created_at: activities[6].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 84,
                metadata: '{"content":"Card4"}' },
              {
                id: 7,
                created_at: activities[7].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 83,
                metadata: '{"content":"card3"}' },
              {
                id: 6,
                created_at: activities[8].created_at,
                user_id: 1455,
                type: 'AddedList',
                board_id: 101,
                card_id: null,
                metadata: '{"list_id":41,"list_name":"List2"}' },
              {
                id: 5,
                created_at: activities[9].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 82,
                metadata: '{"content":"happy"}' },
              {
                id: 4,
                created_at: activities[10].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 81,
                metadata: '{"content":"Card2"}' },
              {
                id: 3,
                created_at: activities[11].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 101,
                card_id: 80,
                metadata: '{"content":"card1"}' },
              {
                id: 2,
                created_at: activities[12].created_at,
                user_id: 1455,
                type: 'AddedList',
                board_id: 101,
                card_id: null,
                metadata: '{"list_id":40,"list_name":"List1"}' },
              {
                id: 1,
                created_at: activities[13].created_at,
                user_id: 1455,
                type: 'CreatedBoard',
                board_id: 101,
                card_id: null,
                metadata: '{"board_name":"Board1"}'
              }
            ])
          })
      })
    })
  })

  describe('getUsersForCard', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should get users associated with a card', () => {
        return queries.getUsersForCard(87)
          .then( cardUsers => {
            expect(cardUsers).to.be.an('array')
            expect(cardUsers.length).to.eql(1)
            expect(cardUsers[0]).to.be.an('object')
            expect(cardUsers[0]).to.eql({
              id: 1,
              board_id: 101,
              card_id: 87,
              user_id: 1455
            })
          })
      })
    })
  })
})
