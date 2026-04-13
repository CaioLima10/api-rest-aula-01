import fastify from 'fastify'
import { env } from './env/index.js'
import { transactionsRoute } from './routes/transactions.js'

const app = fastify()

app.register(transactionsRoute, {
  prefix: '/transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
