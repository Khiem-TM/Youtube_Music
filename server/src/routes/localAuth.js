import { Router } from 'express'
// for hash
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password, optInLocal = true, externalUserId } = req.body || {}
  if (!optInLocal) return res.json({ ok: true, optInLocal: false })
  if (!email || !password) return res.status(400).json({ message: 'email and password required' })
  const exist = await User.findOne({ email })
  if (exist) return res.status(409).json({ message: 'email exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, passwordHash, optInLocal: true, externalUserId })
  const token = jwt.sign({ sub: user._id.toString(), email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
  return res.json({ token })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  const user = await User.findOne({ email })
  if (!user || !user.optInLocal) return res.status(400).json({ message: 'no local account' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'invalid credentials' })
  const token = jwt.sign({ sub: user._id.toString(), email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
  return res.json({ token })
})

export default router
