
exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    BEGIN;
    ALTER TABLE cards ADD COLUMN tmp_content text;
    UPDATE cards set tmp_content=content;
    ALTER TABLE cards ALTER COLUMN content TYPE text;
    UPDATE cards set content=tmp_content;
    ALTER TABLE cards DROP COLUMN tmp_content;
    COMMIT;
  `)
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
    BEGIN;
    ALTER TABLE cards ADD COLUMN tmp_content varchar(255);
    UPDATE cards set tmp_content=content;
    ALTER TABLE cards ALTER COLUMN content TYPE varchar(255);
    UPDATE cards set content=tmp_content;
    ALTER TABLE cards DROP COLUMN tmp_content;
    COMMIT;
  `)
};
