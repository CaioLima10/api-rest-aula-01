import type { FastifyReply, FastifyRequest } from 'fastify'

async function checkSessionIdExist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthozied',
    })
  }
}

export { checkSessionIdExist }
