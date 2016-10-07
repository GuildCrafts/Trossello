# Trossello

Open Source Trello Clone

[![CircleCI](https://circleci.com/gh/GuildCrafts/Trossello/tree/master.svg?style=svg)](https://circleci.com/gh/GuildCrafts/Trossello/tree/master)

## Contributing

1. Fork this repository
2. Take a ticket from the [trello board](https://trello.com/b/QIKeSwK0/trossello-oss-trello)
3. Cut a topic branch
4. Finish the ticket
5. Submit a pull request

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

```
$ brew install postgress
$ brew tap homebrew/services
$ brew services start postgresql
```
#### Add Knex and Nodemon to the Command Line

You can do one of two things: install nodemon and knex globally, which will automatically add both tools to your path, or add ./node_modules/.bin to your path (recommended). Depending on your shell, you will either need to add the following line to .zshrc or .bashrc:

> export PATH=$HOME/bin:/usr/local/bin:**./node_modules/.bin**:$PATH

#### Create and Migrate the Database

```
$ createdb trossello-development
$ knex migrate:latest
```
#### Run the Server!

At this point, you should be able to run 'npm start' without errors. If you get an error, make sure that you can run nodemon, knex, and psql from the command line. If any of them fail, make sure to install them and try again.

## Architecture

- Node
- Express
- Webpack
- Babel es2016
- React
- Redux
- SQL via Knex


### Persistence

I think we should do this with `postgresql` and `pg-promise` because thats what they know.

we can make make live update work by polling for the entire board data. that would never scale but its simple.

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

Ask Contributors any questions about this project!

Week 1:
- [deadlyicon](https://github.com/deadlyicon)
- [EthanJStark](https://github.com/EthanJStark)
- [Farhad33](https://github.com/Farhad33)
- [tjfwalker](https://github.com/tjfwalker)
- [AnaSauce](https://github.com/AnaSauce)
- [Moniarchy](https://github.com/Moniarchy)
- [GeneralMeow](https://github.com/GeneralMeow)
- [harmanLearns](https://github.com/harmanLearns)

Week 2:
- [deadlyicon](https://github.com/deadlyicon)
- [EthanJStark](https://github.com/EthanJStark)
- [tjfwalker](https://github.com/tjfwalker)
- [Arayi](https://github.com/Arayi)
- [jason00111](https://github.com/jason00111)
- [ASantos3026](https://github.com/ASantos3026)
- [salmonax](https://github.com/salmonax)
- [harmanLearns](https://github.com/harmanLearns)
