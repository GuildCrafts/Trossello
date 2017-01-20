# Trossello

Open Source Trello Clone

[![CircleCI](https://circleci.com/gh/GuildCrafts/Trossello/tree/master.png?circle-token=859633aeb7d26e62dd772cda75da1ca27a6237db)](https://circleci.com/gh/GuildCrafts/Trossello/tree/master)

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

```sh
brew install postgresql
brew tap homebrew/services
brew services start postgresql
```

#### Ensure `./node_modules/.bin` is in your path

Test to see if you have this setup
```sh
echo $PATH | grep './node_modules/.bin'
```

If the grep command above yields zero search results, do this:
```sh
# Add this line to your ~/.zshrc (zsh) or ~/.bash_profile (bash)
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

#### Cutting a new branch

###### Setup

```sh
# clone Trossello
# checkout your clone
# add github.com/GuildCrafts/trossello as a remote called `upstream`
git remote add upstream git@github.com:GuildCrafts/Trossello.git
```

###### Cutting a new branch

```sh
git fetch upstream
git checkout -b my-topic-branch upstream/master
git push -fu origin HEAD
```

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

### Standards For Creating New Components
- Each new Component should be created in its own file where possible.

- Large Component files should be split up into new subcomponent files.

- A Component with multiple subcomponents should be reorganized into a Component directory:
  - The Component sharing the folder name should be renamed to index.js and have an accompanying index.sass file.

  - Everything inside the Component directory should only be rendered as a subcomponent of the index Component.

  - Components with many subcomponents of the same type (ex: menu panes) can have a directory for organizing those Components, which should be named in lower case.

- Component file and directory names should be in UpperCamelCase.

- Class names for Components inside of a Component directory should start with the Component directory name.
(ex: BoardShowPage/CardModal/LabelMenu -> .BoardShowPage-CardModal-LabelMenu)

- Each Component can optionally import ONE sass file of the same name. You should never import other Components' sass files.

- Each Component sass file should only declare css selectors with that Component's name as a prefix.

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
- [nodatall](https://github.com/nodatall)
- [ameliavoncat](https://github.com/ameliavoncat)
