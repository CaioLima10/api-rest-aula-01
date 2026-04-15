import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { clientKnex } from '../database.js'
import z from 'zod'
import { randomUUID } from 'node:crypto'

export async function transactionsRoute(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await clientKnex('transactions').select('*')

    return { transactions }
  })

  app.get('/:id', async (request: FastifyRequest) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const transaction = await clientKnex('transactions').where('id', id).first()

    return { transaction }
  })

  app.get('/summary', async () => {
    const summary = await clientKnex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const transactionsSchema = z.object({
      text: z.string().nullable(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { text, amount, type } = transactionsSchema.parse(request.body)

    const transactions = await clientKnex('transactions').insert({
      id: randomUUID(),
      text,
      amount: type === 'credit' ? amount : amount * -1,
    })

    reply.status(201).send(transactions)
  })
}
