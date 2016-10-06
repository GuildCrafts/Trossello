exports.seed = (knex, Promise) => {
   return knex('user_boards').del()
    .then(() => {
      return Promise.all([
        knex('user_boards').insert({
          user_id: 1,
          board_id: 1,
          admin: true,
        }),
        knex('user_boards').insert({
          user_id: 2,
          board_id: 2,
          admin: true,
        }),
        knex('user_boards').insert({
          user_id: 3,
          board_id: 3,
          admin: true,
        })
      ]);
    })
};

