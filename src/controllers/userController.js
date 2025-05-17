import User from '../models/User.js'
import { customAlphabet } from 'nanoid'

const uidGen = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)

export async function createUser(req, res) {
  const { name, email } = req.body
  const uid = uidGen()
  const user = new User({ uid, name, email })
  await user.save()
  res.status(201).json({ success: true, data: { uid, name, email, createdAt: user.createdAt } })
}

export async function getUser(req, res) {
  const user = await User.findOne({ uid: req.params.uid })
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })
  res.json({ success: true, data: user })
}
