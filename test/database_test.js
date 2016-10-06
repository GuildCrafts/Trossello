const { expect, queries, commands } = require('./setup')

describe('database', () => {

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

  context('when there are users in the database', () => {
    beforeEach( () => {
      return Promise.all([
        commands.createUser({
          id: 1455,
          github_id: 22312,
          name: 'Mark Zuckerburg',
          email: 'mark@zuckerburg.io',
        }),
        commands.createUser({
          id: 6672,
          github_id: 9775,
          name: 'Larry Harvey',
          email: 'larry@harvey.to',
        })
      ])
    })

    describe('getUsers', () => {
      it('should return an array of all users', () => {
        return queries.getUsers().then( users => {
          expect(users).to.be.a('array')
          expect(users.length).to.eql(2)

          users.forEach(user => {
            if (user.id === 1455){
              expect(user).to.be.a('object')
              expect(user.id).to.eql(1455)
              expect(user.name).to.eql('Mark Zuckerburg')
              expect(user.email).to.eql('mark@zuckerburg.io')
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

    describe('getUserById', () => {
      it('should return json by user id', () => {
        return queries.getUserById(1455).then( user => {
          expect(user).to.be.a('object')
          expect(user.id).to.eql(1455)
          expect(user.name).to.eql('Mark Zuckerburg')
          expect(user.email).to.eql('mark@zuckerburg.io')
        })
      })
    })

    describe('deleteUser', () => {
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

    describe('updateUser', () => {

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

    describe('findOrCreateUserFromGithubProfile', () => {
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

  context('when there are cards in the database', () => {
    beforeEach( () => {
      return Promise.all([
        commands.createCard({
          id: 11,
          board_id: 22,
          list_id: 33,
          content: 'getting done the project',
        }),
        commands.createCard({
          id: 10,
          board_id: 20,
          list_id: 30,
          content: 'Having fun in this evening',
        })
      ])
    })

    describe('getCardById', () => {
      it('should return json by card id', () => {
        return queries.getCardById(11).then( card => {
          expect(card).to.be.a('object')
          expect(card.id).to.eql(11)
          expect(card.board_id).to.eql(22)
          expect(card.list_id).to.eql(33)
          expect(card.content).to.eql('getting done the project')

        })
      })
    })

    describe('deleteCard', () => {
      it('should delete a card by card id', () => {
        return queries.getCardById(11).then( card => {
          expect(card).to.be.a('object')
          expect(card.id).to.eql(11)
          return commands.deleteCard(11).then( () => {
            return queries.getCardById(11).then( card => {
              expect(card).to.be.undefined
            })
          })
        })
      })
    })

    describe('updateCard', () => {

      it('should update a card with given attributes', () => {
        const cardAttributes = {
          content: 'This content has been updated',
        }
        return commands.updateCard(11, cardAttributes).then( card => {
          expect(card).to.be.a('object')
          expect(card.id).to.eql(11)
          expect(card.content).to.eql('This content has been updated')
          return queries.getCards().then( cards => {
            expect(cards.length).to.eql(2)
            cards.forEach(card => {
              if (card.id === 11){
                expect(card).to.be.a('object')
                expect(card.board_id).to.eql(22)
                expect(card.list_id).to.eql(33)
                expect(card.content).to.eql('This content has been updated')
              }else if (card.id === 10){
                expect(card).to.be.a('object')
                expect(card.board_id).to.eql(20)
                expect(card.list_id).to.eql(30)
                expect(card.content).to.eql('Having fun in this evening')
              }else{
                throw new Error('unexpected card record')
              }
            })
          })
        })
      })

    })

  })
  
  describe('when there are 0 boards in the database', () => {

    describe('getBoardsByUserId', () => {
      it('should return an empty array', () => {
        const userId = 14
        return queries.getBoardsByUserId(userId).then( boards => {
          expect(boards.length).to.eql(0)
        })
      })
    })

    describe('getBoardById', () => {
      it('should return an empty array', () => {
        return queries.getBoardById(1).then( board => {
          expect(board).to.be.undefined
        })
      })
    })

    describe('createBoard', () => {
      it('should create a new board entry in db, and associate it with a user', () => {
        return commands.createBoard(15, {name: "My Board"})
        .then(board => {
          expect(board.name).to.eql("My Board")
          return queries.getBoardsByUserId(15)
          .then(boards => {
            expect(boards.length).to.eql(1)
            expect(boards[0].name).to.eql("My Board")
            expect(boards[0].id).to.eql(board.id)
          })
        })
      })
    })

  })

  describe('when there are 2 boards in the database', () => {
    beforeEach( () => {
      return Promise.all([
        commands.createBoard(14, {
          id: 1,
          name: 'Board1'
        }),
        commands.createBoard(14, {
          id: 2,
          name: 'Board2'
        })
      ])
    })

    describe('getBoardsByUserId', () => {

      it('should return an array of all boards', () => {
        return queries.getBoardsByUserId(14).then( boards => {
          expect(boards.length).to.eql(2)
          expect(boards[0].name).to.eql('Board1')
        })
      })
    })

    describe('getBoardById', () => {

      beforeEach( () => {
        return Promise.all([
          commands.createList(1, {
            id: 40,
            name: 'List1'
          }),
          commands.createList(1, {
            id: 41,
            name: 'List2'
          }),
          commands.createCard(40, {
            id: 80,
            content: 'card1'
          }),
          commands.createCard(40, {
            id: 81,
            content: 'Card2'
          }),
          commands.createCard(41, {
            id: 82,
            content: 'card3'
          }),
          commands.createCard(41, {
            id: 83,
            content: 'Card4'
          }),
        ])
      })

      it('should return one board by user id', () => {
        return queries.getBoardById(1).then( board => {
          expect(board).to.eql({
            id: 1,
            name: 'Board1',
            background_color: '#0079bf',
            lists:[
              { id: 40, board_id: 1, name: 'List1' },
              { id: 41, board_id: 1, name: 'List2' },
            ],
            cards: [
              { id: 80, board_id: null, list_id: 40, content: 'card1' },
              { id: 81, board_id: null, list_id: 40, content: 'Card2' },
              { id: 82, board_id: null, list_id: 41, content: 'card3' },
              { id: 83, board_id: null, list_id: 41, content: 'Card4' },
            ],
          })
        })
      })
    })

    describe('updateBoard', () => {

      it('should update a board with given attributes',() => {
        const newAttributes = {
          name: "NewBoardName"
        }
        return commands.updateBoard(1, newAttributes)
        .then( board => {
          expect(board.name).to.eql('NewBoardName')
        })
      })
    })

    describe('deleteBoard', () => {

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
