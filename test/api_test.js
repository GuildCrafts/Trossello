const { chai, expect, request, server, commands } = require('./setup')


describe('API', () => {
  
  describe('/api/users', () => {

    context('when there are users in the database', () => {
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
    
    })
  
  })





  describe('/api/cards', () => {

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
