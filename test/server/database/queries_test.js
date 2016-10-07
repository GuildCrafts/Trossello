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
          expect(boards.length).to.eql(2)
          const boardNames = boards.map(board => board.name).sort()
          expect(boardNames).to.eql(['Board1', 'Board2'])
        })
      })
    })
  })

  describe('getBoardById', () => {
    withBoardsListsAndCardsInTheDatabase(()=>{
      it('should return one board by boardId', () => {
        return queries.getBoardById(1).then( board => {
          expect(board).to.eql({
            id: 1,
            name: 'Board1',
            background_color: 'orange',
            lists:[
              { id: 40, board_id: 1, name: 'List1' },
              { id: 41, board_id: 1, name: 'List2' },
            ],
            cards: [
              { id: 80, board_id: null, list_id: 40, content: 'card1' },
              { id: 81, board_id: null, list_id: 40, content: 'Card2' },
              { id: 82, board_id: null, list_id: 41, content: 'card3' },
              { id: 83, board_id: null, list_id: 41, content: 'Card4' },
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
            board_id: 1,
            name: 'List1'
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
            board_id: null,
            content: 'card1'
          })
        })
      })
    })
  })

})
