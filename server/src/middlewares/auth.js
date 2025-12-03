import jwt from 'jsonwebtoken'

export function auth(req, res, next) {
  try {
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : ''
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
