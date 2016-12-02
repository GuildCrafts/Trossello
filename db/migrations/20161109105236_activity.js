
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('activity', (table) => {
      table.increments('id').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.integer('user_id').notNullable()
      table.string('type').notNullable()
      table.integer('board_id').notNullable()
      table.integer('card_id')
      table.text('metadata') // json
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('activity')
  ])
};
