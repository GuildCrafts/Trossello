const { expect, request, queries, commands } = require('../../setup')
const{
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
} = require('../../helpers')

describe('/api/lists', () => {
  withBoardsListsAndCardsInTheDatabase(() => {

    context('when not logged in', () => {
      // UPDATE
      describe('POST /api/lists/:listId', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/lists/12')
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })

      // DELETE
      describe('POST /api/lists/:listId/delete', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/lists/12/delete')
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })
    })

    context('when logged in', () => {
      beforeEach(() => {
        return loginAs(1455)
      })

      // UPDATE
      describe('POST /api/lists/:listId', () => {
        it('should update the list and render it as JSON', () => {
          const listAttributes = {
            name: 'Shopping List'
          }
          return request('post', '/api/lists/41', listAttributes)
            .then(response => {
              expect(response).to.have.status(200)
              expect(response.body.id).to.eql(41)
              expect(response.body.board_id).to.eql(101)
              expect(response.body.name).to.eql('Shopping List')
            })
        })
      })

      // DELETE
      describe('POST /api/lists/:listId/archive', () => {
        it('should archive the list and render null', () => {
          return queries.getListById(41)
            .then(list => {
              expect(list.archived).to.eql(false)
            })
            .then(() => request('post', '/api/lists/41/archive'))
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then(() => queries.getListById(41))
            .then(list => {
              expect(list.archived).to.eql(true)
            })
        })
      })

      describe('POST /api/lists/cards/move', () => {
        it('It should move all cards to another list', () => {
          const cardsToMove = [
            {
              id: 80,
              list_id: 40,
              board_id: 101,
              content: 'card1',
            },
            {  id: 81,
               list_id: 40,
               board_id: 101,
               content: 'Card2',
            }
          ]

          const listToMove = { cardsToMove: cardsToMove, newList: 41, orderOffset: 2 }

          const getOrderedCardsByListId = (board, listId) =>
            board.cards
              .filter(card => card.list_id === listId)
              .sort( (a,b) => a.order - b.order)

          return queries.getBoardById(101)
            .then(board => {
              let list40Cards = getOrderedCardsByListId(board, 40)
              let list41Cards = getOrderedCardsByListId(board, 41)

              expect(list40Cards.length).to.eql(2)
              expect(list41Cards.length).to.eql(2)
            })
            .then(() => queries.getCardById(80))
            .then(card => expect(card.list_id).to.eql(40))
            .then(() => queries.getCardById(81))
            .then(card => expect(card.list_id).to.eql(40))
            .then(() => request('post', '/api/lists/cards/move', listToMove ))
            .then(() => queries.getBoardById(101))
            .then(board => {
              let list40Cards = getOrderedCardsByListId(board, 40)
              let list41Cards = getOrderedCardsByListId(board, 41)
              console.log('------------->', list40Cards.length)

              expect(list40Cards.length).to.eql(0)
              expect(list41Cards.length).to.eql(4)
            })
            .then(() => queries.getCardById(80))
            .then(card => expect(card.list_id).to.eql(41))
            .then(() => queries.getCardById(81))
            .then(card => expect(card.list_id).to.eql(41))
        })
      })

    })

  })
})
