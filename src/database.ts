import knex from 'knex'

export const clientKnex = knex({
  client: 'sqlite',
  connection: {
    filename: '/tmp/app.db',
  },
  useNullAsDefault: true,
})
