import fastify from 'fastify'

const app = fastify()

app.get('/', () => {
  console.log('hello world')
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
