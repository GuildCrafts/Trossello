process.env.NODE_ENV = process.env.NODE_ENV || 'development'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'


const server = express()


server.use(logger('dev'))
server.use(favicon(__dirname+'/public/favicon.ico'))
server.use(express.static(__dirname+'/public'))
server.use(bodyParser.json())
server.use(cookieParser())

server.get('/*', (request, response) => {
  response.sendFile(__dirname+'/public/index.html')
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

server.listen(3000)
