
exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    BEGIN;
    ALTER TABLE cards ADD COLUMN archived boolean;
    ALTER TABLE cards ALTER COLUMN archived TYPE boolean;
    UPDATE cards set archived=false;
    COMMIT;
  `)
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
    BEGIN;
    ALTER TABLE cards DROP COLUMN archived;
    COMMIT;
  `)
};
