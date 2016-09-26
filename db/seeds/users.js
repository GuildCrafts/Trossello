
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          email: 'jared@example.com',
          password: 'password'
        }),
        knex('users').insert({
          email: 'bob@example.com',
          password: 'password'
        }),
        knex('users').insert({
          email: 'sally@example.com',
          password: 'password'
        })
      ]);
    })
};
