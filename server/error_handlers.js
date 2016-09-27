import express from 'express'
import github from './github'
const router = express.Router()

// error handlers
// catch 404 and forward to error handler
router.use((request, response, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  router.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({
      message: error.message,
      error: error,
      stack: error.stack,
    });
  });
}else{
  // production error handler
  // no stacktraces leaked to user
  router.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({
      message: error.message,
      error: {},
      stack: [],
    });
  });
}



export default router
