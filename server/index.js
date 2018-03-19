require('newrelic')
require('dotenv').config()

const express = require('express')
const axios = require('axios')
const next = require('next')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const { setEsEndpoints } = require('./es/endpoints')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const getAccessTokenAsync = async (clientId, clientSecret) => {
  const result = await axios.post('https://api.gfycat.com/v1/oauth/token', {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  })
  if (result.status === 200 && result.data) {
    return result.data.access_token
  }
  return null
}

app.prepare().then(() => {
  const server = express()

  server.use(helmet())
  server.use(bodyParser.json())
  server.disable('x-powered-by')
  server.enable('trust proxy')

  server.head('/tk', async (req, res) => {
    const { GFYCAT_CLIENT_ID, GFYCAT_CLIENT_SECRET } = process.env
    const token = await getAccessTokenAsync(GFYCAT_CLIENT_ID, GFYCAT_CLIENT_SECRET)
    res.header('X-TK', token)
    return res.send()
  })
  setEsEndpoints(server)
  server.get('*', (req, res) => handle(req, res))

  server.listen(port, (err) => {
    if (err) throw err
    // eslint-disable-next-line
    console.log(`> Ready on http://localhost:${port}`)
  })
})