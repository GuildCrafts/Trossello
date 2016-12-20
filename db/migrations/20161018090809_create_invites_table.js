
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('invites', (table) => {
      table.integer('boardId')
      table.string('email')
      table.string('token')
      table.unique(['boardId','email'])
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('invites')
  ])
};
