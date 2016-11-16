const { expect, request, queries, commands } = require('../../setup')
const{
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
} = require('../../helpers')

describe('/api/users', () => {
  withBoardsListsAndCardsInTheDatabase(() => {

    context('when not logged in', () => {
      // LOCK BOARDS DROPDOWN MENU
      describe('POST /api/users/:userId/lockdropdown', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/users/1455/lockdropdown')
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })

      // UNLOCK BOARDS DROPDOWN MENU
      describe('POST /api/users/:userId/unlockdropdown', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/lists/1455/unlockdropdown')
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

      // LOCK BOARDS DROPDOWN MENU
      describe('POST /api/users/:userId/lockdropdown', () => {
        it('should lock the boards dropdown menu', () => {
          return queries.getUserById(1455)
            .then(user => {
              expect(user).to.be.a('object')
              expect(user.id).to.eql(1455)
              expect(user.boards_dropdown_lock).to.eql(false)
            })
            .then(() => request('post', '/api/users/1455/lockdropdown'))
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then(() => queries.getUserById(1455))
            .then(user => {
              expect(user).to.be.a('object')
              expect(user.id).to.eql(1455)
              expect(user.boards_dropdown_lock).to.eql(true)
            })
        })
      })

      // UNLOCK BOARDS DROPDOWN MENU
      describe('POST /api/users/:userId/unlockdropdown', () => {
        it('should lock the boards dropdown menu', () => {
          return request('post', '/api/users/1455/lockdropdown')
            .then(() => queries.getUserById(1455))
            .then(user => {
              expect(user).to.be.a('object')
              expect(user.id).to.eql(1455)
              expect(user.boards_dropdown_lock).to.eql(true)
            })
            .then(() => request('post', '/api/users/1455/unlockdropdown'))
            .then(response => {
              expect(response).to.have.status(200)
            })
            .then(() => queries.getUserById(1455))
            .then(user => {
              expect(user).to.be.a('object')
              expect(user.id).to.eql(1455)
              expect(user.boards_dropdown_lock).to.eql(false)
            })
        })
      })

    })

  })
})
