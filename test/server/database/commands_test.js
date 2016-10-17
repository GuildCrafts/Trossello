const { expect, knex, queries, commands } = require('../../setup')
const {
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
} = require('../../helpers')


describe('database.commands', () => {

  describe('createUser', () => {

    it('should insert a record into the users table', () => {
      const userAttributes = {
        name: 'Weird Al',
        email: 'weird@al.sexy',
      }
      return commands.createUser(userAttributes).then(user => {
        expect(user).to.be.a('object')
        expect(user.id).to.be.a('number')

        return queries.getUsers().then( users => {
          expect(users).to.be.a('array')
          expect(users.length).to.eql(1)
        })
      })
    })

  })

  describe('updateUser', () => {

    withTwoUsersInTheDatabase(() => {

      it('should update a user with given attributes', () => {
        const userAttributes = {
          name: 'Majid Rahimi',
          email: 'majid@gmail.com',
        }
        return commands.updateUser(1455, userAttributes).then( user => {
          expect(user).to.be.a('object')
          expect(user.id).to.eql(1455)
          expect(user.name).to.eql('Majid Rahimi')
          expect(user.email).to.eql('majid@gmail.com')

          return queries.getUsers().then( users => {
            expect(users.length).to.eql(2)
            users.forEach(user => {
              if (user.id === 1455){
                expect(user).to.be.a('object')
                expect(user.id).to.eql(1455)
                expect(user.name).to.eql('Majid Rahimi')
                expect(user.email).to.eql('majid@gmail.com')
              }else if (user.id === 6672){
                expect(user).to.be.a('object')
                expect(user.id).to.eql(6672)
                expect(user.name).to.eql('Larry Harvey')
                expect(user.email).to.eql('larry@harvey.to')
              }else{
                throw new Error('unexpected user record')
              }
            })
          })
        })
      })

    })

  })

  describe('deleteUser', () => {
    withTwoUsersInTheDatabase(() => {
      it('should delete a user by user id', () => {
        return queries.getUserById(1455).then( user => {
          expect(user).to.be.a('object')
          expect(user.id).to.eql(1455)
          return commands.deleteUser(1455).then( () => {
            return queries.getUserById(1455).then( user => {
              expect(user).to.be.undefined
            })
          })
        })
      })
    })
  })

  describe('findOrCreateUserFromGithubProfile', () => {
    withTwoUsersInTheDatabase(() => {

      context('when logging in as a new user', () => {
        it('should create a new user record', () => {
          const githubProfile = {
            id: 445,
            name: 'Page Hathaway',
            email: 'page@hathaway.io',
            avatar_url: 'http://page.com/hathaway.jpg',
          }
          return commands.findOrCreateUserFromGithubProfile(githubProfile).then(user => {
            expect(user.id).to.be.a('number')
            expect(user.id).to.not.eql(1455)
            expect(user.id).to.not.eql(6672)
          })
        })
      })

      context('when logging in as an existing user', () => {
        it('should find that user record by its github_id', () => {
          const githubProfile = {
            id: 22312,
            name: 'Mark Elliot Zuckerburg',
            email: 'mark@zuckerburg.io',
            avatar_url: 'http://mark.com/zucker.jpg',
          }
          return commands.findOrCreateUserFromGithubProfile(githubProfile).then(user => {
            expect(user.id).to.eql(1455)
          })
        })
      })

    })
  })

  describe('createCard', () => {
    it('should insert a card into the cards table', () => {
      return knex.table('cards').count()
        .then((results) => {
          expect(results[0].count).to.eql('0')
        })
        .then(() =>
          commands.createCard({
            list_id: 88,
            content: 'wash your face'
          })
        )
        .then(card => {
          expect(card.id).to.be.a('number')
          expect(card.list_id).to.eql(88)
          expect(card.content).to.eql('wash your face')
        })
        .then(() => knex.table('cards').count())
        .then((results) => {
          expect(results[0].count).to.eql('1')
        })

    })

  })

  describe('updateCard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should update a card with given attributes', () => {
        const cardAttributes = {
          content: 'This content has been updated',
        }
        return commands.updateCard(80, cardAttributes).then( card => {
          expect(card).to.be.a('object')
          expect(card.id).to.eql(80)
          expect(card.content).to.eql('This content has been updated')
          return knex.table('cards').then( cards => {
            expect(cards.length).to.eql(4)
            cards.forEach(card => {
              if (card.id === 80){
                expect(card).to.be.a('object')
                expect(card.list_id).to.eql(40)
                expect(card.content).to.eql('This content has been updated')
              }else if (card.id === 81){
                expect(card).to.be.a('object')
                expect(card.list_id).to.eql(40)
                expect(card.content).to.eql('Card2')
              }
            })
          })
        })
      })
    })
  })

  describe('deleteCard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should delete a card by card id', () => {
        return queries.getCardById(83).then( card => {
          expect(card).to.be.a('object')
          expect(card.id).to.eql(83)
          return commands.deleteCard(83).then( () => {
            return queries.getCardById(83).then( card => {
              expect(card).to.be.undefined
            })
          })
        })
      })
    })
  })

  describe('archiveCard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should archive a card by card id', () => {
        return queries.getCardById(83).then( card => {
          expect(card).to.be.a('object')
          expect(card.id).to.eql(83)
          return commands.archiveCard(83).then( () => {
            return queries.getCardById(83).then( card => {
              expect(card).to.be.undefined
            })
          })
        })
      })
    })
  })

  describe('createBoard', () => {
    it('should create a new board entry in db, and associate it with a user', () => {
      return commands.createBoard(15, {name: "My Board"})
        .then(board => {
          expect(board.name).to.eql("My Board")
          expect(board.background_color).to.eql("#0079bf")
          return queries.getBoardsByUserId(15)
          .then(boards => {
            expect(boards.length).to.eql(1)
            expect(boards[0].id).to.eql(board.id)
            expect(boards[0].name).to.eql("My Board")
            expect(boards[0].background_color).to.eql("#0079bf")
          })
        })
    })
  })

  describe('updateBoard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should update a board with given attributes',() => {
        const newAttributes = {
          name: "NewBoardName"
        }
        return commands.updateBoard(1, newAttributes)
          .then( board => {
            expect(board.id).to.eql(1)
            expect(board.name).to.eql('NewBoardName')
          })
      })
    })
  })

  describe('deleteBoard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should delete a board by board id', () => {
        return commands.deleteBoard(1)
        .then( () => {
          return queries.getBoardById(1).then( board => {
            expect(board).to.be.undefined
          })
        })
      })
    })
  })

})
