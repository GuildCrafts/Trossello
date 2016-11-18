const { expect, knex, queries, commands, mailer } = require('../../setup')
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

        expect(mailer.transporter.sentEmails).to.eql([
          {
            "from": "\"Trossello\" no-reply@trossello.com",
            "html": "<p>Welcome Weird Al</p>",
            "subject": "Welcome to Trossello",
            "text": "Welcome to Trossello.",
            "to": "weird@al.sexy",
          }
        ])

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
            expect(users.length).to.eql(3)
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
              }else if (user.id === 10000){
                expect(user).to.be.a('object')
                expect(user.id).to.eql(10000)
                expect(user.name).to.eql('Bob Taylor')
                expect(user.email).to.eql('bob@bob.com')
              } else {
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

  describe('removeUserFromBoard', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should remove a user from a board by user id', () => {
        return queries.getBoardsByUserId(1455).then( boards => {
          expect(boards[0].id).to.be.eql(101)
          return commands.removeUserFromBoard(1455,101).then( () => {
            return queries.getBoardsByUserId(1455).then( boards => {
              expect(boards[0].id).to.not.eql(101)
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

  describe('lockDropdown', () => {
    withTwoUsersInTheDatabase(() => {
      it('should lock the boards dropdown menu', () => {
        return queries.getUserById(1455)
          .then(user => {
            expect(user).to.be.a('object')
            expect(user.id).to.eql(1455)
            expect(user.boards_dropdown_lock).to.eql(false)
          })
          .then(() => commands.lockDropdown(1455))
          .then(() => {
            queries.getUserById(1455)
              .then(user => {
                expect(user).to.be.a('object')
                expect(user.id).to.eql(1455)
                expect(user.boards_dropdown_lock).to.eql(true)
              })
          })
      })
    })
  })

  describe('unlockDropdown', () => {
    withTwoUsersInTheDatabase(() => {
      it('should lock the boards dropdown menu', () => {
        return commands.lockDropdown(1455)
          .then(() => {
            queries.getUserById(1455)
              .then(user => {
                expect(user).to.be.a('object')
                expect(user.id).to.eql(1455)
                expect(user.boards_dropdown_lock).to.eql(true)
              })
          })
          .then(() => commands.unlockDropdown(1455))
          .then(() => {
            queries.getUserById(1455)
              .then(user => {
                expect(user).to.be.a('object')
                expect(user.id).to.eql(1455)
                expect(user.boards_dropdown_lock).to.eql(false)
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
            expect(cards.length).to.eql(11)
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
              expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
              expect(list40Cards.map(card => card.id)     ).to.eql([80,81,82,90,91])
              expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40,40])
            })
            .then( () =>
              commands.moveCard({
                boardId: 101,
                cardId: 81,
                listId: 40,
                order: 3,
              })
            )
            .then( () => queries.getBoardById(101))
            .then(board => {
              let list40Cards = getOrderedCardsByListId(board, 40)
              expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
              expect(list40Cards.map(card => card.id)     ).to.eql([80,82,90,81,91])
              expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40,40])
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
              expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
              expect(list40Cards.map(card => card.id)     ).to.eql([81,80,82,90,91])
              expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40,40])
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

              expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
              expect(list40Cards.map(card => card.id)     ).to.eql([80,81,82,90,91])
              expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40,40])

              expect(list41Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
              expect(list41Cards.map(card => card.id)     ).to.eql([83,84,85,86,87])
              expect(list41Cards.map(card => card.list_id)).to.eql([41,41,41,41,41])
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

              expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3])
              expect(list40Cards.map(card => card.id)     ).to.eql([80,82,90,91])
              expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40])

              expect(list41Cards.map(card => card.order)  ).to.eql([0,1,2,3,4,5])
              expect(list41Cards.map(card => card.id)     ).to.eql([81,83,84,85,86,87])
              expect(list41Cards.map(card => card.list_id)).to.eql([41,41,41,41,41,41])
            })
            .then( () =>
              commands.moveCard({
                boardId: 101,
                cardId: 81,
                listId: 40,
                order: 3,
              })
            )
            .then( () => queries.getBoardById(101))
            .then(board => {
              let list40Cards = getOrderedCardsByListId(board, 40)
              let list41Cards = getOrderedCardsByListId(board, 41)

              expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
              expect(list40Cards.map(card => card.id)     ).to.eql([80,82,90,81,91])
              expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40,40])

              expect(list41Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
              expect(list41Cards.map(card => card.id)     ).to.eql([83,84,85,86,87])
              expect(list41Cards.map(card => card.list_id)).to.eql([41,41,41,41,41])
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

            expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
            expect(list40Cards.map(card => card.id)     ).to.eql([80,81,82,90,91])
            expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40,40])

            expect(list41Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
            expect(list41Cards.map(card => card.id)     ).to.eql([83,84,85,86,87])
            expect(list41Cards.map(card => card.list_id)).to.eql([41,41,41,41,41])
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

            expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
            expect(list40Cards.map(card => card.id)     ).to.eql([81,80,82,90,91])
            expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40,40])

            expect(list41Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
            expect(list41Cards.map(card => card.id)     ).to.eql([83,84,85,86,87])
            expect(list41Cards.map(card => card.list_id)).to.eql([41,41,41,41,41])
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

            expect(list40Cards.map(card => card.order)  ).to.eql([0,1,2,3])
            expect(list40Cards.map(card => card.id)     ).to.eql([80,82,90,91])
            expect(list40Cards.map(card => card.list_id)).to.eql([40,40,40,40])

            expect(list41Cards.map(card => card.order)  ).to.eql([0,1,2,3,4,5])
            expect(list41Cards.map(card => card.id)     ).to.eql([81,83,84,85,86,87])
            expect(list41Cards.map(card => card.list_id)).to.eql([41,41,41,41,41,41])
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

  describe('unarchiveCard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should unarchive a card by card id', () => {
        return commands.archiveCard(83).then( () => {
          return queries.getCardById(83).then( card => {
            expect(card.archived).to.eql(true)
            return commands.unarchiveCard(83).then( () => {
              return queries.getCardById(83).then( card => {
                expect(card.archived).to.eql(false)
              })
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
            expect(board.lists[0].order).to.eql(0)
          })
        })
    })
  })

  describe('unarchiveBoard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should unarchive a board by board id', () => {
        return commands.archiveBoard(101).then( () => {
          return queries.getBoardById(101).then( board => {
            expect(board.archived).to.eql(true)
            return commands.unarchiveBoard(101).then( () => {
              return queries.getBoardById(101).then( board => {
                expect(board.archived).to.eql(false)
              })
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

  describe('moveList', () => {

    describe('when moving a list', () => {
      withBoardsListsAndCardsInTheDatabase(() => {
        it('should update list orders', () => {

          const getOrderedListByBoardId = (board) =>
            board.lists.sort( (a,b) => a.order - b.order)

          return queries.getBoardById(101)
            .then(board => {
              let orderedLists = getOrderedListByBoardId(board)
              expect(orderedLists.map(list => list.order) ).to.eql([0,1])
              expect(orderedLists.map(list => list.id) ).to.eql([40,41])
            })
            .then( () =>
              commands.moveList({
                boardId: 101,
                listId: 40,
                order: 1,
              })
          )
          .then( () => queries.getBoardById(101))
          .then(board => {
            let orderedLists = getOrderedListByBoardId(board)
            expect(orderedLists.map(list => list.order) ).to.eql([0,1])
            expect(orderedLists.map(list => list.id) ).to.eql([41,40])
          })
          .then( () =>
            commands.moveList({
              boardId: 101,
              listId: 40,
              order: 0,
            })
          )
          .then( () => queries.getBoardById(101))
          .then(board => {
            let orderedLists = getOrderedListByBoardId(board)
            expect(orderedLists.map(list => list.order) ).to.eql([0,1])
            expect(orderedLists.map(list => list.id) ).to.eql([40,41])
          })
        })
      })
    })
  })

  describe('unarchiveList', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should unarchive a list by list id', () => {
        return commands.archiveList(40).then( () => {
          return queries.getListById(40).then( list => {
            expect(list.archived).to.eql(true)
            return commands.unarchiveList(40).then( () => {
              return queries.getListById(40).then( list => {
                expect(list.archived).to.eql(false)
              })
            })
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

  describe('archiveCardsInList', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should archive all cards in a list by list id', () => {
        const getCards = () =>
          Promise.all([
            queries.getCardById(80),
            queries.getCardById(81)
          ])
        return getCards()
          .then(([card80, card81]) => {
            expect(card80).to.be.a('object')
            expect(card80.id).to.eql(80)
            expect(card80.list_id).to.eql(40)
            expect(card80.archived).to.eql(false)
            expect(card81).to.be.a('object')
            expect(card81.id).to.eql(81)
            expect(card81.list_id).to.eql(40)
            expect(card81.archived).to.eql(false)
          })
          .then( () => commands.archiveCardsInList(40))
          .then(getCards)
          .then(([card80, card81]) => {
            expect(card80).to.be.a('object')
            expect(card80.id).to.eql(80)
            expect(card80.list_id).to.eql(40)
            expect(card80.archived).to.eql(true)
            expect(card81).to.be.a('object')
            expect(card81.id).to.eql(81)
            expect(card81.list_id).to.eql(40)
            expect(card81.archived).to.eql(true)
          })
      })
    })
  })

  describe('duplicateList', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('it should duplicate the list and its cards given the new name', () => {
        return queries.getBoardById(101)
          .then( board => {
            expect(board.lists.map(list => list.order)).to.eql([0,1])
            expect(board.lists.map(list => list.name)).to.eql([
              "List1",
              "List2",
            ])
          })
          .then(_ => commands.duplicateList(101, 40, "Bob's New List" ) )
          .then(newList => {
            expect(newList).to.eql({
              id: newList.id,
              board_id: 101,
              name: "Bob's New List",
              archived: false,
              order: 2,
            })
          })
          .then(_ => queries.getBoardById(101) )
          .then( board => {
            expect(board.lists.map(list => list.order)).to.eql([0,1,2])
            expect(board.lists.map(list => list.name)).to.eql([
              "List1",
              "Bob's New List",
              "List2",
            ])
            const newListId = board.lists[0].id
            const newListCards = board.cards.filter(card => card.list_id === newListId)
            const oldListId = 40
            const oldListCards = board.cards.filter(card => card.list_id === oldListId)

            const commonProps = card => ({
              content: card.content,
              order: card.order,
            })

            expect(newListCards.map(commonProps)).to.eql(oldListCards.map(commonProps))
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

  describe('createInvite', () => {
    it('should create an invite record and send an invite email', () => {
      return commands.createInvite({
        boardId: 123,
        email: 'larry@david.org',
      }).then(invite => {
        expect(invite).to.eql({
          boardId: 123,
          email: 'larry@david.org',
          token: invite.token,
        })
        expect(mailer.transporter.sentEmails).to.eql([
          {
            "from": "\"Trossello\" no-reply@trossello.com",
            "html": `<p> You received this email because someone invited you to a Trossello board. Click this link to accept the invitation <strong><a href=/api/invites/verify/${invite.token}>Invite Link</a></strong></p>`,
            "subject": "You've been invited to a Trossello board",
            "text": "Welcome to your new board. Click the link below to join this board",
            "to": "larry@david.org",
          }
        ])
      })

    });
  });

  describe('addUserToBoard', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should add a user to a board', () => {
        return queries.getBoardsByUserId(10000).then( boards => {
          expect(boards).to.have.length(0)
          return commands.addUserToBoard(10000,101).then( () => {
            return queries.getBoardsByUserId(10000).then( boards => {
              expect(boards).to.have.length(1)
              expect(boards.map(board => board.id)).to.eql([101])
            })
          })
        })
      })
    })
  })

  describe('starBoard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should star a board by board id', () => {
        return queries.getBoardById(101).then( board => {
          expect(board).to.be.a('object')
          expect(board.id).to.eql(101)
          return commands.starBoard(101).then( () => {
            return queries.getBoardById(101).then( board => {
              expect(board.starred).to.eql(true)
            })
          })
        })
      })
    })
  })

  describe('moveAllCards', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('It should move all cards to another list', () => {
        const getOrderedCardsByListId = (board, listId) =>
          board.cards
            .filter(card => card.list_id === listId)
            .sort( (a,b) => a.order - b.order)

        return queries.getBoardById(101)
          .then(board => {
            let list40Cards = getOrderedCardsByListId(board, 40)
            let list41Cards = getOrderedCardsByListId(board, 41)

            expect(list40Cards.map(card => card.id)).to.eql([80,81,82,90,91])
            expect(list41Cards.map(card => card.id)).to.eql([83,84,85,86,87])

            expect(list40Cards.map(card => card.order)).to.eql([0,1,2,3,4])
            expect(list41Cards.map(card => card.order)).to.eql([0,1,2,3,4])
          })
          .then(_ => commands.moveAllCards(40,41) )
          .then(_ => queries.getBoardById(101) )
          .then(board => {
            let list40Cards = getOrderedCardsByListId(board, 40)
            let list41Cards = getOrderedCardsByListId(board, 41)

            expect(list40Cards.map(card => card.id)).to.eql([])
            expect(list41Cards.map(card => card.id)).to.eql([83,84,85,86,87,80,81,82,90,91])

            expect(list40Cards.map(card => card.order)).to.eql([])
            expect(list41Cards.map(card => card.order)).to.eql([0,1,2,3,4,5,6,7,8,9])
          })
      })
    })
  })

  describe('searchQuery', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should return a result if searchTerm exists', () => {
        return commands.searchQuery(1455, 'card1').then( result => {
          expect(result[0].content).to.eql('card1')
        })
      })
    })
  })

})
