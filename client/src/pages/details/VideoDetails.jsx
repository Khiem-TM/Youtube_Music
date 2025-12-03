import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";

const BASE_URL = "https://youtube-music.f8team.dev/api";

export default function VideoDetails() {
  const { id } = useParams();
  const { actions } = usePlayer();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState("UP NEXT");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/videos/details/${id}`, { params: { limit: 20 } });
        const d = res.data || {};
        setData(d);
        const items = Array.isArray(d.items) ? d.items : [];
        if (items.length) setRelated(items);
        else {
          const fb = await axios.get(`${BASE_URL}/explore/videos`, { params: { limit: 15 } });
          const v = Array.isArray(fb.data) ? fb.data : fb.data?.items || [];
          setRelated(v);
        }
      } catch (e) {
        setError("Không thể tải video");
      }
    };
    fetch();
  }, [id]);

  const playVideo = () => {
    if (!data) return;
    actions.playTrack({
      ...data,
      type: "song",
      title: data.title || data.name,
      thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails : [data.thumbnailUrl || data.thumb].filter(Boolean),
      artists: Array.isArray(data.artists) ? data.artists : [data.artist].filter(Boolean),
      audioUrl: data.audioUrl,
    });
  };

  return (
    <div className="px-6 py-6">
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {data && (
        <div className="max-w-[1400px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* Left: video thumbnail */}
          <div>
            <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-white/10">
              <img
                src={(Array.isArray(data.thumbnails) ? data.thumbnails[0] : data.thumbnailUrl || data.thumb) || ""}
                alt={data.title || data.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={playVideo}
                  className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
                >
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mt-4">{data.title || data.name}</h1>
            <p className="text-gray-400">{Array.isArray(data.artists) ? data.artists.join(", ") : data.artist || ""}</p>
          </div>

          {/* Right: sidebar list */}
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex items-center justify-end gap-8 border-b border-gray-700 mb-3">
              {['UP NEXT','LYRICS','RELATED'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-xs font-semibold tracking-wide ${activeTab===tab? 'text-white':'text-gray-400 hover:text-gray-200'}`}
                >{tab}</button>
              ))}
            </div>

            {activeTab === 'UP NEXT' && (
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Playing from</div>
                <div className="text-sm text-white font-semibold truncate mb-2">{data.title || data.name}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['All','Familiar','Discover','Downtempo','Chill','Romance'].map((k,i)=>(
                    <span key={i} className="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-200">{k}</span>
                  ))}
                </div>
                <div className="space-y-1">
                  {related.map((v,idx)=> (
                    <div key={v._id || v.id || v.slug || idx} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer"
                      onClick={() => { setData(v); actions.playTrack({
                        ...v,
                        type:'song',
                        title: v.title || v.name,
                        thumbnails: Array.isArray(v.thumbnails)? v.thumbnails : [v.thumbnailUrl || v.thumb].filter(Boolean),
                        artist: Array.isArray(v.artists)? v.artists.join(', '): v.artist || '',
                        audioUrl: v.audioUrl,
                      })}}
                    >
                      <img src={(Array.isArray(v.thumbnails)? v.thumbnails[0] : v.thumbnailUrl || v.thumb) || ''} alt={v.title || v.name} className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{v.title || v.name}</div>
                        <div className="text-xs text-gray-400 truncate">{Array.isArray(v.artists)? v.artists.join(', '): v.artist || ''}</div>
                      </div>
                      <div className="text-xs text-gray-400 flex-shrink-0">{v.duration ? `${Math.floor(v.duration/60)}:${String(Math.floor(v.duration%60)).padStart(2,'0')}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'LYRICS' && (
              <div className="text-gray-400 text-center py-8 text-sm">Lyrics not available</div>
            )}

            {activeTab === 'RELATED' && (
              <div className="space-y-1">
                {related.map((v,idx)=> (
                  <div key={v._id || v.id || v.slug || idx} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer"
                    onClick={() => actions.playTrack({
                      ...v,
                      type:'song',
                      title: v.title || v.name,
                      thumbnails: Array.isArray(v.thumbnails)? v.thumbnails : [v.thumbnailUrl || v.thumb].filter(Boolean),
                      artist: Array.isArray(v.artists)? v.artists.join(', '): v.artist || '',
                      audioUrl: v.audioUrl,
                    })}
                  >
                    <img src={(Array.isArray(v.thumbnails)? v.thumbnails[0] : v.thumbnailUrl || v.thumb) || ''} alt={v.title || v.name} className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{v.title || v.name}</div>
                      <div className="text-xs text-gray-400 truncate">{Array.isArray(v.artists)? v.artists.join(', '): v.artist || ''}</div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">{v.duration ? `${Math.floor(v.duration/60)}:${String(Math.floor(v.duration%60)).padStart(2,'0')}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
