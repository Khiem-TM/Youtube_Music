import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";
import MusicPage from "../../components/music/MusicPage";

const BASE_URL = "https://youtube-music.f8team.dev/api";

export default function SongDetails() {
  const { id } = useParams();
  const { actions } = usePlayer();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [related, setRelated] = useState([]);

  // call API
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/songs/details/${id}`, { params: { limit: 20 } });
        const d = res.data || {};
        setData(d);
        const items = Array.isArray(d.items) ? d.items : [];
        setRelated(items);
        if (d.audioUrl) {
          actions.playTrack({
            ...d,
            type: "song",
            title: d.title || d.name,
            thumbnails: Array.isArray(d.thumbnails) ? d.thumbnails : [d.thumbnailUrl || d.thumb].filter(Boolean),
            artists: Array.isArray(d.artists) ? d.artists : [d.artist].filter(Boolean),
            audioUrl: d.audioUrl,
          })
        }
      } catch (e) {
        setError("Không thể tải bài hát");
      }
    };
    fetch();
  }, [id]);

  // Hàm handle play music
  const playSong = () => {
    if (!data) return;
    actions.playTrack({
      ...data,
      type: "song",
      title: data.title || data.name,
      thumbnails: Array.isArray(data.thumbnails)
        ? data.thumbnails[0]
        : data.thumbnailUrl || data.thumb,
      artists: Array.isArray(data.artists)
        ? data.artists
        : [data.artist].filter(Boolean),
    });
  };

  return (
    <div className="px-6 py-6">
      {error && <div className="text-red-400 mb-4">{error}</div>}

      {data && (
        <MusicPage
          currentTrack={{
            title: data.title || data.name,
            thumbnails: [
              (Array.isArray(data.thumbnails)
                ? data.thumbnails[0]
                : data.thumbnailUrl || data.thumb) || "",
            ].filter(Boolean),
            album: {
              tracks: related.map((s) => ({
                id: s._id || s.id || s.slug,
                title: s.title || s.name,
                thumbnails: [
                  (Array.isArray(s.thumbnails)
                    ? s.thumbnails[0]
                    : s.thumbnailUrl || s.thumb) || "",
                ].filter(Boolean),
                artist: Array.isArray(s.artists)
                  ? s.artists.join(", ")
                  : s.artist || "",
                duration: s.duration || 0,
              })),
            },
          }}
        />
      )}
    </div>
  );
}
