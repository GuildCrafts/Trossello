
exports.up = (knex, Promise) => {

  return Promise.all([

    knex.schema.createTable('users', (table) =>  {
      table.increments('id').primary()
      table.string('email').unique()
      table.string('password')
      table.timestamps()
    }),

    knex.schema.createTable('user_boards', (table) => {
      table.integer('user_id') //.references('id').inTable('users')
      table.integer('board_id') //.references('id').inTable('boards')
      table.unique(['user_id', 'board_id'])
      table.boolean('admin')
    }),

    knex.schema.createTable('boards', (table) => {
      table.increments('id').primary()
      table.string('name')
    }),

    knex.schema.createTable('invites', (table) => {
      table.integer('boardId')
      table.string('email')
      table.string('token')
    }),

    knex.schema.createTable('lists', (table) => {
      table.increments('id').primary()
      table.integer('board_id') //.references('id').inTable('boards')
      table.string('name')
    }),

    knex.schema.createTable('cards', (table) => {
      table.increments('id').primary()
      table.integer('board_id') //.references('id').inTable('boards')
      table.integer('list_id') //.references('id').inTable('lists')
      table.string('content')
    }),

  ])

}

exports.down = (knex, Promise) => {

  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('user_boards'),
    knex.schema.dropTable('boards'),
    knex.schema.dropTable('lists'),
    knex.schema.dropTable('cards'),
  ])
}
