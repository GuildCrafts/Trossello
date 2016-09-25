# Trossello

Open Source Trello Clone


## Contributing

1. Fork this repository
2. Take a ticket from the [trello board](https://trello.com/b/QIKeSwK0/trossello-oss-trello)
3. Cut a topic branch
4. Finish the ticket
5. Submit a pull request


## Architecture

- Node
- Express
- Webpack
- Babel es2016
- React
- Redux


### Persistence

I think we should do this with `postgresql` and `pg-promise` because thats what they know.

we can make make live update work by polling for the entire board data. that would never scale but its simple.

#### HTTP API

| action                       | CRUD   | verb | path                             |
| ---------------------------- | ------ | ---- | -------------------------------- |
| getCurrentUser()             | index  | get  | /current-user                    |
| getUsers()                   | index  | get  | /users                           |
| createUser()                 | create | post | /users                           |
| getUser(userId)              | show   | get  | /users/:userId                   |
| updateUser(userId, attrs)    | update | post | /users/:userId                   |
| deleteUser(userId)           | delete | post | /users/:userId/delete            |
| getBoards()                  | index  | get  | /boards                          |
| createBoard()                | create | post | /boards                          |
| getBoard(boardId)            | show   | get  | /boards/:boardId                 |
| updateBoard(boardId, attrs)  | update | post | /boards/:boardId                 |
| deleteBoard(boardId)         | delete | post | /boards/:boardId/delete          |
| getLists()                   | index  | get  | /lists                           |
| createList()                 | create | post | /lists                           |
| getList(listId)              | show   | get  | /lists/:listId                   |
| updateList(listId, attrs)    | update | post | /lists/:listId                   |
| deleteList(listId)           | delete | post | /lists/:listId/delete            |
| getCards()                   | index  | get  | /cards                           |
| createCard()                 | create | post | /cards                           |
| getCard(cardId)              | show   | get  | /cards/:cardId                   |
| updateCard(cardId, attrs)    | update | post | /cards/:cardId                   |
| deleteCard(cardId)           | delete | post | /cards/:cardId/delete            |



