// import Notification from '../models/Notification.js'
// import { sendEmail } from '../services/emailService.js'
// import { sendSMS }   from '../services/smsService.js'
// import { io }        from '../app.js'

// export async function sendNotification(req, res) {
//   const { userId, type, message, to } = req.body
//   const notification = new Notification({ userId, type, message, to })
//   await notification.save()
//   try {
//     if (type === 'email')     await sendEmail(to, 'Notification', message)
//     else if (type === 'sms')   await sendSMS(to, message)
//     notification.status = 'sent'
//   } catch (err){
//     console.log(err)
//     notification.status = 'failed'
//   }
//   await notification.save()
//   if (notification.type === 'in-app') {
//     io.to(userId).emit('in-app-notification', notification)
//   }
//   res.status(201).json({ success: true, data: notification })
// }

// export async function getUserNotifications(req, res) {
//   const list = await Notification.find({ userId: req.params.uid })
//   res.json({ success: true, data: list })
// }
// src/controllers/notificationController.js
import amqp from 'amqplib'
import Notification from '../models/Notification.js'

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://localhost'

async function publishToQueue(queueName, payload) {
  const conn    = await amqp.connect(RABBIT_URL)
  const channel = await conn.createChannel()
  await channel.assertQueue(queueName, { durable: true })
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), { persistent: true })
  await channel.close()
  await conn.close()
}

export async function sendNotification(req, res) {
  const { userId, type, message, to } = req.body
  const notification = new Notification({ userId, type, message, to })
  await notification.save()
  
  await publishToQueue('notifications', {
    notificationId: notification._id.toString(),
    userId, type, message, to,
    attempts: 0
  })
  
  res.status(202).json({ success: true, data: notification })
}


export async function getUserNotifications(req, res) {
  const list = await Notification.find({ userId: req.params.uid })
  res.json({ success: true, data: list })
}
