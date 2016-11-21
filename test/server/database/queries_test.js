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
            created_at: board.created_at,
            updated_at: board.updated_at,

            lists:[
              { id: 40, board_id: 101, name: 'List1', archived: false, created_at: board.lists[0].created_at, updated_at: board.lists[0].updated_at},
              { id: 41, board_id: 101, name: 'List2', archived: false, created_at: board.lists[1].created_at, updated_at: board.lists[1].updated_at},
            ],
            cards: [
              { id: 80, board_id: 101, list_id: 40, content: 'card1', description: '', archived: false, order: 0, created_at: board.cards[0].created_at, updated_at: board.cards[0].updated_at},
              { id: 81, board_id: 101, list_id: 40, content: 'Card2', description: '', archived: false, order: 1, created_at: board.cards[1].created_at, updated_at: board.cards[1].updated_at},
              { id: 82, board_id: 101, list_id: 41, content: 'card3', description: '', archived: false, order: 0, created_at: board.cards[2].created_at, updated_at: board.cards[2].updated_at},
              { id: 83, board_id: 101, list_id: 41, content: 'Card4', description: '', archived: false, order: 1, created_at: board.cards[3].created_at, updated_at: board.cards[3].updated_at},
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

  describe('getListById', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return one board by boardId', () => {
        return queries.getListById(40).then( board => {
          expect(board).to.eql({
            id: 40,
            board_id: 101,
            name: 'List1',
            archived: false,
            created_at: board.created_at,
            updated_at: board.updated_at,
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
            order: 0,
            created_at: board.created_at,
            updated_at: board.updated_at,
          })
        })
      })
    })
  })

})
