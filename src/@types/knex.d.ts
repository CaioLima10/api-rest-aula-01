import 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    transactions: {
      id: string
      text: string
      amount: string
      created_at: string
      session_id?: string
    }
  }
}
