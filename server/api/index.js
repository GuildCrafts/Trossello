import express from 'express'
import usersRoutes from './users'
import boardsRoutes from './boards'
import listsRoutes from './lists'
import cardsRoutes from './cards'

const router = new express.Router()

router.use('/users',  usersRoutes)
router.use('/cards',  boardsRoutes)
router.use('/boards', listsRoutes)
router.use('/lists',  cardsRoutes)

export default router
