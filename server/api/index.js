import express from 'express'
import usersRoutes from './users'
import boardsRoutes from './boards'
import listsRoutes from './lists'
import cardsRoutes from './cards'

const router = new express.Router()

router.use((request, response, next) => {
  if (request.session.userId) return next()
  response.status(400).json({
    error: 'Not Authorized'
  })
})
router.use('/users',  usersRoutes)
router.use('/cards',  cardsRoutes)
router.use('/boards', boardsRoutes)
router.use('/lists',  listsRoutes)

export default router
