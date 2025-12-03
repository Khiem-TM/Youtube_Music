import jwt from 'jsonwebtoken'

// Nhận vào request, response và next: Chuyển sang middlewaré tiếp theo
export function auth(req, res, next) {
  try {
    const h = req.headers.authorization || ''
    // check token có đúng định dạng không
    const token = h.startsWith('Bearer ') ? h.slice(7) : ''
    if (!token) return res.status(401).json({ message: 'Không thể xác thực' })
      // check token có verify k ? --> mếu ok thì lưu payload
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Không thể xác thực' })
  }
}
