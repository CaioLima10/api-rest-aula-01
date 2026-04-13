import fastify from 'fastify'
import { clientKnex } from './database.js'
import { randomUUID } from 'node:crypto'
import { env } from './env/index.js'

const app = fastify()

app.get('/', async () => {
  const transactions = await clientKnex('transactions')
    .insert({
      id: randomUUID(),
      title: 'Trabalhei de free-lancer',
      amount: 8000,
    })
    .returning('*')

  return transactions
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
