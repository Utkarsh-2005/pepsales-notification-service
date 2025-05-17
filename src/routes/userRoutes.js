import { Router } from 'express'
import { createUser, getUser } from '../controllers/userController.js'

const router = Router()
router.post('/users', createUser)
router.get('/users/:uid', getUser)
export default router
