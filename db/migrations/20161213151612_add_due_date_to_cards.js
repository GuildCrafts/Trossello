
exports.up = function(knex, Promise) {
  return knex.schema.table('cards', function(table) {
    table.dateTime('due_date').defaultTo(null)
    table.boolean('complete').defaultTo(false)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('cards', function(table) {
    table.dropColumn('due_date');
    table.dropColumn('complete');
  })
};
