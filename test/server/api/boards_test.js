const { expect, request, knex, queries, commands } = require('../../setup')
const{
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
} = require('../../helpers')

describe('/api/boards', () => {
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
          return request('post', '/api/boards/101/delete')
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })

      // CREATE LIST
      describe('POST /api/boards/:boardId/lists', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/boards/101/lists', {})
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })

      // CREATE BOARD
      describe('POST /api/boards/:boardId/lists/:listId/cards', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/boards/101/lists/1/cards', {})
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })

      // DUPLICATE LIST
      describe('POST /api/boards/:boardId/lists/:listId/duplicate', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/boards/101/lists/1/duplicate', {})
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
            expect(response.body.length).to.eql(3)
            const boardNames = response.body.map(board => board.name).sort()
            expect(boardNames).to.eql(['Board1','Board2', 'Board3'])
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
          return request('get', '/api/boards/101').then(response => {
            expect(response).to.have.status(200)
            expect(response.body.id).to.eql(101)
            expect(response.body.name).to.eql('Board1')
            expect(response.body.background_color).to.eql('orange')
          })
        })
        context('when download=1', () => {
          it('should set the xheader', () => {
            return request('get', '/api/boards/101?download=1').then(response => {                expect(response).to.have.status(200)
              expect(response).to.have.header('Content-Disposition', 'attachment; filename="board101.json"');
              expect(response).to.have.header('Content-Type', 'application/json; charset=utf-8');
              expect(response.body.id).to.eql(101)
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
            name: 'fresh board',
            starred: true
          }
          return request('post', '/api/boards/102', boardAttributes).then(response => {
            expect(response).to.have.status(200)
            expect(response.body.id).to.eql(102)
            expect(response.body.name).to.eql('fresh board')
            expect(response.body.background_color).to.eql('purple')
            expect(response.body.starred).to.eql(true)
          })
        })
      })

      // ARCHIVE
      describe('POST /api/boards/<existing board id>/archive', () => {
        it('should archive a board and render status 200', () => {
          return request('post', '/api/boards/102/archive')
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then( () => request('get', '/api/boards/102'))
            .then(response => {
              expect(response).to.have.status(200)
              expect(response.body.archived).to.eql(true)
            })
        })
      })

      // ARCHIVE
      describe('POST /api/boards/<non-existant board id>/archive', () => {
        it('should return a null JSON object and a 404 error', () => {
          return request('post', '/api/boards/52/archive').then(response => {
            expect(response).to.have.status(404)
          })
        })
      })

      // Star Board
      describe('POST /api/boards/<existing board id>/star', () => {
        it('should set starred to true and return 200', () => {
          return request('post', '/api/boards/102/star')
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then( () => request('get', '/api/boards/102'))
            .then(response => {
              expect(response).to.have.status(200)
              expect(response.body.starred).to.eql(true)
            })
        })
      })

      // Unstar Board
      describe('POST /api/boards/<existing board id>/unstar', () => {
        it('should set starred to false and return 200', () => {
          return request('post', '/api/boards/103/unstar')
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then( () => request('get', '/api/boards/103'))
            .then(response => {
              expect(response).to.have.status(200)
              expect(response.body.starred).to.eql(false)
            })
        })
      })


      // CREATE LIST
      describe('POST /api/boards/:boardId/lists', () => {
        it('should create a list for that board and render it as json', () => {
          const listAttributes = {
            name: 'Things to burn'
          }
          return request('post', '/api/boards/101/lists', listAttributes)
            .then(response => {
              expect(response).to.have.status(200)
              expect(response.body.id).to.be.a('number')
              expect(response.body.board_id).to.eql(101)
              expect(response.body.name).to.eql('Things to burn')
            })
        })
      })

      // CREATE CARD
      describe('POST /api/boards/:boardId/lists/:listId/cards', () => {
        it('should create a card for that list and board and render it as json', () => {
          const cardAttributes = {
            content: 'Old Passport'
          }
          return request('post', '/api/boards/101/lists/40/cards', cardAttributes)
            .then(response => {
              expect(response).to.have.status(200)
              expect(response.body.id).to.be.a('number')
              expect(response.body.board_id).to.eql(101)
              expect(response.body.list_id).to.eql(40)
              expect(response.body.content).to.eql('Old Passport')
            })
        })
      })
            // DUPLICATE LIST
      describe('POST /api/boards/:boardId/lists/:listId/duplicate', () => {
        it('should duplicate the list and render the new list', () => {
          return request('post', '/api/boards/101/lists/1/duplicate', {name: 'new list name'})
            .then(response => {
              expect(response).to.have.status(200)
              expect(response.body.board_id).to.eql(101)
              expect(response.body.name).to.eql("new list name")
              expect(response.body.archived).to.eql(false)
              expect(response.body.order).to.eql(2)
            })
        })
      })

      //LEAVE BOARD
      describe('POST /api/boards/:boardId/leave', () => {
        it('should remove the user from the board', () => {
          return request('get', '/api/boards/101')
            .then(response => {
              const userIds = response.body.users.map(user => user.id)
              expect(userIds).to.include(1455)
            })
            .then( () => request('post', '/api/boards/101/leave'))
            .then( response => {
              expect(response).to.have.status(200)
            })
            .then( () => request('get', '/api/boards/101'))
            .then( response => {
              const userIds = response.body.users.map(user => user.id)
              expect(userIds).to.not.include(1455)
            })

        })
      })

      //SEARCH CARDS
      describe('POST /api/boards/search', () => {
        const textSearch = {searchTerm:"hAppY"}

        it('should return cards that contain the search term', () => {
          return request ('post', '/api/boards/search', textSearch)
            .then(response => {
              expect(response).to.have.status(200)
              const cards = response.body.map(card => card.content)
              expect(cards).to.eql(['happy', 'happy card', 'HAPPY', 'HAPPYS'])
            })
        })
      })

    })
  })
})
