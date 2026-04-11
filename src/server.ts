import fastify from 'fastify'
import { clientKnex } from './database.js'

const app = fastify()

app.get('/', async () => {
  const tables = await clientKnex('sqlite_schema').select('*')
  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
