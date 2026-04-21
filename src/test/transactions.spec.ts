import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../app.js'

describe('Transactions routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  const server = request(app.server)

  it('should be possible to create a new transaction', async () => {
    await server
      .post('/transactions')
      .send({
        text: 'New Transactions',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be possible to list all transactions', async () => {
    const createTransactionsResponse = await server
      .post('/transactions')
      .send({
        text: 'New Transactions',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionsResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Unauthozied')
    }

    const ListsTransactionsResponse = await server
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(ListsTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        text: 'New Transactions',
        amount: 5000,
      }),
    ])
  })
})
