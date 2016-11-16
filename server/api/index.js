import express from 'express'
import boardsRoutes from './boards'
import listsRoutes from './lists'
import cardsRoutes from './cards'
import inviteRoutes from './invites'
import userRoutes from './users'

const router = new express.Router()

router.use('/invites', inviteRoutes)

router.use((request, response, next) => {
  if (request.session.userId) return next()
  response.status(400).json({
    error: 'Not Authorized'
  })
})
router.use('/cards',  cardsRoutes)
router.use('/boards', boardsRoutes)
router.use('/lists',  listsRoutes)
router.use('/users', userRoutes)

router.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({
    error: {
      message: error.message,
      stack: error.stack,
    }
  });
});

export default router
