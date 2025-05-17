import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  type:      { type: String, enum: ['email','sms','in-app'], required: true },
  message:   { type: String, required: true },
  to:        { type: String, required: true },
  status:    { type: String, enum: ['pending','sent','failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Notification', notificationSchema)
