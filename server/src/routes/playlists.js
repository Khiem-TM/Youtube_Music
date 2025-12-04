import { Router } from 'express'
import Playlist from '../models/playlist.js'
import PlaylistItem from '../models/playlistItem.js'
import { auth } from '../middlewares/auth.js'

const router = Router()

router.use(auth)

router.get('/me', async (req, res) => {
  const lists = await Playlist.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json({ items: lists })
})

router.get('/me/default', async (req, res) => {
  let pl = await Playlist.findOne({ userId: req.user.id, isDefault: true })
  if (!pl) pl = await Playlist.create({ userId: req.user.id, name: 'My Playlist', isDefault: true })
  res.json(pl)
})

router.post('/', async (req, res) => {
  const { name, description, isDefault } = req.body || {}
  if (!name) return res.status(400).json({ message: 'name required' })
  const pl = await Playlist.create({ userId: req.user.id, name, description, isDefault: !!isDefault })
  res.status(201).json(pl)
})

router.post('/:id/items', async (req, res) => {
  const { id } = req.params
  const playlist = await Playlist.findOne({ _id: id, userId: req.user.id })
  if (!playlist) return res.status(404).json({ message: 'playlist not found' })
  const { type, refId, thumbnail, thumbnailUrl, title, artist, audioUrl, duration } = req.body || {}
  if (!type || !refId) return res.status(400).json({ message: 'missing fields' })
  try {
    const item = await PlaylistItem.create({ playlistId: id, type, refId, thumbnail: thumbnail || undefined, thumbnailUrl: thumbnailUrl || undefined, title, artist, audioUrl, duration })
    res.status(201).json(item)
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'duplicate item' })
    throw e
  }
})

router.get('/:id/items', async (req, res) => {
  const { id } = req.params
  const playlist = await Playlist.findOne({ _id: id, userId: req.user.id })
  if (!playlist) return res.status(404).json({ message: 'playlist not found' })
  const items = await PlaylistItem.find({ playlistId: id })
    .sort({ createdAt: -1 })
    .select('_id refId type title artist thumbnail thumbnailUrl audioUrl duration createdAt')
  res.json({ items })
})

// get single playlist details
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const playlist = await Playlist.findOne({ _id: id, userId: req.user.id })
  if (!playlist) return res.status(404).json({ message: 'playlist not found' })
  res.json(playlist)
})

router.delete('/:id/items/:itemId', async (req, res) => {
  const { id, itemId } = req.params
  const playlist = await Playlist.findOne({ _id: id, userId: req.user.id })
  if (!playlist) return res.status(404).json({ message: 'playlist not found' })
  await PlaylistItem.deleteOne({ _id: itemId, playlistId: id })
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const playlist = await Playlist.findOne({ _id: id, userId: req.user.id })
  if (!playlist) return res.status(404).json({ message: 'playlist not found' })
  await PlaylistItem.deleteMany({ playlistId: id })
  await Playlist.deleteOne({ _id: id })
  res.json({ ok: true })
})

export default router

// favorites helpers
export async function getOrCreateFavorites(userId) {
  let pl = await Playlist.findOne({ userId, name: 'Favorites' })
  if (!pl) pl = await Playlist.create({ userId, name: 'Favorites', isDefault: false })
  return pl
}
// Favorites endpoints
router.get('/favorites', async (req, res) => {
  const pl = await getOrCreateFavorites(req.user.id)
  res.json(pl)
})

router.post('/favorites/items', async (req, res) => {
  const { type, refId, thumbnail, thumbnailUrl, title, artist, audioUrl, duration } = req.body || {}
  if (!type || !refId) return res.status(400).json({ message: 'missing fields' })
  const fav = await getOrCreateFavorites(req.user.id)
  try {
    const item = await PlaylistItem.create({ playlistId: fav._id.toString(), type, refId, thumbnail: thumbnail || undefined, thumbnailUrl: thumbnailUrl || undefined, title, artist, audioUrl, duration })
    res.status(201).json(item)
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'duplicate item' })
    throw e
  }
})

router.delete('/favorites/items/:refId', async (req, res) => {
  const { refId } = req.params
  const fav = await getOrCreateFavorites(req.user.id)
  await PlaylistItem.deleteOne({ playlistId: fav._id.toString(), refId })
  res.json({ ok: true })
})

// Check if a refId exists in any of the user's playlists
router.get('/contains/:refId', async (req, res) => {
  const { refId } = req.params
  const lists = await Playlist.find({ userId: req.user.id }).select('_id name')
  const ids = lists.map((l) => l._id)
  if (ids.length === 0) return res.json({ exists: false, count: 0, playlists: [] })
  const found = await PlaylistItem.find({ playlistId: { $in: ids }, refId }).select('playlistId')
  const map = new Map(lists.map((l) => [l._id.toString(), l.name]))
  const pls = Array.from(new Set(found.map((f) => f.playlistId.toString()))).map((pid) => ({ id: pid, name: map.get(pid) || '' }))
  res.json({ exists: pls.length > 0, count: pls.length, playlists: pls })
})
// Migration: backfill thumbnail from thumbnailUrl where missing
router.post('/migrate/thumbnails', async (req, res) => {
  const { dryRun = false } = req.body || {}
  const filter = { $or: [ { thumbnail: { $exists: false } }, { thumbnail: null }, { thumbnail: '' } ] }
  const items = await PlaylistItem.find(filter).select('_id thumbnailUrl')
  let updated = 0
  for (const it of items) {
    const val = it.thumbnailUrl || ''
    if (!val) continue
    if (!dryRun) await PlaylistItem.updateOne({ _id: it._id }, { $set: { thumbnail: val } })
    updated++
  }
  res.json({ ok: true, matched: items.length, updated })
})
