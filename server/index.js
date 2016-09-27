import '../../config/environment'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import apiUsersRouter from './api/users'
import apiBoardsRouter from './api/boards'
import apiListsRouter from './api/lists'
import apiCardsRouter from './api/cards'

const appRoot = process.env.APP_ROOT
const buildPath = process.env.BUILD_PATH

const server = express()

module.exports = server

server.set('env', process.env.NODE_ENV)
server.set('port', process.env.PORT || '3000')

server.use(logger('dev'))
// server.use(favicon(buildPath+'/public/favicon.ico'))
server.use(express.static(buildPath+'/public'))
server.use(bodyParser.json())
server.use(cookieParser())

server.get('/api/users', (request, response) => {
  response.json([
    {
      id: 1,
      email: 'laura@example.org'
    },
    {
      id: 2,
      email: 'luther@example.org'
    }
  ])
});

server.get('/api/current-user', (request, response) => {
  response.json({
    id: 42,
    email: "me@me.com",
    password: "123"
  })
})

server.use('/api/users', apiUsersRouter)
server.use('/api/cards', apiCardsRouter)
server.use( '/api/boards', apiBoardsRouter )
server.use( '/api/lists', apiListsRouter )

server.get('/*', (request, response) => {
  response.sendFile(buildPath+'/public/index.html')
});




// error handlers
// catch 404 and forward to error handler
server.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  server.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
      stack: err.stack,
    });
  });
}else{
  // production error handler
  // no stacktraces leaked to user
  server.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {},
      stack: [],
    });
  });
}

if (process.env.NODE_ENV !== 'test'){
  server.listen(server.get('port'))
}
