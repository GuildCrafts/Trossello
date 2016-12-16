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
    it('should insert a card into the cards table and record the activity', () => {
      return knex.table('cards').count()
        .then((results) => {
          expect(results[0].count).to.eql('0')
        })
        .then(() =>
          commands.createCard(1455, {
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
          commands.createCard(1455, {
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
        .then( () => queries.getActivityByBoardId(341)
          .then( activities => {
            expect(activities).to.eql([
              {
                id: 2,
                created_at: activities[0].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 341,
                card_id: 2,
                metadata: '{"content":"wash your feet"}'
              },
              {
                id: 1,
                created_at: activities[1].created_at,
                user_id: 1455,
                type: 'AddedCard',
                board_id: 341,
                card_id: 1,
                metadata: '{"content":"wash your face"}'
              }
            ])
          })
        )
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
                expect(card.updated_at).to.be.at.least(new Date() - 1500)
                expect(card.updated_at).to.be.at.most(new Date())
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
        it('should update card orders in list and not record the activity', () => {

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
              commands.moveCard(1455, {
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
              commands.moveCard(1455, {
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
              expect(list40Cards[1].updated_at ).to.be.at.most(new Date())
              expect(list40Cards[1].updated_at ).to.be.at.least(new Date() - 5000)
            })
            .then( () => queries.getActivityByBoardId(101)
              .then( activities => {
                const moveCardActivity = activities.find(activity =>
                  activity.type === 'MovedCard')
                expect(moveCardActivity).to.be.undefined
              })
            )
        })
      })
    })

    describe('when moving between two lists', () => {
      withBoardsListsAndCardsInTheDatabase(() => {
        it('should update card orders and record the activity', () => {
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
              expect(list40Cards[1].updated_at ).to.be.at.most(new Date())
              expect(list40Cards[1].updated_at ).to.be.at.least(new Date() - 5000)

              expect(list41Cards.map(card => card.order)  ).to.eql([0,1,2,3,4])
              expect(list41Cards.map(card => card.id)     ).to.eql([83,84,85,86,87])
              expect(list41Cards.map(card => card.list_id)).to.eql([41,41,41,41,41])
              expect(list41Cards[1].updated_at ).to.be.at.most(new Date())
              expect(list41Cards[1].updated_at ).to.be.at.least(new Date() - 5000)
            })
            .then( () =>
              commands.moveCard(1455, {
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
              expect(list41Cards[2].updated_at ).to.be.at.most(new Date())
              expect(list41Cards[2].updated_at ).to.be.at.least(new Date() - 5000)
            })
            .then( () =>
              commands.moveCard(1455, {
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
            .then( () => queries.getActivityByBoardId(101)
              .then( activities => {
                const moveCardActivity = activities.find(activity =>
                  activity.type === 'MovedCard')
                expect(moveCardActivity).to.be.an('object')
                expect(moveCardActivity.user_id).to.eql(1455)
                expect(moveCardActivity.type).to.eql('MovedCard')
                expect(moveCardActivity.board_id).to.eql(101)
                expect(moveCardActivity.card_id).to.eql(81)
                expect(moveCardActivity.metadata).to.eql('{"prev_list_id":41,"new_list_id":40,"content":"Card2"}')
              })
            )
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
            expect(list41Cards[1].updated_at ).to.be.at.most(new Date())
            expect(list41Cards[1].updated_at ).to.be.at.least(new Date() - 5000)
          })
          .then( () =>
            commands.moveCard(1455, {
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
            expect(list41Cards[1].updated_at ).to.be.at.most(new Date())
            expect(list41Cards[1].updated_at ).to.be.at.least(new Date() - 5000)
          })
          .then( () =>
            commands.moveCard(1455, {
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
            expect(list41Cards[2].updated_at ).to.be.at.most(new Date())
            expect(list41Cards[2].updated_at ).to.be.at.least(new Date() - 5000)
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
          return commands.deleteCard(1455, 101, 83).then( () => {
            return queries.getCardById(83).then( card => {
              expect(card).to.be.undefined
            })
          })
        })
        .then( () => queries.getActivityByBoardId(101)
          .then( activities => {
            const cardActivity = activities.filter(activity => activity.card_id===83)
            const deleteCardActivity = activities.find(activity =>
              activity.type === 'DeletedCard')
            expect(cardActivity).length.to.be(1)
            expect(deleteCardActivity).to.be.an('object')
            expect(deleteCardActivity.user_id).to.eql(1455)
            expect(deleteCardActivity.type).to.eql('DeletedCard')
            expect(deleteCardActivity.board_id).to.eql(101)
            expect(deleteCardActivity.card_id).to.eql(83)
            expect(deleteCardActivity.metadata).to.eql('{}')
          })
        )
      })
    })
  })

  describe('archiveCard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should archive a card by card id and record the activity', () => {
        return queries.getCardById(83).then( card => {
          expect(card).to.be.a('object')
          expect(card.id).to.eql(83)
          return commands.archiveCard(1455, 83).then( () => {
            return queries.getCardById(83).then( card => {
              expect(card.archived).to.eql(true)
              expect(card.updated_at ).to.be.at.most(new Date())
              expect(card.updated_at ).to.be.at.least(new Date() - 5000)
            })
          })
        })
        .then( () => queries.getActivityByBoardId(101)
          .then( activities => {
            const archiveCardActivity = activities.find(activity =>
              activity.type === 'ArchivedCard')
            expect(archiveCardActivity).to.be.an('object')
            expect(archiveCardActivity.user_id).to.eql(1455)
            expect(archiveCardActivity.type).to.eql('ArchivedCard')
            expect(archiveCardActivity.board_id).to.eql(101)
            expect(archiveCardActivity.card_id).to.eql(83)
            expect(archiveCardActivity.metadata).to.eql('{"content":"card3"}')
          })
        )
      })
    })
  })

  describe('unarchiveCard', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should unarchive a card by card id and record the activity', () => {
        return commands.archiveCard(1455, 83).then( () => {
          return queries.getCardById(83).then( card => {
            expect(card.archived).to.eql(true)
            return commands.unarchiveCard(1455, 83).then( () => {
              return queries.getCardById(83).then( card => {
                expect(card.archived).to.eql(false)
              })
            })
          })
        })
        .then( () => queries.getActivityByBoardId(101)
          .then( activities => {
            const archiveCardActivity = activities.find(activity =>
              activity.type === 'UnarchivedCard')
            expect(archiveCardActivity).to.be.an('object')
            expect(archiveCardActivity.user_id).to.eql(1455)
            expect(archiveCardActivity.type).to.eql('UnarchivedCard')
            expect(archiveCardActivity.board_id).to.eql(101)
            expect(archiveCardActivity.card_id).to.eql(83)
            expect(archiveCardActivity.metadata).to.eql('{"content":"card3"}')
          })
        )
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
      return commands.createList(1455, attributes)
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
          .then( () => queries.getActivityByBoardId(83)
            .then( activities => {
              const updateBoardActivity = activities.find(activity =>
                activity.type === 'AddedList')
              expect(updateBoardActivity).to.be.an('object')
              expect(updateBoardActivity.user_id).to.eql(1455)
              expect(updateBoardActivity.type).to.eql('AddedList')
              expect(updateBoardActivity.board_id).to.eql(83)
              expect(updateBoardActivity.card_id).to.eql(null)
              expect(updateBoardActivity.metadata).to.eql(`{"list_id":${list.id},"list_name":"${list.name}"}`)
            })
          )
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
        return commands.archiveList(1455, 40).then( () => {
          return queries.getListById(40).then( list => {
            expect(list.archived).to.eql(true)
            return commands.unarchiveList(1455, 40).then( () => {
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
        return queries.getListById(40)
          .then( list => {
            expect(list).to.be.a('object')
            expect(list.id).to.eql(40)
            return commands.archiveList(1455, 40).then( () => {
              return queries.getListById(40).then( list => {
                expect(list.archived).to.eql(true)
                return list
              })
            })
          })
          .then( list => {
            return queries.getActivityByBoardId(list.board_id)
            .then( activities => {
              const archiveListActivity = activities.find(activity =>
                activity.type === 'ArchivedList')
              expect(archiveListActivity).to.be.an('object')
              expect(archiveListActivity.user_id).to.eql(1455)
              expect(archiveListActivity.type).to.eql('ArchivedList')
              expect(archiveListActivity.board_id).to.eql(list.board_id)
              expect(archiveListActivity.card_id).to.eql(null)
              expect(archiveListActivity.metadata).to.eql(`{"list_id":${list.id},"list_name":"${list.name}"}`)
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
          .then( () => commands.archiveCardsInList(1455, 40))
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
          .then(_ => commands.duplicateList(1455, 101, 40, "Bob's New List" ) )
          .then(newList => {
            expect(newList.board_id).to.eql(101)
            expect(newList.name).to.eql("Bob's New List")
            expect(newList.archived).to.eql(false)
            expect(newList.order).to.eql(2)
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
            return boards[0]
          })
        })
        .then( board => {
          return queries.getActivityByBoardId(board.id)
          .then( activities => {
            const createBoardActivity = activities.find(activity =>
              activity.type === 'CreatedBoard')
            expect(createBoardActivity).to.be.an('object')
            expect(createBoardActivity.user_id).to.eql(15)
            expect(createBoardActivity.type).to.eql('CreatedBoard')
            expect(createBoardActivity.board_id).to.eql(board.id)
            expect(createBoardActivity.card_id).to.eql(null)
            expect(createBoardActivity.metadata).to.eql(`{"board_name":"${board.name}"}`)
          })
        })
    })
  })

  describe('updateBoard', () => {
    describe('when updating name', () => {
      withBoardsListsAndCardsInTheDatabase(() => {
        it('should update a board\'s name and record the activity',() => {
          const newAttributes = {
            name: "NewBoardName"
          }
          return commands.updateBoard(1455, 101, newAttributes)
            .then( board => {
              expect(board.id).to.eql(101)
              expect(board.name).to.eql('NewBoardName')
            })
            .then( () => queries.getActivityByBoardId(101))
              .then( activities => {
                const updateBoardActivity = activities.find(activity =>
                  activity.type === 'UpdatedBoard')
                expect(updateBoardActivity).to.be.an('object')
                expect(updateBoardActivity.user_id).to.eql(1455)
                expect(updateBoardActivity.type).to.eql('UpdatedBoard')
                expect(updateBoardActivity.board_id).to.eql(101)
                expect(updateBoardActivity.card_id).to.eql(null)
                expect(updateBoardActivity.metadata).to.eql('{"attribute_updated":"name","prev_board_name":"Board1","new_board_name":"NewBoardName"}')
              })
        })
      })
    })

    describe('when updating background color', () => {
      withBoardsListsAndCardsInTheDatabase(() => {
        it('should update a board\'s background color and record the activity',() => {
          const newAttributes = {
            background_color: "#0079bf"
          }
          return commands.updateBoard(1455, 101, newAttributes)
            .then( board => {
              expect(board.id).to.eql(101)
              expect(board.background_color).to.eql('#0079bf')
            })
            .then( () => queries.getActivityByBoardId(101)
              .then( activities => {
                const updateBoardActivity = activities.find(activity =>
                  activity.type === 'UpdatedBoard')
                expect(updateBoardActivity).to.be.an('object')
                expect(updateBoardActivity.user_id).to.eql(1455)
                expect(updateBoardActivity.type).to.eql('UpdatedBoard')
                expect(updateBoardActivity.board_id).to.eql(101)
                expect(updateBoardActivity.card_id).to.eql(null)
                expect(updateBoardActivity.metadata).to.eql('{"attribute_updated":"background_color"}')
              })
            )
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
    it('should create an invite record and send an invite email and record the activity', () => {
      return commands.createInvite(1455, {
        boardId: 123,
        email: 'larry@david.org',
      }).then(invite => {
        expect(invite.boardId).to.eql(123)
        expect(invite.email).to.eql('larry@david.org')
        expect(invite).to.eql({
          boardId: 123,
          created_at: invite.created_at,
          email: 'larry@david.org',
          token: invite.token,
          updated_at: invite.updated_at
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
      .then(() => queries.getActivityByBoardId(123))
      .then(activities => {
        const inviteActivity = activities.find(activity =>
          activity.type === 'InvitedToBoard')
        expect(inviteActivity).to.be.an('object')
        expect(inviteActivity).to.eql({
          id: 1,
          created_at: inviteActivity.created_at,
          user_id: 1455,
          type: 'InvitedToBoard',
          board_id: 123,
          card_id: null,
          metadata: '{"invited_email":"larry@david.org"}'
        })
      })
    });
  });

  describe('addUserToBoard', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should add a user to a board and record the activity', () => {
        return queries.getBoardsByUserId(10000).then( boards => {
          expect(boards).to.have.length(0)
          return commands.addUserToBoard(10000,101).then( () => {
            return queries.getBoardsByUserId(10000).then( boards => {
              expect(boards).to.have.length(1)
              expect(boards.map(board => board.id)).to.eql([101])
            })
          }).then( () => {
            return queries.getActivityByBoardId(101).then( activities => {
              const joinedBoardActivity = activities.find( activity => {
                return activity.type === 'JoinedBoard' &&
                       activity.user_id === 10000 &&
                       activity.board_id === 101
              })
              expect(joinedBoardActivity).to.be.an('object')
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

  describe('label commands', () => {
    withBoardsListsAndCardsInTheDatabase(() => {

      describe('createLabel', () => {
        it('should add a label to the database', () => {
          return commands.createLabel({board_id: 101, color: 'yellow', text:'yellow label'})
          .then(label =>
            queries.getBoardById(101)
              .then(board => expect(board.labels).to.include(label))
          )
        })
      })

      describe('updateLabel', () => {
        it('should update a label in the database', () => {
          return queries.getBoardById(101)
          .then(board => expect(board.labels).to.not.include({id:301, board_id:101, text:'violet label', color:'violet'}))
          .then(() => commands.updateLabel(301, {text:'violet label', color:'violet'}))
          .then(() => queries.getBoardById(101))
          .then(board => expect(board.labels).to.include({id:301, board_id:101, text:'violet label', color:'violet'}))
        })
      })

      describe('deleteLabel', () => {
        it('should delete a label from the database', () => {
          return queries.getBoardById(101)
          .then(board => expect(board.labels).to.include({id:301, board_id:101, text:'purple label', color:'purple'}))
          .then(() => commands.deleteLabel(301))
          .then(() => queries.getBoardById(101))
          .then(board => expect(board.labels).to.not.include({id:301, board_id:101, text:'purple label', color:'purple'}))
        })
      })

    })
  })

  describe('Add and Remove Labels From Cards', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should add and then remove a label from a card', () => {
        const labelIds = board => board.cards.find(card => card.id===80).label_ids
        return queries.getBoardById(101)
          .then(board => expect(labelIds(board)).to.eql([]))
          .then(() => commands.addOrRemoveCardLabel(80, 301))
          .then(() => queries.getBoardById(101))
          .then(board => expect(labelIds(board)).to.eql([301]))
          .then(() => commands.addOrRemoveCardLabel(80, 301))
          .then(() => queries.getBoardById(101))
          .then(board => expect(labelIds(board)).to.eql([]))
      })
    })
  })

  describe('recordActivity', () => {
    withBoardsListsAndCardsInTheDatabase(() => {
      it('should record the user action in the activity table', () => {
        return commands.recordActivity({
          type: 'AddedCard',
          user_id: 1455,
          board_id: 101,
          card_id: 50,
          metadata: {content: 'card test'}
        })
        .then(() => queries.getActivityByBoardId(101))
        .then(activities => {
          const addCardAct = activities.find(activity =>
            activity.card_id === 50 && activity.type === 'AddedCard')
          expect(addCardAct).to.be.a('object')
          expect(addCardAct.type).to.eql('AddedCard')
          expect(addCardAct.user_id).to.eql(1455)
          expect(addCardAct.board_id).to.eql(101)
          expect(addCardAct.card_id).to.eql(50)
          expect(addCardAct.metadata).to.eql(
            JSON.stringify({content: 'card test'})
          )
        })
      })
    })
  })


  describe('comment commands', () => {
    withBoardsListsAndCardsInTheDatabase(() => {

      describe('addComment', () => {
        it('should add a comment to the card', () => {
          const cardComments = board => board.cards.find(card => card.id === 81).comments

          return commands.addComment(81, 1455, 'addComment command works!')
            .then(() => queries.getBoardById(101))
            .then(board =>
              expect(cardComments(board)[0]).to.eql(
                {
                  id:2,
                  user_id:1455,
                  card_id:81,
                  content:'addComment command works!',
                  created_at:cardComments(board)[0].created_at,
                  updated_at:cardComments(board)[0].updated_at,
                }
              )
            )
        })
      })

      describe('updateComment', () => {
        it('should update the content of a comment', () => {
          const cardComments = board => board.cards.find(card => card.id === 80).comments

          return queries.getBoardById(101)
            .then(board => expect(cardComments(board)[0].content).to.eql('old comment'))
            .then(() => commands.updateComment(1, 'updated comment!'))
            .then(() => queries.getBoardById(101))
            .then(board => expect(cardComments(board)[0].content).to.eql('updated comment!'))
        })
      })

      describe('deleteComment', () => {
        it('should delete a comment', () => {
          const cardComments = board => board.cards.find(card => card.id === 80).comments

          return queries.getBoardById(101)
            .then(board => expect(cardComments(board).length).to.eql(1))
            .then(() => commands.deleteComment(1))
            .then(() => queries.getBoardById(101))
            .then(board => expect(cardComments(board).length).to.eql(0))
        })
      })
    })
  })

  describe('addUserToCard', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should add a user association to a card', () => {
        return commands.addUserToCard(10000, 101, 85, 1455)
          .then( () => queries.getUsersForCard(85))
          .then( cardUsers => {
            expect(cardUsers).to.be.an('array')
            expect(cardUsers.length).to.eql(1)
            expect(cardUsers[0].board_id).to.eql(101)
            expect(cardUsers[0].card_id).to.eql(85)
            expect(cardUsers[0].user_id).to.eql(1455)
          })
          .then( () => queries.getActivityByBoardId(101))
          .then( activities => {
            const cardUserActivity = activities.find( activity =>
              activity.card_id === 85 && activity.type === 'AddedUserToCard')
            expect(cardUserActivity).to.be.an('object')
            expect(cardUserActivity.type).to.eql('AddedUserToCard')
            expect(cardUserActivity.user_id).to.eql(10000)
            expect(cardUserActivity.board_id).to.eql(101)
            expect(cardUserActivity.card_id).to.eql(85)
            expect(cardUserActivity.metadata).to.eql('{"added_card_user":1455}')
          })
      })
    })
  })

  describe('removeUserFromCard', () => {
    withBoardsListsAndCardsInTheDatabase( () => {
      it('should remove a user association from a card', () => {
        return queries.getUsersForCard(87)
          .then( cardUsers => {
            expect(cardUsers).to.be.an('array')
            expect(cardUsers.length).to.eql(1)
            expect(cardUsers[0].board_id).to.eql(101)
            expect(cardUsers[0].card_id).to.eql(87)
            expect(cardUsers[0].user_id).to.eql(1455)
          })
          .then( () => commands.removeUserFromCard(10000, 101, 87, 1455))
          .then( () => queries.getUsersForCard(87))
          .then( cardUsers => {
            expect(cardUsers).to.be.an('array')
            expect(cardUsers.length).to.eql(0)
          })
          .then( () => queries.getActivityByBoardId(101))
          .then( activities => {
            const cardUserActivity =
              activities.find( activity =>
                activity.card_id === 87 &&
                activity.type === 'RemovedUserFromCard'
              )
            expect(activities.slice(-1)[0]).to.be.an('object')
            expect(cardUserActivity).to.eql({
              id: 20,
              created_at: activities[0].created_at,
              type: 'RemovedUserFromCard',
              board_id: 101,
              card_id: 87,
              user_id: 10000,
              metadata: `{"removed_card_user":1455}`
            })
          })
      })
    })
  })

})
