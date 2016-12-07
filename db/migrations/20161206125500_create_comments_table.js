exports.up = (knex, Promise) =>
    knex.schema.createTable('comments', (table) => {
      table.increments('id').primary()
      table.integer('card_id').notNullable()
      table.integer('user_id').notNullable()
      table.text('content').notNullable()
      table.timestamps(false, true)
    })

exports.down = (knex, Promise) =>
    knex.schema.dropTable('comments')
