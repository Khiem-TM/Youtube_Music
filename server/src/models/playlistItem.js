import mongoose from 'mongoose'

const playlistItemSchema = new mongoose.Schema({
  playlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', index: true, required: true },
  type: { type: String, enum: ['song','album','playlist','video'], required: true },
  refId: { type: String, required: true },
  title: { type: String },
  artist: { type: String },
  thumbnailUrl: { type: String },
  audioUrl: { type: String },
  duration: { type: Number },
}, { timestamps: true })

playlistItemSchema.index({ playlistId: 1, refId: 1 }, { unique: true })

export default mongoose.model('PlaylistItem', playlistItemSchema)
