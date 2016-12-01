const { expect, request, queries, commands } = require('../../setup')
const{
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
} = require('../../helpers')

describe('/api/cards', () => {
  withBoardsListsAndCardsInTheDatabase(() => {

    context('when not logged in', () => {
      // UPDATE
      describe('POST /api/cards/:cardId', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/cards/12')
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })

      // DELETE
      describe('POST /api/cards/:cardId/archive', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/cards/12/archive')
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
      describe('POST /api/cards/:cardId', () => {
        it('should update the card and render it as json', () => {
          const cardAttributes = {
            content: 'Eat some shoe laces'
          }
          return request('post', '/api/cards/83', cardAttributes)
            .then(response => {
              expect(response).to.have.status(200)
              expect(response.body.id).to.eql(83)
              expect(response.body.list_id).to.eql(41)
              expect(response.body.content).to.eql('Eat some shoe laces')
            })
        })
      })

      // DELETE
      describe('POST /api/cards/:cardId/archive', () => {
        it('should archive the card and render null', () => {
          return queries.getCardById(83)
            .then(card => {
              expect(card.archived).to.eql(false)
            })
            .then(() => request('post', '/api/cards/83/archive'))
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then(() => queries.getCardById(83))
            .then(card => {
              expect(card.archived).to.eql(true)
            })
        })
      })

      //MOVE CARD
      describe('POST /api/cards/:cardId/move', () => {

        it('should move the card and re-order other cards', () => {
          const moveTo = {
            boardId: 101,
            listId: 41,
            order: 2
          }
          return queries.getCardById(80)
            .then(response => {
              expect(response.list_id).to.eql(40)
              expect(response.order).to.eql(0)
            })
            .then(() => queries.getCardById(84))
            .then(response => {
              expect(response.order).to.eql(1)
            })
            .then(() => queries.getCardById(86))
            .then(response => {
              expect(response.list_id).to.eql(41)
              expect(response.order).to.eql(3)
            })
            .then(() => request('POST', '/api/cards/80/move', moveTo))
            .then(() => queries.getCardById(80))
            .then(response => {
              expect(response.order).to.eql(2)
              expect(response.list_id).to.eql(41)
            })
            .then(() => queries.getCardById(84))
            .then(response => {
              expect(response.order).to.eql(1)
            })
            .then(() => queries.getCardById(86))
            .then(response => {
              expect(response.list_id).to.eql(41)
              expect(response.order).to.eql(4)
            })
        })
      })

      //ADD OR REMOVE LABEL
      describe('POST /api/cards/:cardId/labels/:labelId', () => {
        it('should add and then remove a label from a card', () => {
          const labelIds = board => board.cards.find(card => card.id===80).label_ids
          return queries.getBoardById(101)
            .then(board => expect(labelIds(board)).to.eql([]))
            .then(() => request('post', '/api/cards/80/labels/301'))
            .then(() => queries.getBoardById(101))
            .then(board => expect(labelIds(board)).to.eql([301]))
            .then(() => request('post', '/api/cards/80/labels/301'))
            .then(() => queries.getBoardById(101))
            .then(board => expect(labelIds(board)).to.eql([]))
        })
      })

    })
  })
})
