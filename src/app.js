import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import http from 'http'
import { Server } from 'socket.io'

const app = express()

app.use(cors())
app.use(express.json())


const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
  const { uid } = socket.handshake.query
  if (uid) {
    socket.join(uid)
  }
})


app.get('/', (req, res) => {
  res.send('Hello World')
})

connectDB().then(() => {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})