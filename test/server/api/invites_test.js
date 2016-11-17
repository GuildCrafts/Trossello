const { expect, request, knex, queries, commands } = require('../../setup')
const {
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
} = require('../../helpers')

const getInvites = () =>
  knex.table('invites').select('*')

describe('POST /api/invites/:boardId', () => {

  withBoardsListsAndCardsInTheDatabase( () => {
    context('when logged in', () => {
      beforeEach(() => {
        return loginAs(1455)
      })

      it('should have a null response.json', () => {
        const inviteAttributes = {
          boardId: 101,
          email:'mark@zuckerburg.io',
          token: '12'
        }

        return request('post', '/api/invites/101', inviteAttributes )
          .then(response => {
            expect(response).to.have.status(200)
            expect(response.body).to.eql(null)
        })
      })

      it('should add an invitation to the database', () => {
        return getInvites()
          .then( response => {
            const invitedEmails = response.map(invitee => invitee.email)
            expect(invitedEmails).to.not.include('larry@harvey.to')
          })
          .then( () => request('post', '/api/invites/101', { email: 'larry@harvey.to' }))
          .then( () => getInvites())
          .then( response => {
            const invitedEmails = response.map(invitee => invitee.email)
            expect(invitedEmails).to.include('larry@harvey.to')
          })

      })

      // get board, check if user is added, then check again
      describe('GET api/invites/verify/:token', () => {
        it('should add a user if token is verified', () => {
          return request('get', '/api/boards/')
            .then( response => {
              const userBoards = response.body.map(board => board.id)
              expect(userBoards).to.not.include(104)
            })
            .then( () => request('post', '/api/invites/104', {email: 'mark@zuckerburg.io'}))
            .then( () => getInvites())
            .then( response => {
              const invitedTokens = response.map(invitee => invitee.token)
              return request('get', `/api/invites/verify/${invitedTokens[0]}`)
            })
            .then( () => request('get', '/api/boards/') )
            .then( response => {
              const userBoards = response.body.map(board => board.id)
              expect(userBoards).to.include(104)
            })
        })
      })
    })
  })
})
