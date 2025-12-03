import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import localSvc from "../services/localPlaylistService";
import axios from "axios";
import { FiTrash2, FiPlay } from "react-icons/fi";
import { usePlayer } from "../contexts/PlayerContext";

const BASE_URL = "https://youtube-music.f8team.dev/api";

export default function MyPlaylist() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const raw = await localSvc.listPlaylistItems(id);
        setItems(raw);
      } catch (e) {
        setError("Không thể tải playlist");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [id]);

  const handleRemoved = async (itemId) => {
    try {
      setItems((prev) => prev.filter((x) => x._id !== itemId));
    } catch (_) {}
  };

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold text-white mb-4">My Playlist</h1>
      {loading && <div className="text-gray-400">Đang tải...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
      >
        {items.map((it) => (
          <SongCard
            key={it._id}
            item={it}
            playlistId={id}
            onRemoved={handleRemoved}
          />
        ))}
      </div>
    </div>
  );
}

function SongCard({ item, playlistId, onRemoved }) {
  const [detail, setDetail] = useState(null);
  const [removing, setRemoving] = useState(false);
  const { actions } = usePlayer();
  useEffect(() => {
    let ok = true;
    const load = async () => {
      try {
        if (item.type === "song") {
          const res = await axios.get(`${BASE_URL}/songs/details/${item.refId}`, { params: { limit: 20 } });
          if (ok) setDetail(res.data);
        }
      } catch (_) {}
    };
    load();
    return () => {
      ok = false;
    };
  }, [item]);

  const idOrSlug = useMemo(
    () => detail?.slug || detail?._id || item.refId,
    [detail, item]
  );

  return (
    <div className="group relative rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] transition-colors p-3">
      <div className="relative">
        <img
          src={
            (Array.isArray(detail?.thumbnails)
              ? detail.thumbnails[0]
              : detail?.thumbnailUrl || item.thumbnail || item.thumbnailUrl) ||
            "/favicon.ico"
          }
          alt="thumb"
          className="w-[150px] h-[150px] rounded object-cover mx-auto"
          onClick={() => {
            if (!detail) return;
            actions.playTrack({
              ...detail,
              type: "song",
              title: detail.title,
              audioUrl: detail.audioUrl,
              thumbnails: detail.thumbnails,
              artist: Array.isArray(detail.artists)
                ? detail.artists.join(", ")
                : detail.artist,
            });
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
            onClick={() => {
              if (!detail) return;
              actions.playTrack({
                ...detail,
                type: "song",
                title: detail.title,
                audioUrl: detail.audioUrl,
                thumbnails: detail.thumbnails,
                artist: Array.isArray(detail.artists)
                  ? detail.artists.join(", ")
                  : detail.artist,
              });
            }}
          >
            <FiPlay className="w-5 h-5" />
          </button>
        </div>
        <button
          className={`absolute top-2 right-2 px-2 py-1 rounded bg-red-600 text-white text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
            removing ? "cursor-not-allowed opacity-60" : ""
          }`}
          onClick={async () => {
            if (removing) return;
            if (!confirm("Xóa bài khỏi playlist?")) return;
            try {
              setRemoving(true);
              await localSvc.removeFromPlaylist(playlistId, item._id);
              onRemoved && onRemoved(item._id);
            } catch (e) {
            } finally {
              setRemoving(false);
            }
          }}
        >
          <FiTrash2 className="w-4 h-4" /> Xóa
        </button>
      </div>
      <div className="mt-3 min-w-0">
        <div className="text-white truncate text-sm">
          {detail?.title || item.refId}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {Array.isArray(detail?.artists)
            ? detail.artists.join(", ")
            : detail?.artist || ""}
        </div>
        {idOrSlug && (
          <a
            href={`/songs/details/${idOrSlug}`}
            className="mt-1 inline-block text-xs text-blue-400 hover:text-blue-300"
          >
            Xem chi tiết
          </a>
        )}
      </div>
    </div>
  );
}
