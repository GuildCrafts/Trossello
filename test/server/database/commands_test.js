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
            board_id: 341,
            list_id: 88,
            content: 'wash your face'
          })
        )
        .then(card => {
          expect(card.id).to.be.a('number')
          expect(card.board_id).to.eql(341)
          expect(card.list_id).to.eql(88)
          expect(card.content).to.eql('wash your face')
          expect(card.archived).to.eql(false)
          expect(card.order).to.eql(0)
        })
        .then(() =>
          commands.createCard({
            board_id: 341,
            list_id: 88,
            content: 'wash your feet'
          })
        )
        .then(card => {
          expect(card.id).to.be.a('number')
          expect(card.board_id).to.eql(341)
          expect(card.list_id).to.eql(88)
          expect(card.content).to.eql('wash your feet')
          expect(card.archived).to.eql(false)
          expect(card.order).to.eql(1)
        })
        .then(() => knex.table('cards').count())
        .then((results) => {
          expect(results[0].count).to.eql('2')
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

  describe('moveCard', () => {

    describe('when moving on the same list', () => {
      withBoardsListsAndCardsInTheDatabase(() => {
        it('should update card orders in list', () => {

          const getOrderedCardsByListId = (board, listId) =>
            board.cards
              .filter(card => card.list_id === listId)
              .sort( (a,b) => a.order - b.order)

          return queries.getBoardById(101)
            .then(board => {
              let list40Cards = getOrderedCardsByListId(board, 40)

              expect(list40Cards.length).to.eql(2)
              expect(list40Cards[0].content).to.eql('card1')
              expect(list40Cards[0].order  ).to.eql(0)
              expect(list40Cards[1].content).to.eql('Card2')
              expect(list40Cards[1].order  ).to.eql(1)
            })
            .then( () =>
              commands.moveCard({
                boardId: 101,
                cardId: 81, // content: 'Card2'
                listId: 40,
                order: 0,
              })
            )
            .then( () => queries.getBoardById(101))
            .then(board => {
              let list40Cards = getOrderedCardsByListId(board, 40)
              expect(list40Cards.length).to.eql(2)
              expect(list40Cards[0].content).to.eql('Card2')
              expect(list40Cards[0].order  ).to.eql(0)
              expect(list40Cards[1].content).to.eql('card1')
              expect(list40Cards[1].order  ).to.eql(1)
            })
        })
      })
    })

    describe('when moving between two lists', () => {
      withBoardsListsAndCardsInTheDatabase(() => {
        it('should update card orders', () => {
          const getOrderedCardsByListId = (board, listId) =>
            board.cards
              .filter(card => card.list_id === listId)
              .sort( (a,b) => a.order - b.order)

          return queries.getBoardById(101)
            .then(board => {
              let list40Cards = getOrderedCardsByListId(board, 40)
              let list41Cards = getOrderedCardsByListId(board, 41)

              expect(list40Cards.length).to.eql(2)
              expect(list40Cards[0].id).to.eql(80)
              expect(list40Cards[0].list_id).to.eql(40)
              expect(list40Cards[0].order  ).to.eql(0)
              expect(list40Cards[1].id).to.eql(81)
              expect(list40Cards[1].list_id).to.eql(40)
              expect(list40Cards[1].order  ).to.eql(1)

              expect(list41Cards.length).to.eql(2)
              expect(list41Cards[0].id).to.eql(82)
              expect(list41Cards[0].list_id).to.eql(41)
              expect(list41Cards[0].order  ).to.eql(0)
              expect(list41Cards[1].id).to.eql(83)
              expect(list41Cards[1].list_id).to.eql(41)
              expect(list41Cards[1].order  ).to.eql(1)
            })
            .then( () =>
              commands.moveCard({
                boardId: 101,
                cardId: 81,
                listId: 41,
                order: 0,
              })
            )
            .then( () => queries.getBoardById(101))
            .then(board => {
              let list40Cards = getOrderedCardsByListId(board, 40)
              let list41Cards = getOrderedCardsByListId(board, 41)

              expect(list40Cards.length).to.eql(1)
              expect(list40Cards[0].id).to.eql(80)
              expect(list40Cards[0].list_id).to.eql(40)
              expect(list40Cards[0].order  ).to.eql(0)

              expect(list41Cards.length).to.eql(3)
              expect(list41Cards[0].id).to.eql(81)
              expect(list41Cards[0].list_id).to.eql(41)
              expect(list41Cards[0].order  ).to.eql(0)
              expect(list41Cards[1].id).to.eql(82)
              expect(list41Cards[1].list_id).to.eql(41)
              expect(list41Cards[1].order  ).to.eql(1)
              expect(list41Cards[2].id).to.eql(83)
              expect(list41Cards[2].list_id).to.eql(41)
              expect(list41Cards[2].order  ).to.eql(2)
            })
        })
      })
    })

    withBoardsListsAndCardsInTheDatabase(() => {
      it('should update card orders', () => {

        const getOrderedCardsByListId = (board, listId) =>
          board.cards
            .filter(card => card.list_id === listId)
            .sort( (a,b) => a.order - b.order)

        return queries.getBoardById(101)
          .then(board => {
            let list40Cards = getOrderedCardsByListId(board, 40)
            let list41Cards = getOrderedCardsByListId(board, 41)

            expect(list40Cards.length).to.eql(2)
            expect(list40Cards[0].content).to.eql('card1')
            expect(list40Cards[0].order  ).to.eql(0)
            expect(list40Cards[1].content).to.eql('Card2')
            expect(list40Cards[1].order  ).to.eql(1)

            expect(list41Cards.length).to.eql(2)
            expect(list41Cards[0].content).to.eql('card3')
            expect(list41Cards[0].order  ).to.eql(0)
            expect(list41Cards[1].content).to.eql('Card4')
            expect(list41Cards[1].order  ).to.eql(1)
          })
          .then( () =>
            commands.moveCard({
              boardId: 101,
              cardId: 81,
              listId: 40,
              order: 0,
            })
          )
          .then( () => queries.getBoardById(101))
          .then(board => {
            let list40Cards = getOrderedCardsByListId(board, 40)
            let list41Cards = getOrderedCardsByListId(board, 41)

            expect(list40Cards.length).to.eql(2)
            expect(list40Cards[0].content).to.eql('Card2')
            expect(list40Cards[0].order  ).to.eql(0)
            expect(list40Cards[1].content).to.eql('card1')
            expect(list40Cards[1].order  ).to.eql(1)

            expect(list41Cards.length).to.eql(2)
            expect(list41Cards[0].content).to.eql('card3')
            expect(list41Cards[0].order  ).to.eql(0)
            expect(list41Cards[1].content).to.eql('Card4')
            expect(list41Cards[1].order  ).to.eql(1)
          })
          .then( () =>
            commands.moveCard({
              boardId: 101,
              cardId: 81,
              listId: 41,
              order: 0,
            })
          )
          .then( () => queries.getBoardById(101))
          .then(board => {
            let list40Cards = getOrderedCardsByListId(board, 40)
            let list41Cards = getOrderedCardsByListId(board, 41)

            expect(list40Cards.length).to.eql(1)
            expect(list40Cards[0].content).to.eql('card1')
            expect(list40Cards[0].order  ).to.eql(0)

            expect(list41Cards.length).to.eql(3)
            expect(list41Cards[0].content).to.eql('Card2')
            expect(list41Cards[0].order  ).to.eql(0)
            expect(list41Cards[1].content).to.eql('card3')
            expect(list41Cards[1].order  ).to.eql(1)
            expect(list41Cards[2].content).to.eql('Card4')
            expect(list41Cards[2].order  ).to.eql(2)
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
              expect(card.archived).to.eql(true)
            })
          })
        })
      })
    })
  })

  describe('createList', () => {
    beforeEach(() =>
      commands.createBoard(1455, {
        id: 83,
        name: 'Things To Eat',
        background_color: 'orange',
      })
    )
    it('should create a new list for the given board', () => {
      const attributes = {
        board_id: 83,
        name: "Fried Foods"
      }
      return commands.createList(attributes)
        .then(list => {
          expect(list.name).to.eql("Fried Foods")
          expect(list.board_id).to.eql(83)
          expect(list.archived).to.eql(false)
          return queries.getBoardById(83).then(board => {
            expect(board.lists.length).to.eql(1)
            expect(board.lists[0].name).to.eql("Fried Foods")
            expect(board.lists[0].board_id).to.eql(83)
            expect(board.lists[0].archived).to.eql(false)
          })
        })
    })
  })

  describe('updateList', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should update a list with given attributes', () => {
        const newAttributes = {
          name: "NewListName"
        }
        return commands.updateList(40, newAttributes)
          .then( list => {
            expect(list.id).to.eql(40)
            expect(list.name).to.eql('NewListName')
          })
      })
    })
  })

  describe('deleteList', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should delete a board by board id', () => {
        return queries.getListById(40)
          .then(list => {
            expect(list.id).to.eql(40)
            expect(list.name).to.eql('List1')
            return commands.deleteList(40)
          })
          .then( () => queries.getListById(40) )
          .then( list => {
            expect(list).to.be.undefined
          })
      })
    })
  })

  describe('archiveBoard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should archive a board by board id', () => {
        return queries.getBoardById(101).then( board => {
          expect(board).to.be.a('object')
          expect(board.id).to.eql(101)
          return commands.archiveBoard(101).then( () => {
            return queries.getBoardById(101).then( board => {
              expect(board.archived).to.eql(true)
            })
          })
        })
      })
    })
  })

  describe('updateList', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should update a list with given attributes', () => {
        const newAttributes = {
          name: "NewListName"
        }
        return commands.updateList(40, newAttributes)
          .then( list => {
            expect(list.id).to.eql(40)
            expect(list.name).to.eql('NewListName')
          })
      })
    })
  })

  describe('deleteList', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should delete a board by board id', () => {
        return queries.getListById(40)
          .then(list => {
            expect(list.id).to.eql(40)
            expect(list.name).to.eql('List1')
            return commands.deleteList(40)
          })
          .then( () => queries.getListById(40) )
          .then( list => {
            expect(list).to.be.undefined
          })
      })
    })
  })

  describe('archiveList', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should archive a board by board id', () => {
        return queries.getListById(40).then( list => {
          expect(list).to.be.a('object')
          expect(list.id).to.eql(40)
          return commands.archiveList(40).then( () => {
            return queries.getListById(40).then( list => {
              expect(list.archived).to.eql(true)
            })
          })
        })
      })
    })
  })

  describe('createBoard', () => {
    it('should create a new board entry in db, and associate it with a user', () => {
      return commands.createBoard(15, {name: "My Board", archived: false,})
        .then(board => {
          expect(board.name).to.eql("My Board")
          expect(board.background_color).to.eql("#0079bf")
          return queries.getBoardsByUserId(15)
          .then(boards => {
            expect(boards.length).to.eql(1)
            expect(boards[0].id).to.eql(board.id)
            expect(boards[0].name).to.eql("My Board")
            expect(boards[0].background_color).to.eql("#0079bf")
            expect(boards[0].archived).to.eql(false)
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
        return commands.updateBoard(101, newAttributes)
          .then( board => {
            expect(board.id).to.eql(101)
            expect(board.name).to.eql('NewBoardName')
          })
      })
    })
  })

  describe('deleteBoard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should delete a board by board id', () => {
        return commands.deleteBoard(101)
        .then( () => {
          return queries.getBoardById(101).then( board => {
            expect(board).to.be.undefined
          })
        })
      })
    })
  })

  describe('archiveBoard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should archive a board by board id', () => {
        return queries.getBoardById(101).then( board => {
          expect(board).to.be.a('object')
          expect(board.id).to.eql(101)
          return commands.archiveBoard(101).then( () => {
            return queries.getBoardById(101).then( board => {
              expect(board.archived).to.eql(true)
            })
          })
        })
      })
    })
  })

})
