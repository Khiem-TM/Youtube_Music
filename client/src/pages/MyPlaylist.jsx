import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import localSvc from '../services/localPlaylistService'
import axios from 'axios'

const BASE_URL = 'https://youtube-music.f8team.dev/api'

export default function MyPlaylist() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const raw = await localSvc.listPlaylistItems(id)
        setItems(raw)
      } catch (e) { setError('Không thể tải playlist') } finally { setLoading(false) }
    }
    fetchItems()
  }, [id])

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold text-white mb-4">My Playlist</h1>
      {loading && <div className="text-gray-400">Đang tải...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <div className="space-y-2">
        {items.map((it, idx) => (
          <SongRow key={idx} item={it} />
        ))}
      </div>
    </div>
  )
}

function SongRow({ item }) {
  const [detail, setDetail] = useState(null)
  useEffect(() => {
    let ok = true
    const load = async () => {
      try {
        if (item.type === 'song') {
          const res = await axios.get(`${BASE_URL}/songs/details/${item.refId}`)
          if (ok) setDetail(res.data)
        }
      } catch (_) {}
    }
    load()
    return () => { ok = false }
  }, [item])
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-white/10">
      <img src={(Array.isArray(detail?.thumbnails) ? detail.thumbnails[0] : detail?.thumbnailUrl) || '/favicon.ico'} alt="thumb" className="w-12 h-12 rounded object-cover" />
      <div className="min-w-0">
        <div className="text-white truncate">{detail?.title || item.refId}</div>
        <div className="text-xs text-gray-400 truncate">{Array.isArray(detail?.artists) ? detail.artists.join(', ') : detail?.artist || ''}</div>
      </div>
    </div>
  )
}
