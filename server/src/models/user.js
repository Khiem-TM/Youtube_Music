import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  optInLocal: { type: Boolean, default: true },
  externalUserId: { type: String },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
