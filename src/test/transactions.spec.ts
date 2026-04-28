import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../app.js'
import { beforeEach } from 'node:test'
import { execSync } from 'node:child_process'

describe('Transactions routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
    execSync('npm run knex migrate:rollback --all')
  })

  const server = request(app.server)

  it('should be possible to create a new transaction', async () => {
    await server.post('/transactions').send({
      text: 'New Transactions',
      amount: 5000,
      type: 'credit',
    })
  })

  it('should be possible to list all transactions', async () => {
    const createTransactionsResponse = await server.post('/transactions').send({
      text: 'New Transactions',
      amount: 5000,
      type: 'credit',
    })

    console.log(createTransactionsResponse.body)
    const cookies = createTransactionsResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Unauthozied')
    }
    const sessionCookies = cookies[0]?.split(';')[0]

    if (!sessionCookies) {
      throw new Error('Unauthozied')
    }

    const ListsTransactionsResponse = await server
      .get('/transactions')
      .set('Cookie', sessionCookies)

    expect(ListsTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        text: 'New Transactions',
        amount: 5000,
        session_id: expect.any(String),
        created_at: expect.any(String),
      }),
    ])
  })
})
