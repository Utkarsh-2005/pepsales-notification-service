import { Router } from 'express'
import { createUser, getUser } from '../controllers/userController.js'
import requireApiKey  from '../middleware/requireApiKey.js'

const router = Router()
router.post('/users', createUser)
router.get('/users/:uid', requireApiKey, getUser)
export default router
