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

      // COPY
      describe('POST /api/lists/:listId/copy', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/lists/40/copy')
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

      // COPY
      describe('POST /api/lists/:listId/copy', () => {
        it('should copy old list and render a new list with copied cards', () => {
          const newListAttributes = {
            board_id: 101,
            name: 'Jim\'s Detailed List'
          }
          return request('post', '/api/lists/41/copy', newListAttributes)
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then(() => queries.getListByName("Jim's Detailed List"))
            .then( list => {
              expect(list.name).to.eql("Jim's Detailed List")
              expect(list.board_id).to.eql(101)
                return queries.getCardsByListId(list.id).then( cards => {
                  expect(cards.length).to.eql(2)
                })
            })

        })
      })

    })
  })
})
