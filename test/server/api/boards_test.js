const { expect, request, queries, commands } = require('../../setup')
const{
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
} = require('../../helpers')

describe('/api/boards', () => {

  withTwoUsersInTheDatabase(() => {
    withBoardsListsAndCardsInTheDatabase(() => {

      context('when not logged in', () => {

        // INDEX
        describe('GET /api/boards', () => {
          it('should render 400 Not Authorized', () => {
            return request('get', '/api/boards')
              .then(response => {
                expect(response).to.have.status(400)
              })
          })
        })

        // CREATE
        describe('POST /api/boards', () => {
          it('should render 400 Not Authorized', () => {
            return request('post', '/api/boards', {})
              .then( response => {
                expect(response).to.have.status(400)
              })
          })
        })

        // SHOW
        describe('GET /api/boards/:boardId', () => {
          it('should render 400 Not Authorized', () => {
            return request('get', '/api/boards/1')
              .then(response => {
                expect(response).to.have.status(400)
              })
          })
        })

        // UPDATE
        describe('POST /api/boards/:boardId', () => {
          it('should render 400 Not Authorized', () => {
            return request('post', '/api/boards/1')
              .then(response => {
                expect(response).to.have.status(400)
              })
          })
        })

        // DELETE
        describe('POST /api/boards/:boardId/delete', () => {
          it('should render 400 Not Authorized', () => {
            return request('post', '/api/boards/1/delete')
              .then(response => {
                expect(response).to.have.status(400)
              })
          })
        })

        // CREATE LIST
        describe('POST /api/boards/:boardId/lists', () => {
          it('should render 400 Not Authorized', () => {
            return request('post', '/api/boards/1/lists', {})
              .then(response => {
                expect(response).to.have.status(400)
              })
          })
        })

        // CREATE BOARD
        describe('POST /api/boards/:boardId/lists/:listId/cards', () => {
          it('should render 400 Not Authorized', () => {
            return request('post', '/api/boards/1/lists/1/cards', {})
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

        // INDEX
        describe('GET /api/boards', () => {
          it('should render each board as a JSON array', () => {
            return request('get', '/api/boards').then(response => {
              expect(response).to.have.status(200)
              expect(response.body).to.be.an('array')
              expect(response.body.length).to.eql(2)
              const boardNames = response.body.map(board => board.name).sort()
              expect(boardNames).to.eql(['Board1','Board2'])
            })
          })
        })

        // CREATE
        describe('POST /api/boards', () => {

          it('should create a new board and return its json', () => {
            const boardAttributes = {
              name: 'Fresh Board'
            }
            return request('post', '/api/boards', boardAttributes).then( response => {
              expect(response).to.have.status(200)
              expect(response.body.name).to.eql('Fresh Board')
              expect(response.body.background_color).to.eql('#0079bf')
            })
          })
        })

        // SHOW
        describe('GET /api/boards/<existing board id>', () => {
          it('should return a null body and a 404 status', () => {
            return request('get', '/api/boards/1').then(response => {
              expect(response).to.have.status(200)
              expect(response.body.id).to.eql(1)
              expect(response.body.name).to.eql('Board1')
              expect(response.body.background_color).to.eql('orange')
            })
          })
          context('when download=1', () => {
            it('should set the xheader', () => {
              return request('get', '/api/boards/1?download=1').then(response => {                expect(response).to.have.status(200)
                expect(response).to.have.header('Content-Disposition', 'attachment; filename="board1.json"');
                expect(response).to.have.header('Content-Type', 'application/json; charset=utf-8');
                expect(response.body.id).to.eql(1)
                expect(response.body.name).to.eql('Board1')
                expect(response.body.background_color).to.eql('orange')
              })
            })
          })

        })

        // SHOW
        describe('GET /api/boards/<non-existant board id>', () => {
          it('should return a null body and a 404 status', () => {
            return request('get', '/api/boards/6667').then(response => {
              expect(response).to.have.status(404)
              expect(response.body).to.be.null
            })
          })
        })

        // UPDATE
        describe('POST /api/boards/:boardId', () => {
          it('should update the board', () => {
            const boardAttributes = {
              name: 'fresh board'
            }
            return request('post', '/api/boards/2', boardAttributes).then(response => {
              expect(response).to.have.status(200)
              expect(response.body.id).to.eql(2)
              expect(response.body.name).to.eql('fresh board')
              expect(response.body.background_color).to.eql('purple')
            })
          })
        })

        // DELETE
        describe('POST /api/boards/<existing board id>/delete', () => {
          it('should delete a board and render status 200', () => {
            return request('post', '/api/boards/2/delete')
              .then(response => {
                expect(response).to.have.status(200)
              })
              .then( () => request('get', '/api/boards/2'))
              .then(response => {
                expect(response).to.have.status(404)
              })
          })
        })

        // DELETE
        describe('POST /api/boards/<non-existant board id>/delete', () => {
          it('should return a null JSON object and a 404 error', () => {
            return request('post', '/api/boards/52/delete').then(response => {
              expect(response).to.have.status(404)
            })
          })
        })


        // CREATE LIST
        describe('POST /api/boards/:boardId/lists', () => {
          it('should create a list for that board and render it as json', () => {
            const listAttributes = {
              name: 'Things to burn'
            }
            return request('post', '/api/boards/1/lists', listAttributes)
              .then(response => {
                expect(response).to.have.status(200)
                expect(response.body.id).to.be.a('number')
                expect(response.body.board_id).to.eql(1)
                expect(response.body.name).to.eql('Things to burn')
              })
          })
        })

        // CREATE BOARD
        describe('POST /api/boards/:boardId/lists/:listId/cards', () => {
          it('should create a card for that list and board and render it as json', () => {
            const cardAttributes = {
              content: 'Old Passport'
            }
            return request('post', '/api/boards/1/lists/40/cards', cardAttributes)
              .then(response => {
                expect(response).to.have.status(200)
                expect(response.body.id).to.be.a('number')
                expect(response.body.board_id).to.eql(1)
                expect(response.body.list_id).to.eql(40)
                expect(response.body.content).to.eql('Old Passport')
              })
          })
        })
      })

    })

  })
})
