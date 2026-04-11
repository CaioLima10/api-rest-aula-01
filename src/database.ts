import knex from 'knex'
import type { Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,

  migrations: {
    extension: 'ts',
    directory: 'db/migration',
  },
}

export const clientKnex = knex(config)
