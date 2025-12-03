import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRouter from './routes/localAuth.js'
import playlistsRouter from './routes/playlists.js'

dotenv.config()

const app = express()
app.use(cors({ origin: [/http:\/\/localhost:\d+/], credentials: false }))
app.use(express.json())
app.use(morgan('dev'))

// config and connect to myDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ytmusic_local'
let dbConnected = false
mongoose.connect(MONGO_URI)
  .then(() => { dbConnected = true; console.log('MongoDB connected') })
  .catch((err) => { dbConnected = false; console.error('MongoDB connection failed:', err.message) })

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err)
})

app.get('/health', (req, res) => res.json({ ok: true, dbConnected })) // Lấy ra condition của DB connetion
app.use('/local-auth', authRouter)
app.use('/playlists', playlistsRouter)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
