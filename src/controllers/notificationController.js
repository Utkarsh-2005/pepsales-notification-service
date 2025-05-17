import Notification from '../models/Notification.js'
import { sendEmail } from '../services/emailService.js'
import { sendSMS }   from '../services/smsService.js'
import { io }        from '../app.js'

export async function sendNotification(req, res) {
  const { userId, type, message, to } = req.body
  const notification = new Notification({ userId, type, message, to })
  await notification.save()
  try {
    if (type === 'email')     await sendEmail(to, 'Notification', message)
    else if (type === 'sms')   await sendSMS(to, message)
    notification.status = 'sent'
  } catch {
    notification.status = 'failed'
  }
  await notification.save()
  if (notification.type === 'in-app') {
    io.to(userId).emit('in-app-notification', notification)
  }
  res.status(201).json({ success: true, data: notification })
}

export async function getUserNotifications(req, res) {
  const list = await Notification.find({ userId: req.params.uid })
  res.json({ success: true, data: list })
}
