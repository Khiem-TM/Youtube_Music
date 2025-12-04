import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import localSvc from "../services/localPlaylistService";
import axios from "axios";
import { FiTrash2, FiPlay } from "react-icons/fi";
import { usePlayer } from "../contexts/PlayerContext";

const BASE_URL = "https://youtube-music.f8team.dev/api";

export default function MyPlaylist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const raw = await localSvc.listPlaylistItems(id);
        setItems(raw);
        try {
          const pl = await localSvc.getPlaylist(id);
          setPlaylist(pl);
        } catch (err) {
          console.warn("Không thể lấy thông tin playlist:", err);
        }
      } catch (err) {
        console.error("Không thể tải playlist:", err);
        setError("Không thể tải playlist");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [id]);

  const handleRemoved = async (itemId) => {
    setItems((prev) => prev.filter((x) => x._id !== itemId));
  };

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">
          {playlist?.name || "My Playlist"}
        </h1>
        <button
          aria-label="Xóa playlist"
          className={`p-2 rounded-full bg-red-600 hover:bg-red-700 text-white ${
            deleting ? "opacity-60 cursor-not-allowed" : ""
          }`}
          onClick={async () => {
            if (deleting) return;
            if (!confirm("Xóa toàn bộ playlist này?")) return;
            try {
              setDeleting(true);
              await localSvc.deletePlaylist(id);
              navigate("/library");
            } catch (err) {
              console.error("Không thể xóa playlist:", err);
            } finally {
              setDeleting(false);
            }
          }}
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
      {loading && <div className="text-gray-400">Đang tải...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
      >
        {items.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-8">
            Playlist rỗng
          </div>
        )}
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
  const [detail, setDetail] = useState(item);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [removing, setRemoving] = useState(false);
  const { actions, state } = usePlayer();
  useEffect(() => {
    setDetail(item);
    setDetailError("");
  }, [item]);

  const refId = useMemo(
    () => (item.refId || item._id || "").toString(),
    [item.refId, item._id]
  );
  const currentId = useMemo(
    () =>
      (
        state.track?._id ||
        state.track?.id ||
        state.track?.slug ||
        state.track?.videoId ||
        ""
      ).toString(),
    [state.track]
  );
  const isCurrent = !!currentId && refId && currentId === refId;

  const fetchDetail = useCallback(async () => {
    if (detail?.audioUrl || !refId) return detail;
    setDetailLoading(true);
    setDetailError("");
    try {
      const res = await axios.get(
        `${BASE_URL}/songs/details/${encodeURIComponent(refId)}`,
        { params: { limit: 20 } }
      );
      const d = res.data || {};
      const normalized = {
        ...d,
        _id: d._id || d.id || refId,
        id: d.id || d._id || refId,
        refId,
      };
      setDetail((prev) => ({ ...prev, ...normalized }));
      return normalized;
    } catch (err) {
      console.warn("Không thể tải chi tiết bài hát", refId, err);
      setDetailError("Không khả dụng");
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, [detail, refId]);

  const display = detail || item;
  const thumb =
    (Array.isArray(display?.thumbnails)
      ? display.thumbnails[0]
      : display?.thumbnail || display?.thumbnailUrl || item.thumbnail) ||
    "/favicon.ico";

  const handlePlay = async () => {
    const data = display?.audioUrl ? display : await fetchDetail();
    if (!data || !data.audioUrl) {
      alert("Không thể phát bài hát này");
      return;
    }
    actions.playTrack({
      ...data,
      type: "song",
      title: data.title || item.title || refId,
      thumbnails: Array.isArray(data.thumbnails)
        ? data.thumbnails
        : [data.thumbnail || data.thumbnailUrl || thumb].filter(Boolean),
      artists: Array.isArray(data.artists)
        ? data.artists
        : [data.artist || item.artist].filter(Boolean),
      _id: data._id || refId,
      id: data.id || refId,
    });
  };

  return (
    <div
      className={`group relative rounded-lg ${
        isCurrent ? "ring-2 ring-primary-500" : ""
      } bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] transition-colors p-3`}
    >
      <div className="relative">
        <img
          src={thumb}
          alt="thumb"
          className="w-[150px] h-[150px] rounded object-cover mx-auto"
          onClick={() => {
            if (detailError) return;
            handlePlay();
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
            onClick={() => {
              if (detailError) return;
              handlePlay();
            }}
          >
            <FiPlay className="w-5 h-5" />
          </button>
        </div>
        <button
          aria-label="Xóa item"
          className={`absolute top-1 right-1 w-7 h-7 flex items-center justify-center rounded-full text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ${
            removing ? "cursor-not-allowed opacity-60" : ""
          }`}
          onClick={async () => {
            if (removing) return;
            if (!confirm("Xóa bài khỏi playlist?")) return;
            try {
              setRemoving(true);
              await localSvc.removeFromPlaylist(playlistId, item._id);
              onRemoved && onRemoved(item._id);
            } catch (err) {
              console.error("Không thể xóa item khỏi playlist:", err);
            } finally {
              setRemoving(false);
            }
          }}
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
        {detailLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-2 py-1 rounded bg-white/10 text-xs text-white">
              Đang tải…
            </span>
          </div>
        )}
        {detailError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-2 py-1 rounded bg-red-600 text-xs text-white">
              Không khả dụng
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 min-w-0">
        <div className="text-white truncate text-sm">
          {display?.title || item.title || refId}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {Array.isArray(display?.artists)
            ? display.artists.join(", ")
            : display?.artist || item.artist || ""}
        </div>
        {refId && (
          <a
            href={`/songs/details/${encodeURIComponent(refId)}`}
            className="mt-1 inline-block text-xs text-blue-400 hover:text-blue-300"
          >
            Xem chi tiết
          </a>
        )}
      </div>
    </div>
  );
}
