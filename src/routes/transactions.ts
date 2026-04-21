import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { clientKnex } from '../database.js'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExist } from '../middlewares/check-session-id-exists.js'

export async function transactionsRoute(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: checkSessionIdExist },
    async (request: FastifyRequest) => {
      const { sessionId } = request.cookies

      const transactions = await clientKnex('transactions')
        .where('session_id', sessionId)
        .select('*')

      return { transactions }
    },
  )

  app.get(
    '/:id',
    { preHandler: checkSessionIdExist },
    async (request: FastifyRequest) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const transaction = await clientKnex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    { preHandler: checkSessionIdExist },
    async (request: FastifyRequest) => {
      const { sessionId } = request.cookies

      const summary = await clientKnex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const transactionsSchema = z.object({
      text: z.string().nullable(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { text, amount, type } = transactionsSchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const transactions = await clientKnex('transactions').insert({
      id: randomUUID(),
      text,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    reply.status(201).send(transactions)
  })
}
