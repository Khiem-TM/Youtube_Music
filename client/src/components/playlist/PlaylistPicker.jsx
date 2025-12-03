import { useEffect, useState } from 'react'
import localSvc from '../../services/localPlaylistService'

export default function PlaylistPicker() {
  const [open, setOpen] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [pending, setPending] = useState(null) // { refId, type }
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    const handler = (e) => {
      setPending({ refId: e.detail?.refId, type: e.detail?.type || 'song' })
      setOpen(true)
      localSvc.listMyPlaylists().then(setPlaylists).catch(()=>{})
    }
    window.addEventListener('open-playlist-picker', handler)
    return () => window.removeEventListener('open-playlist-picker', handler)
  }, [])

  if (!open) return null

  return (
    <>
      <button className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={()=>setOpen(false)} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[360px] bg-dark-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Chọn playlist</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {playlists.map((pl)=> (
              <button key={pl._id} onClick={async ()=>{
                try {
                  await localSvc.addToPlaylist(pl._id, pending.refId, pending.type)
                  setOpen(false)
                } catch(e) { alert('Không thể thêm vào playlist') }
              }} className="w-full text-left px-3 py-2 rounded hover:bg-white/10">
                <div className="text-sm text-white">{pl.name}</div>
                <div className="text-xs text-gray-400">{new Date(pl.createdAt).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
          <div className="mt-3">
            {creating ? (
              <div className="space-y-2">
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tên playlist" className="w-full bg-dark-800 border border-gray-700 rounded px-3 py-2 text-white" />
                <div className="flex gap-2">
                  <button onClick={()=>setCreating(false)} className="px-3 py-2 rounded bg-white/10 text-white">Hủy</button>
                  <button onClick={async ()=>{
                    try {
                      const pl = await localSvc.createPlaylist(name)
                      const next = await localSvc.listMyPlaylists()
                      setPlaylists(next)
                      await localSvc.addToPlaylist(pl._id, pending.refId, pending.type)
                      setOpen(false)
                    } catch(e){ alert('Không thể tạo playlist') }
                  }} className="px-3 py-2 rounded bg-primary-500 text-white">Tạo</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setCreating(true)} className="w-full px-3 py-2 rounded bg-white/10 text-white">Thêm vào playlist mới</button>
            )}
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded bg-white/10 text-white">Hủy</button>
          </div>
        </div>
      </div>
    </>
  )
}
