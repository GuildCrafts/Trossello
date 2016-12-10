exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('card_users', (table) => {
      table.increments('id').primary()
      table.integer('board_id').notNullable()
      table.integer('card_id').notNullable()
      table.integer('user_id').notNullable()
      table.unique(['card_id', 'user_id'])
    })
  ])
};

exports.down = function(knex, Promise) {
  Promise.all([
    knex.schema.dropTable('card_users')
  ])
};
