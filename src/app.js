import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import requireApiKey  from './middleware/requireApiKey.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(requireApiKey)
app.use(notificationRoutes)


const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
  const { uid } = socket.handshake.query
  if (uid) {
    socket.join(uid)
  }
    socket.on('in-app-notification', payload => {
    console.log('server received in-app from worker:', payload)
    io.to(payload.userId).emit('in-app-notification', payload)
  })
})

connectDB().then(() => {
  const PORT = process.env.PORT || 5000
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
