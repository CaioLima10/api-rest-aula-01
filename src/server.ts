import fastify from 'fastify'
import { clientKnex } from './database.js'
import { randomUUID } from 'node:crypto'

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
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
