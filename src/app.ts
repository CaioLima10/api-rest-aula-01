import fastify from 'fastify'
import { transactionsRoute } from './routes/transactions.js'

const app = fastify()

app.register(transactionsRoute, {
  prefix: '/transactions',
})

export { app }
