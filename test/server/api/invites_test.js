const { expect, request, queries, commands } = require('../../setup')
const {
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  loginAs,
} = require('../../helpers')

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
        return queries.getRecords('invites')
          .then( response => {
            const invitedEmails = response.map(invitee => invitee.email)
            expect(invitedEmails).to.not.include('larry@harvey.to')
          })
          .then( () => request('post', '/api/invites/101', { email: 'larry@harvey.to' }))
          .then( () => queries.getRecords('invites'))
          .then( response => {
            const invitedEmails = response.map(invitee => invitee.email)
            expect(invitedEmails).to.include('larry@harvey.to')
          })
      })
    })
  })
})
