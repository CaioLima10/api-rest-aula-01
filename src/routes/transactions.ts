import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { clientKnex } from '../database.js'
import z from 'zod'
import { randomUUID } from 'node:crypto'

export async function transactionsRoute(app: FastifyInstance) {
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

  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const transactions = await clientKnex('transactions').select('*')

    reply.status(200).send(transactions)
  })
}
