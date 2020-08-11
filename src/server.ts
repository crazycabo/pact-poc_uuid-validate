import cors from 'cors'
import express from 'express'

import { IndexRouter } from './controllers/v0/index.router'

import bodyParser from 'body-parser'
import { config } from './config/config'
import { V0_UUID_MODELS } from './controllers/v0/model.index'

(async () => {
  const app = express()
  const port = process.env.PORT || 8221

  app.use(bodyParser.json())
  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' )
  })

  // Start the Server
  app.listen( port, () => {
    console.log( `Server running on http://localhost:8221` )
    console.log( `Press CTRL+C to stop server` )
  })
})()