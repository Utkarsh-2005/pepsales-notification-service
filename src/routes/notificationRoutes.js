import { Router } from 'express'
import {
  sendNotification,
  getUserNotifications
} from '../controllers/notificationController.js'

const router = Router()
router.post('/notifications', sendNotification)
router.get('/users/:uid/notifications', getUserNotifications)
export default router
