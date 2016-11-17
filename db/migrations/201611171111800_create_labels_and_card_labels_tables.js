exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('labels', (table) => {
      table.increments('id').primary()
      table.integer('board_id').notNullable()
      table.string('color').defaultTo('#aaa')
      table.string('text').defaultTo('')
    }),

    knex.schema.createTable('card_labels', (table) => {
      table.integer('card_id').notNullable()
      table.integer('label_id').notNullable()
      table.unique(['card_id','label_id'])
    })
  ])

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('labels'),
    knex.schema.dropTable('card_labels')
  ])
