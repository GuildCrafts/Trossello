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

});
