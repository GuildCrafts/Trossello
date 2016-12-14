import '../../config/environment'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import errorHandlers from './error_handlers'
import authRoutes from './auth_routes'
import apiRoutes from './api'
import HTTP from 'http'
import fs from 'fs'
import path from 'path'
const ARTIFACTS_PATH = path.resolve(__dirname, '../../tmp/artifacts')

const appRoot = process.env.APP_ROOT
const buildPath = process.env.BUILD_PATH
const server = express()

module.exports = server


server.set('env', process.env.NODE_ENV)

if (process.env.NODE_ENV !== 'test'){
  server.use(logger('dev'))
} else {
  const logStream = fs.createWriteStream(
    path.resolve(ARTIFACTS_PATH, 'server.log'),
    { flags: 'a' }
  )
  server.use(logger('dev', {stream: logStream}))
}

server.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY]
}))
server.use(express.static(buildPath+'/public'))
server.use(bodyParser.json())

server.use('/',    authRoutes);
server.use('/api', apiRoutes)

if (process.env.NODE_ENV === 'test'){
  // authentication back door
  server.get('/__login/:userId', (request, response) => {
    request.session.userId = Number(request.params.userId)
    response.status(200).send(`logged in as ${request.session.userId}`)
  })
}

server.get('/*', (request, response) => {
  response.sendFile(buildPath+'/public/index.html')
});

server.use(errorHandlers)

server.start = (port, callback) => {
  if (process.env.NODE_ENV !== 'test'){
    console.log(`Started server at http://localhost:${port}`)
    }
  server.set('port', port)
  // server.listen(port, callback)
  const httpServer = HTTP.createServer(server)
  httpServer.listen(port, callback)
  return httpServer
}

if (process.env.NODE_ENV !== 'test'){
  server.start(process.env.PORT || '3000')
}
