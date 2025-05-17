import Twilio from 'twilio'
import 'dotenv/config'

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export function sendSMS(to, body) {
  return client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to, body })
}
