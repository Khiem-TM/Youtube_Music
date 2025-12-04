import axios from 'axios'

const LOCAL_BASE_URL = 'http://localhost:8080'

const localApi = axios.create({ baseURL: LOCAL_BASE_URL, headers: { 'Content-Type': 'application/json' } })

localApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('localToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const svc = {
  ensureDefault: async () => {
    const res = await localApi.get('/playlists/me/default')
    return res.data
  },
  addToDefault: async (payload) => {
    const pl = await svc.ensureDefault()
    const res = await localApi.post(`/playlists/${pl._id}/items`, payload)
    return res.data
  },
  addIdToDefault: async (refId, type = 'song') => {
    const pl = await svc.ensureDefault()
    const res = await localApi.post(`/playlists/${pl._id}/items`, { type, refId })
    return res.data
  },
  ensureFavorites: async () => {
    const res = await localApi.get('/playlists/favorites')
    return res.data
  },
  addFavorite: async (refId, type = 'song') => {
    await localApi.post('/playlists/favorites/items', { type, refId })
    return true
  },
  removeFavorite: async (refId) => {
    await localApi.delete(`/playlists/favorites/items/${encodeURIComponent(refId)}`)
    return true
  },
  listMyPlaylists: async () => {
    const res = await localApi.get('/playlists/me')
    return res.data.items || []
  },
  getPlaylist: async (id) => {
    const res = await localApi.get(`/playlists/${id}`)
    return res.data
  },
  createPlaylist: async (name, description) => {
    const res = await localApi.post('/playlists', { name: name || 'My Favourite Playlist', description })
    return res.data
  },
  addToPlaylist: async (playlistId, refId, type = 'song') => {
    let payload
    if (typeof type === 'object' && type) payload = { ...type, refId }
    else payload = { type, refId }
    const res = await localApi.post(`/playlists/${playlistId}/items`, payload)
    return res.data
  },
  removeFromPlaylist: async (playlistId, itemId) => {
    const res = await localApi.delete(`/playlists/${playlistId}/items/${itemId}`)
    return res.data
  },
  deletePlaylist: async (playlistId) => {
    const res = await localApi.delete(`/playlists/${playlistId}`)
    return res.data
  },
  listPlaylistItems: async (playlistId) => {
    const res = await localApi.get(`/playlists/${playlistId}/items`)
    return res.data.items || []
  },
  containsRef: async (refId) => {
    const res = await localApi.get(`/playlists/contains/${encodeURIComponent(refId)}`)
    return res.data
  }
}

export default svc
