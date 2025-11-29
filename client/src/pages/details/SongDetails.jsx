import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";

const BASE_URL = "https://youtube-music.f8team.dev/api";

export default function SongDetails() {
  const { id } = useParams();
  const { actions } = usePlayer();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/songs/details/${id}`, { params: { limit: 20 } });
        setData(res.data || {});
      } catch (e) {
        setError("Không thể tải bài hát");
      }
    };
    fetch();
  }, [id]);

  const playSong = () => {
    if (!data) return;
    actions.playTrack({
      ...data,
      type: "song",
      title: data.title || data.name,
      thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails[0] : data.thumbnailUrl || data.thumb,
      artists: Array.isArray(data.artists) ? data.artists : [data.artist].filter(Boolean),
    });
  };

  return (
    <div className="px-6 py-6">
      {data && (
        <div className="mb-6">
          <img src={(Array.isArray(data.thumbnails) ? data.thumbnails[0] : data.thumbnailUrl || data.thumb) || ""} alt={data.title || data.name} className="w-full max-w-[800px] h-[270px] object-cover rounded-lg" />
          <h1 className="text-3xl font-bold mt-4">{data.title || data.name}</h1>
          <p className="text-gray-400">{Array.isArray(data.artists) ? data.artists.join(", ") : data.artist || ""}</p>
          <button onClick={playSong} className="mt-3 px-4 py-2 rounded bg-primary-500 hover:bg-primary-600 text-white">Play</button>
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}
    </div>
  );
}

