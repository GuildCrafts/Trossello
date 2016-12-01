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
          expect(board.id).to.eql(101)
          expect(board.name).to.eql('Board1')
          expect(board.archived).to.eql(false)
          expect(board.starred).to.eql(false)
          expect(board.background_color).to.eql('orange')

          expect(board.users[0].id).to.eql(1455)
          expect(board.users[0].github_id).to.eql(22312)
          expect(board.users[0].avatar_url).to.eql(null)
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
      return commands.createInvite({
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

})
