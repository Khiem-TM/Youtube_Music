import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiRepeat,
  FiShuffle,
  FiPlus,
} from "react-icons/fi";
import localPlaylistService from "../../services/localPlaylistService";
import { usePlayer } from "../../contexts/PlayerContext";

// Page footer handle music for all
function MusicPlayer({
  player = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    track: {
      title: "",
      artist: "",
      thumbnailUrl: "",
      views: 0,
      likes: 0,
    },
  },
  onPrev,
  onNext,
  onPlayPause,
  onSetVolume,
  onCycleRepeat,
  onToggleShuffle,
}) {
  const [localPlayer, setLocalPlayer] = useState(player);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [repeatLabel, setRepeatLabel] = useState("none");
  const [shuffleActive, setShuffleActive] = useState(false);
  const [toast, setToast] = useState(null);

  const { state: ctxState, actions: ctxActions } = usePlayer();
  const isPlaying = localPlayer.isPlaying;
  const currentTime = localPlayer.currentTime;
  const duration = localPlayer.duration;
  const track = localPlayer.track || {};
  const sanitize = (u) =>
    typeof u === "string" ? u.replace(/[`]/g, "").trim() : u || "";
  const cover = useMemo(() => {
    if (Array.isArray(track.thumbnails)) return sanitize(track.thumbnails[0]);
    if (typeof track.thumbnails === "string") return sanitize(track.thumbnails);
    return sanitize(track.thumbnailUrl || track.thumb || "");
  }, [track.thumbnails, track.thumbnailUrl, track.thumb]);

  const togglePlay = useCallback(() => {
    const next = { ...localPlayer, isPlaying: !isPlaying };
    setLocalPlayer(next);
    onPlayPause && onPlayPause(next.isPlaying);
    const audio = audioRef.current;
    if (!audio) return;
    if (next.isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [localPlayer, isPlaying, onPlayPause]);

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCount = (n) => {
    if (!n) return "0";
    if (n >= 1_000_000) return `${Math.floor(n / 1_000_00) / 10}M`;
    if (n >= 1_000) return `${Math.floor(n / 100) / 10}K`;
    return `${n}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);

  useEffect(() => {
    setLocalPlayer(player);
    setRepeatLabel(player.repeatMode || "none");
    setShuffleActive(!!player.shuffle);
    setVolume(typeof player.volume === "number" ? player.volume : 1);
    setToast(null);
  }, [player]);

  useEffect(() => {
    const onAdded = (e) => {
      setToast({ type: "success", message: "Đã thêm vào playlist thành công" });
      setTimeout(() => setToast(null), 3000);
    };
    const onDuplicate = (e) => {
      setToast({ type: "warning", message: "Bài hát đã có trong playlist" });
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener("playlist-item-added", onAdded);
    window.addEventListener("playlist-item-duplicate", onDuplicate);
    return () => {
      window.removeEventListener("playlist-item-added", onAdded);
      window.removeEventListener("playlist-item-duplicate", onDuplicate);
    };
  }, []);

  // set src khi có sự kiện pause hoặc thay đổi
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = sanitize(track.audioUrl || "");
    if (track.audioUrl) setLoadingTrack(true);
  }, [track.audioUrl]);

  // control playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (track.audioUrl && isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, track.audioUrl]);

  // volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const last = { t: 0 };
    const hTime = () => {
      const now = performance.now();
      if (now - last.t > 120) {
        last.t = now;
        setLocalPlayer((prev) => ({ ...prev, currentTime: audio.currentTime }));
      }
    };
    const hMeta = () => {
      setLocalPlayer((prev) => ({ ...prev, duration: audio.duration }));
      setLoadingTrack(false);
    };
    audio.addEventListener("timeupdate", hTime);
    audio.addEventListener("loadedmetadata", hMeta);
    const hEnded = () => {
      onNext && onNext();
    };
    audio.addEventListener("ended", hEnded);
    return () => {
      audio.removeEventListener("timeupdate", hTime);
      audio.removeEventListener("loadedmetadata", hMeta);
      audio.removeEventListener("ended", hEnded);
    };
  }, []);

  const setSeekFromClientX = (clientX) => {
    const el = progressRef.current;
    const audio = audioRef.current;
    if (!el || !audio || !duration) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const nextTime = ratio * duration;
    audio.currentTime = nextTime;
    setLocalPlayer((prev) => ({ ...prev, currentTime: nextTime }));
  };

  return (
    <div className="px-4 py-2">
      <audio ref={audioRef} />
      <div className="relative">
        <div className="mb-3">
          <div
            ref={progressRef}
            className="w-full h-[6px] md:h-[8px] bg-white/10 rounded cursor-pointer"
            onMouseDown={(e) => {
              setDragging(true);
              setSeekFromClientX(e.clientX);
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onMouseMove={(e) => {
              if (dragging) setSeekFromClientX(e.clientX);
            }}
            onClick={(e) => {
              setSeekFromClientX(e.clientX);
            }}
            onTouchStart={(e) => {
              const t = e.touches[0];
              setSeekFromClientX(t.clientX);
            }}
            onTouchMove={(e) => {
              const t = e.touches[0];
              setSeekFromClientX(t.clientX);
            }}
          >
            <div
              className="h-full bg-primary-500 rounded"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onPrev ? onPrev() : ctxActions.prev();
              }}
              className="p-2 text-gray-300 hover:text-white"
            >
              <FiSkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              {isPlaying ? (
                <FiPause className="w-6 h-6" />
              ) : (
                <FiPlay className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={() => {
                onNext ? onNext() : ctxActions.next();
              }}
              className="p-2 text-gray-300 hover:text-white"
            >
              <FiSkipForward className="w-5 h-5" />
            </button>
            <span className="text-xs text-gray-400 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div
            className="flex items-center gap-3 min-w-0 flex-1"
            onClick={() => {
              const idOrSlug = track.slug || track.id || track._id;
              if (!idOrSlug) return;
              const path =
                track.type === "video"
                  ? `/videos/details/${idOrSlug}`
                  : `/songs/details/${idOrSlug}`;
              window.location.href = path;
            }}
          >
            <img
              src={cover || "/placeholder-cover.jpg"}
              alt="cover"
              className="w-9 h-9 rounded object-cover"
            />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {track.title || "—"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {track.artist || "—"} • {formatCount(track.views)} views •{" "}
                {formatCount(track.likes)} likes
              </div>
            </div>
            {loadingTrack && (
              <span className="ml-2 text-xs text-gray-400">Đang chuyển…</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FiVolume2 className="w-5 h-5 text-gray-300" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  const a = audioRef.current;
                  if (a) a.volume = v;
                  onSetVolume ? onSetVolume(v) : ctxActions.setVolume(v);
                }}
                className="w-24"
              />
            </div>
            <button
              className={`p-2 rounded ${
                repeatLabel !== "none" ? "bg-white/10" : ""
              }`}
              title={`repeat: ${repeatLabel}`}
              onClick={() => {
                onCycleRepeat ? onCycleRepeat() : ctxActions.cycleRepeat();
              }}
            >
              <FiRepeat className="w-5 h-5 text-gray-300" />
            </button>
            <button
              className={`p-2 rounded ${shuffleActive ? "bg-white/10" : ""}`}
              title={shuffleActive ? "Shuffle on" : "Shuffle off"}
              onClick={() => {
                onToggleShuffle
                  ? onToggleShuffle()
                  : ctxActions.toggleShuffle();
              }}
            >
              <FiShuffle className="w-5 h-5 text-gray-300" />
            </button>
            <button
              className="p-2"
              title="Thêm vào playlist"
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  const evt = new CustomEvent("open-auth-modal", {
                    detail: { mode: "login" },
                  });
                  window.dispatchEvent(evt);
                  return;
                }
                const localToken = localStorage.getItem("localToken");
                if (!localToken) {
                  alert(
                    "Bạn chưa bật lưu Playlist local. Vào đăng ký và chọn opt-in để sử dụng."
                  );
                  return;
                }
                const refId = sanitize(
                  track._id ||
                    track.id ||
                    track.slug ||
                    track.title ||
                    track.name ||
                    ""
                );
                if (!refId) return;
                const thumb =
                  cover || sanitize(track.thumbnailUrl || track.thumb || "");
                window.dispatchEvent(
                  new CustomEvent("open-playlist-picker", {
                    detail: { refId, type: "song", thumbnail: thumb },
                  })
                );
              }}
            >
              <FiPlus className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
        {toast && (
          <div
            className={`absolute -top-8 right-2 px-3 py-1 rounded text-sm ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-yellow-500 text-black"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;
