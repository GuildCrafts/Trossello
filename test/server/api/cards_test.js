const { expect, request, queries, commands } = require('../../setup')
const{
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
} = require('../../helpers')

describe('/api/cards', () => {
  withTwoUsersInTheDatabase(() => {
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

      })
    })
  })
})
