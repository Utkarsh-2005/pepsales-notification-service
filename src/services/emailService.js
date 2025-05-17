import sgMail from '@sendgrid/mail'
import 'dotenv/config'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export function sendEmail(to, subject, text) {
  return sgMail.send({ to, from: process.env.SENDGRID_FROM, subject, text })
}
