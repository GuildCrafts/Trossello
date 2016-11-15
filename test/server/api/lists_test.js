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

      // DELETE ALL CARDS IN LIST
      describe('POST /api/lists/:listId/archivecards', () => {
        it('should archive all cards in the list', () => {
          const getCards = () =>
            Promise.all([
              queries.getCardById(80),
              queries.getCardById(81)
            ])
          return getCards()
            .then(([card80, card81]) => {
                expect(card80.id).to.eql(80)
                expect(card80.list_id).to.eql(40)
                expect(card80.archived).to.eql(false)
                expect(card81.id).to.eql(81)
                expect(card81.list_id).to.eql(40)
                expect(card81.archived).to.eql(false)
            })
            .then(() => request('post', '/api/lists/40/archivecards'))
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then(getCards)
            .then(([card80, card81]) => {
              expect(card80.id).to.eql(80)
              expect(card80.list_id).to.eql(40)
              expect(card80.archived).to.eql(true)
              expect(card81.id).to.eql(81)
              expect(card81.list_id).to.eql(40)
              expect(card81.archived).to.eql(true)
            })
        })
      })

    })

  })
})
