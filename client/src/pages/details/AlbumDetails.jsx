import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";

const BASE_URL = "https://youtube-music.f8team.dev/api";

export default function AlbumDetails() {
  const { slug } = useParams();
  const { actions } = usePlayer();
  const [data, setData] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/albums/details/${slug}`, { params: { limit: 20, sort: "-releaseDate" } });
        const d = res.data || {};
        setData(d);
        const t = Array.isArray(d.tracks) ? d.tracks : d.items || [];
        setTracks(t);
      } catch (e) {
        setError("Không thể tải album");
      }
    };
    fetch();
  }, [slug]);

  const playAll = () => {
    if (!tracks.length) return;
    const queue = tracks.map((s) => ({ ...s, type: "song", title: s.title || s.name }));
    actions.playTrack(queue[0], queue);
  };

  const playOne = (s) => {
    actions.playTrack({ ...s, type: "song", title: s.title || s.name });
  };

  return (
    <div className="px-6 py-6">
      {data && (
        <div className="flex items-center gap-4 mb-6">
          <img src={(Array.isArray(data.thumbnails) ? data.thumbnails[0] : data.thumbnailUrl || data.thumb) || ""} alt={data.title || data.name} className="w-40 h-40 rounded object-cover" />
          <div>
            <h1 className="text-3xl font-bold">{data.title || data.name}</h1>
            <p className="text-gray-400">{Array.isArray(data.artists) ? data.artists.join(", ") : data.artist || "Various Artists"}</p>
            <button onClick={playAll} className="mt-3 px-4 py-2 rounded bg-primary-500 hover:bg-primary-600 text-white">Play all</button>
          </div>
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div className="space-y-2">
        {tracks.map((s, idx) => (
          <div key={s._id || s.id || idx} className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer" onClick={() => playOne(s)}>
            <img src={(Array.isArray(s.thumbnails) ? s.thumbnails[0] : s.thumbnailUrl || s.thumb) || ""} alt="thumb" className="w-12 h-12 rounded object-cover" />
            <div className="min-w-0">
              <div className="text-white truncate">{s.title || s.name}</div>
              <div className="text-xs text-gray-400 truncate">{Array.isArray(s.artists) ? s.artists.join(", ") : s.artist || ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

