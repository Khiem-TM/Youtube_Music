import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  name: { type: String, required: true },
  description: { type: String },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Playlist', playlistSchema)
