exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('password');
    table.integer('github_id');
    table.string('name');
    table.string('avatar_url');
  })
};

exports.down = function(knex, Promise) {
  throw new Error('irreversible migration')
};
