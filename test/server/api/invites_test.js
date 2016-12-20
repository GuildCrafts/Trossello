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

      it('should have invite data in its response.json', () => {
        const inviteAttributes = {
          email:'mark@zuckerburg.io',
        }

        return request('post', '/api/invites/101', inviteAttributes )
          .then(response => {
            expect(response).to.have.status(200)
            expect(response.body.email).to.eql('mark@zuckerburg.io')
            expect(response.body.boardId).to.eql(101)
            expect(response.body.token).to.have.length(36)
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

      it('should refrain from adding a duplicate email and return a 409 error', () => {
        const inviteAttributes = {
          email:'marriagecounseling@learnersguild.org',
        }

        return request('post', '/api/invites/101', inviteAttributes)
          .then( () => getInvites())
          .then( response => {
            const invitedEmails = response.map(invitee => invitee.email)
            expect(invitedEmails).to.include('marriagecounseling@learnersguild.org')
          })
          .then( () => request('post', '/api/invites/101', { email: 'marriagecounseling@learnersguild.org' }))
          .then( response => {
            expect(response.status).to.eql(409)
            expect(response).to.have.property('error')
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
