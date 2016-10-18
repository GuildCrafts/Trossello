# Trossello #divergent-mockingbird

## Specs

- [ ] As a logged in user I can edit a card
- [ ] As a logged in user I can search all of my cards via the navbar search field
- [ ] As a logged in user I can only archive lists and cards (instead of deleting) so they can be unarchived later if need be
- [ ] Create board background color picker

## Quality Rubric

- [ ] Quality Rubric can be found in the master Trosello Repo under contribution guidelines. 

### Development Setup

You'll need to
[register this app](https://github.com/settings/applications/new)
as an `Oauth application` on Github.

```
Application name
Trossello (development)

Homepage URL
http://localhost:3000/

Application description
Open Source Trello Clone made by LearnersGuild (development)

Authorization callback URL
http://localhost:3000/oauth_callback
```

Copy the `client id` and `client secret` and use them below:

Create a `.env` file in the root of the cloned repo that looks like this:
```
GITHUB_CLIENT_ID=GET_THIS_VALUE_FROM_GITHUB
GITHUB_CLIENT_SECRET=GET_THIS_VALUE_FROM_GITHUB
SESSION_KEY=MAKEUP_A_REALLY_LONG_STRING_HERE
```

#### Fork the Project and Add Remote Upstream

Go to Github and fork the project to your repo, then clone the fork. Then run the following:

```
$ git remote add upstream https://github.com/GuildCrafts/Trossello.git
```

#### Install Postgres

```sh
brew install postgress
brew tap homebrew/services
brew services start postgresql
```

#### Ensure `./node_modules/.bin` is in your path

Test to see if you have this setup
```sh
echo $PATH | grep './node_modules/.bin'
```

If you don't, do this:
```sh
# Add this line to your ~/.bash_profile
export PATH="./node_modules/.bin:$PATH"
```

#### Create and Migrate the Database

```sh
createdb trossello-test
createdb trossello-development
knex migrate:latest
```
#### Run the Server!

At this point, you should be able to run 'npm start' without errors.


#### Running Tests

Ensure `npm start` is running before you run `npm test` to run the mocha tests

#### Submitting a pull request

Rebase your branch off of the latest `upstream/master` before submitting your pull request

```sh
git commit ... // commit all your changes
git fetch upstream
git rebase upstream/master
// resolve any conflicts
npm install
npm test
git push -f origin HEAD
```

## Architecture

- Node
- Express
- Webpack
- Babel es2016
- SQL via Knex
- React
- SASS


### Persistence

We're using `knex` to generate our SQL

#### HTTP API

| action               | CRUD   | verb | path                                     |
| -------------------- | ------ | ---- | ---------------------------------------- |
| getBoardsByUserId()  | index  | get  | /api/boards                              |
| createBoard()        | create | post | /api/boards                              |
| getBoardById()       | show   | get  | /api/boards/:boardId                     |
| updateBoard()        | update | post | /api/boards/:boardId                     |
| deleteBoard()        | delete | post | /api/boards/:boardId/delete              |
| createList()         | create | post | /api/boards/:boardId/lists               |
| createCard()         | create | post | /api/boards/:boardId/lists/:listId/cards |
| updateList()         | update | post | /api/lists/:listId                       |
| deleteList()         | delete | post | /api/lists/:listId/delete                |
| updateCard()         | update | post | /api/cards/:cardId                       |
| deleteCard()         | delete | post | /api/cards/:cardId/delete                |

### Contributors

- [deadlyicon](https://github.com/deadlyicon)
- [EthanJStark](https://github.com/EthanJStark)
- [Farhad33](https://github.com/Farhad33)
- [tjfwalker](https://github.com/tjfwalker)
- [AnaSauce](https://github.com/AnaSauce)
- [Moniarchy](https://github.com/Moniarchy)
- [GeneralMeow](https://github.com/GeneralMeow)
- [harmanLearns](https://github.com/harmanLearns)
- [Arayi](https://github.com/Arayi)
- [jason00111](https://github.com/jason00111)
- [ASantos3026](https://github.com/ASantos3026)
- [salmonax](https://github.com/salmonax)
