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

      //CREATE COMMENT
      describe('POST /api/cards/:cardId/comments', () => {
        it('should add a comment to the card', () => {
          const cardComments = board => board.cards.find(card => card.id === 81).comments

          return request('post', '/api/cards/81/comments', { userId: 1455, content:'hello comment 2' })
            .then(response => expect(response).to.have.status(200) )
            .then(() => queries.getBoardById(101))
            .then(board =>
              expect(cardComments(board)[0]).to.eql(
                {
                  id:2,
                  user_id:1455,
                  card_id:81,
                  content:'hello comment 2',
                  created_at:cardComments(board)[0].created_at,
                  updated_at:cardComments(board)[0].updated_at,
                }
              )
            )
        })
      })

      //UPDATE COMMENT
      describe('POST /api/cards/:cardId/comments/:commentId', () => {
        it('should update the content of a comment', () => {
          const cardComments = board => board.cards.find(card => card.id === 80).comments

          return queries.getBoardById(101)
            .then(board => expect(cardComments(board)[0].content).to.eql('old comment'))
            .then(() => request('post', '/api/cards/80/comments/1', {content: 'new comment'}))
            .then(response => expect(response).to.have.status(200))
            .then(() => queries.getBoardById(101))
            .then(board => expect(cardComments(board)[0].content).to.eql('new comment'))
        })
      })

      //DELETE COMMENT
      describe('POST /api/cards/:cardId/comments/:commentId/delete', () => {
        it('should delete a comment', () => {
          const cardComments = board => board.cards.find(card => card.id === 80).comments

          return queries.getBoardById(101)
            .then(board => expect(cardComments(board).length).to.eql(1))
            .then(() => request('post','/api/cards/80/comments/1/delete'))
            .then(() => queries.getBoardById(101))
            .then(board => expect(cardComments(board).length).to.eql(0))
        })
      })

      describe('POST /api/cards/:cardId/users/add', () => {
        it('should add a user to a card', () => {
          const cardUsers = board =>
            board.cards.find( card => card.id === 81).user_ids

          return queries.getBoardById(101)
            .then( board => expect(cardUsers(board)).to.eql([]))
            .then( () =>
              request('post', '/api/cards/81/users/add', {
                boardId: 101,
                userId: 1455,
                targetId: 1455,
              })
            )
            .then( () => queries.getBoardById(101))
            .then( board => expect(cardUsers(board)).to.eql([1455]))
        })
      })

      describe('POST /api/cards/:cardId/users/remove', () => {
        it('should remove a user from a card', () => {
          const dataOptions = { boardId: 101, userId: 1455, targetId: 1455, cardId: 87}
          const cardUsers = board =>
            board.cards.find( card => card.id === 87).user_ids
          return queries.getBoardById(101)
            .then( board => expect(cardUsers(board)).to.eql([1455]))
            .then( () => request('post', '/api/cards/87/users/remove', dataOptions))
            .then( () => queries.getBoardById(101))
            .then( board => expect(cardUsers(board)).to.eql([]))
        })
      })

    })
  })
})
