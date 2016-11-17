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
          expect(users.length).to.eql(2)

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
            }else{
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
          expect(card.list_id).to.eql(41)
          expect(card.content).to.eql('card3')
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
          expect(board).to.eql({
            id: 101,
            name: 'Board1',
            archived: false,
            starred: false,
            background_color: 'orange',

            lists:[
              { id: 40, board_id: 101, name: 'List1', archived: false, },
              { id: 41, board_id: 101, name: 'List2', archived: false, },
            ],
            cards: [
              { id: 80, board_id: 101, list_id: 40, content: 'card1', description: '', archived: false, order: 0},
              { id: 81, board_id: 101, list_id: 40, content: 'Card2', description: '', archived: false, order: 1},
              { id: 82, board_id: 101, list_id: 41, content: 'card3', description: '', archived: false, order: 0},
              { id: 83, board_id: 101, list_id: 41, content: 'Card4', description: '', archived: false, order: 1},
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
              },
            ],
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
          })
        })
      })
    })
  })


  describe('getListById', () => {
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

  describe('verifyToken', () => {
    it('should return first row with given token', () => {
      return queries.verifyToken('a1bc6250996632d25f0e38d7ad11529cc61489ce').then( invite => {
        expect(invite.boardId).to.eql(123)
      })
    })
  })

})
