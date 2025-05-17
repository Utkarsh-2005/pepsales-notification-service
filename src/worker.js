import 'dotenv/config'
import mongoose from 'mongoose'
import amqp from 'amqplib'
import { io as Client } from 'socket.io-client'
import Notification from './models/Notification.js'
import { sendEmail } from './services/emailService.js'
import { sendSMS }   from './services/smsService.js'

// Environment
const {
  MONGO_URI,
  RABBIT_URL,
  SOCKET_URL = 'http://localhost:5000',
  MAX_ATTEMPTS = 5,
  RETRY_DELAY_MS = 5000
} = process.env

// MongoDB connection
await mongoose.connect(MONGO_URI)
console.log('Worker connected to MongoDB')

// Socket.io client
const socket = Client(SOCKET_URL, { transports: ['websocket'] })
socket.on('connect', () => console.log('Worker connected to Socket.io'))

// Process a single job
async function processMessage(msg, channel) {
  const job = JSON.parse(msg.content.toString())
  console.log('Received job', job)

  const { notificationId, userId, type, to, message, attempts = 0 } = job

  try {
    if (type === 'email') {
      await sendEmail(to, 'Notification', message)
      console.log('Email sent to', to)
    } else if (type === 'sms') {
      await sendSMS(to, message)
      console.log('SMS sent to', to)
    }

    await Notification.findByIdAndUpdate(notificationId, { status: 'sent' })
    console.log('Notification marked sent:', notificationId)
  } catch (err) {
    console.error('Job processing error:', err.message)

    const next = attempts + 1
    await Notification.findByIdAndUpdate(notificationId, { status: 'failed' })

    if (next < MAX_ATTEMPTS) {
      console.log(`Re-enqueuing job (attempt ${next}) in ${RETRY_DELAY_MS * next}ms`)
      setTimeout(() => {
        channel.sendToQueue(
          'notifications',
          Buffer.from(JSON.stringify({ ...job, attempts: next })),
          { persistent: true }
        )
      }, RETRY_DELAY_MS * next)
    }
  }

  if (type === 'in-app') {
    console.log('Emitting in-app-notification for user', userId)
    socket.emit('in-app-notification', { userId, notificationId, type, message, to })
  }

  channel.ack(msg)
}

// Start the worker
async function startWorker() {
  const conn = await amqp.connect(RABBIT_URL)
  const channel = await conn.createChannel()
  await channel.assertQueue('notifications', { durable: true })
  console.log('Worker waiting for messages on "notifications" queue')
  channel.consume('notifications', msg => processMessage(msg, channel))
}

startWorker().catch(err => {
  console.error(' Worker failed to start:', err)
  process.exit(1)
})
