const { expect, request, queries, commands } = require('./setup')


describe('API', () => {

  beforeEach(() => {
    return Promise.all([
      commands.createUser({
        id: 1455,
        name: 'Mark Zuckerburg',
        email: 'mark@zuckerburg.io',
      }),
      commands.createUser({
        id: 6672,
        name: 'Larry Harvey',
        email: 'larry@harvey.to',
      })
    ])
  })

  context('when not logged in', () => {
    describe('GET /api/users', () => {
      it('should render 400 Not Authorized', () => {
        return request('get', '/api/users').then(response => {
          expect(response).to.have.status(400);
          expect(response.body).to.eql({
            error: 'Not Authorized'
          })
        })
      })
    })
  })

  context('when logged in', () => {
    beforeEach(() => {
      return request('get', `/__login/1455`) // back door hack
    })
    describe('GET /api/users', () => {
      it('should render 400 Not Authorized', () => {
        return request('get', '/api/users').then(response => {
          expect(response).to.have.status(200);
        })
      })
    })

    describe('GET /api/users', () => {

      it('should render a json array of all users', () => {
        return request('get', '/api/users').then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json; // jshint ignore:line
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.equal(2);

          const users = response.body
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
        });
      });

    });


    describe('POST /api/users', () => {
      it('should create a user', () => {
        const userAttributes = {
          name: "Majid Rahimi",
          email: "majid@gmail.com",
        }
        return request('post', '/api/users', userAttributes).then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json; // jshint ignore:line
          expect(response.body).to.be.a('object')
          expect(response.body.id).to.be.a('number')
          expect(response.body.name).to.eql("Majid Rahimi")
          expect(response.body.email).to.eql("majid@gmail.com")
        });
      });
    });

    describe('GET /api/users/:id', () => {
      context('when requesting a user that exists', () => {
        it('should render that user as json', () => {
          return request('get','/api/users/6672').then(response => {
            expect(response).to.have.status(200);
            expect(response).to.be.json; // jshint ignore:line
            expect(response.body).to.be.an('object');
            expect(response.body.email).to.equal('larry@harvey.to');
          });
        });
      })
      context('when requesting a user that doesnt exist', () => {
        it('should render nothing status 404', () => {
          return request('get','/api/users/55').then(response => {
            expect(response).to.have.status(404);
            expect(response).to.be.json; // jshint ignore:line
            expect(response.body).to.eql(null)
          });
        });
      })
    });

    describe('POST /api/users/:userId/delete', () => {
      it('should delete a user', () => {
        return request('post', '/api/users/1455/delete').then(response => {
          expect(response).to.have.status(200)
          expect(response).to.be.json; // jshint ignore:line
          expect(response.body).to.eql(null)
          return request('get', '/api/users/1455').then(response => {
            expect(response).to.have.status(404)
            expect(response).to.be.json; // jshint ignore:line
            expect(response.body).to.eql(null)
          })
        })
      })
    })

    context('when there are 0 boards in the database', () => {

      describe('GET /api/boards', () => {
        it('should render an empty JSON array', () => {
          return request('get', '/api/boards').then(response => {
            expect(response).to.have.status(200)
            expect(response.body).to.be.an('array')
            expect(response.body.length).to.eql(0)
          })
        })
      })

      describe('POST /api/boards', () => {

        it('should create a new board and return its json', () => {
          const boardAttributes = {
            name: 'Fresh Board'
          }
          return request('post', '/api/boards', boardAttributes).then( response => {
            expect(response).to.have.status(200)
            expect(response.body.name).to.eql('Fresh Board')
          })
        })
      })

      describe('GET /api/boards/:boardId', () => {
        it('should return a null body and a 404 status', () => {
          return request('get', '/api/boards/1').then(response => {
            expect(response).to.have.status(404)
            expect(response.body).to.be.null
          })
        })
      })
    })

    context('when there are boards in the database', () => {
      beforeEach( () => {
        return Promise.all([
          commands.createBoard(1455, {
            id: 1,
            name: 'Sf General Hospital'
          }),
          commands.createBoard(1455, {
            id: 2,
            name: 'Facebook NSA Back Doors'
          }),
          commands.createBoard(99, {
            id: 3,
            name: 'User 99 board'
          })
        ])
      })

      describe('GET /api/boards', () => {
        it('should render my boards as a JSON array', () => {
          return request('get', '/api/boards').then(response => {
            expect(response).to.have.status(200)
            const boards = response.body
            expect(boards).to.be.an('array')
            expect(boards.length).to.eql(2)
            const boardIds = response.body.map(b => b.id).sort()
            expect(boardIds).to.eql([1,2])
            const boardNames = response.body.map(b => b.name).sort()
            expect(boardNames).to.eql([
              'Facebook NSA Back Doors',
              'Sf General Hospital'
            ])
          })
        })
      })

      describe('GET /api/boards/:boardId', () => {
        it('should return a single board as a JSON object', () => {
          return request('get', '/api/boards/1').then(response => {
            expect(response).to.have.status(200)
            expect(response).to.be.json // jshint ignore:line
            expect(response.body.name).to.eql('Sf General Hospital')
          })
        })
      })

      describe('POST /api/boards/:boardId', () => {
        it('should modify a board', () => {
          const boardAttributes = {
            name: 'fresh board'
          }
          return request('post', '/api/boards/2', boardAttributes).then(response => {
            expect(response).to.have.status(200)
            expect(response.body.name).to.eql('fresh board')
          })
        })
      })

      describe('POST /api/boards/:boardId/delete', () => {
        context('When board with boardId exists', () => {
          it('should delete a board and render status 200', () => {
            return request('post', '/api/boards/2/delete')
              .then(response => {
                expect(response).to.have.status(200)
              })
              .then( () => request('get', '/api/boards/2'))
              .then(response => {
                expect(response).to.have.status(404)
              })
          })
        })

        context('When board with boardId does not exist', () => {
          it('should return a null JSON object and a 404 error', () => {
            return request('post', '/api/boards/52/delete').then(response => {
              expect(response).to.have.status(404)
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

      describe('GET /api/cards', () => {

        it('should render a json array of all cards', () => {
          return request('get', '/api/cards').then(response => {
            console.log("+++Majid+++ ", response.body)
            expect(response).to.have.status(200);
            expect(response).to.be.json; // jshint ignore:line
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(2);

            const cards = response.body
            cards.forEach(card => {
              if (card.id === 11){
                expect(card).to.be.a('object')
                expect(card.board_id).to.eql(22)
                expect(card.list_id).to.eql(33)
                expect(card.content).to.eql('getting done the project')
              }else if (card.id === 10){
                expect(card).to.be.a('object')
                expect(card.board_id).to.eql(20)
                expect(card.list_id).to.eql(30)
                expect(card.content).to.eql('Having fun in this evening')
              }else{
                throw new Error('unexpected card record')
              }
            })
          });
        });

      });

      describe('POST /api/cards', () => {
        it('should create a card', () => {
          const cardAttributes = {
            id: 445,
            board_id: 131,
            list_id: 334343,
            content: 'eat a duck',
          }
          return request('post', '/api/cards', cardAttributes).then(response => {
            expect(response).to.have.status(200);
            expect(response).to.be.json; // jshint ignore:line
            expect(response.body).to.be.a('object')
            expect(response.body.id).to.eql(445)
            expect(response.body.board_id).to.eql(131)
            expect(response.body.list_id).to.eql(334343)
            expect(response.body.content).to.eql('eat a duck')
          });
        });
      });

      describe('GET /api/cards/:id', () => {
        context('when requesting a card that exists', () => {
          it('should render that card as json', () => {
            return request('get','/api/cards/11').then(response => {
              expect(response).to.have.status(200);
              expect(response).to.be.json; // jshint ignore:line
              expect(response.body).to.be.an('object');
              expect(response.body.content).to.equal('getting done the project');
            });
          });
        })
        context('when requesting a card that doesnt exist', () => {
          it('should render nothing status 404', () => {
            return request('get','/api/cards/55').then(response => {
              expect(response).to.have.status(404);
              expect(response).to.be.json; // jshint ignore:line
              expect(response.body).to.eql(null)
            });
          });
        })
      });

      describe('POST /api/cards/:cardId/delete', () => {
        it('should delete a card', () => {
          return request('post', '/api/cards/11/delete').then(response => {
            expect(response).to.have.status(200)
            expect(response).to.be.json; // jshint ignore:line
            expect(response.body).to.eql(null)
            return request('get', '/api/cards/11').then(response => {
              expect(response).to.have.status(404)
              expect(response).to.be.json; // jshint ignore:line
              expect(response.body).to.eql(null)
            })
          })
        })
      })

    })

  })







});
