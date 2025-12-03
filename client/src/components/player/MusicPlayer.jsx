import { useEffect, useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiRepeat,
  FiShuffle,
  FiHeart,
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
  const [liked, setLiked] = useState(false);

  const { state: ctxState, actions: ctxActions } = usePlayer();
  const isPlaying = localPlayer.isPlaying;
  const currentTime = localPlayer.currentTime;
  const duration = localPlayer.duration;
  const track = localPlayer.track || {};
  const sanitize = (u) => (typeof u === "string" ? u.replace(/[`]/g, "").trim() : u || "");
  const cover = Array.isArray(track.thumbnails)
    ? sanitize(track.thumbnails[0])
    : sanitize(track.thumbnailUrl || track.thumb || "");

  const togglePlay = () => {
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
  };

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

  useEffect(() => {
    setLocalPlayer(player);
    setRepeatLabel(player.repeatMode || "none");
    setShuffleActive(!!player.shuffle);
    setVolume(typeof player.volume === "number" ? player.volume : 1);
    const refId = (player.track?._id || player.track?.id || player.track?.slug || "").toString();
    const arr = JSON.parse(localStorage.getItem("likedIds") || "[]");
    setLiked(refId ? arr.includes(refId) : false);
  }, [player]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = sanitize(track.audioUrl || "");
    audio.volume = volume;
    if (track.audioUrl && isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [track.audioUrl, isPlaying, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const hTime = () => {
      setLocalPlayer((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };
    const hMeta = () => {
      setLocalPlayer((prev) => ({ ...prev, duration: audio.duration }));
    };
    audio.addEventListener("timeupdate", hTime);
    audio.addEventListener("loadedmetadata", hMeta);
    const hEnded = () => { onNext && onNext(); };
    audio.addEventListener("ended", hEnded);
    return () => {
      audio.removeEventListener("timeupdate", hTime);
      audio.removeEventListener("loadedmetadata", hMeta);
      audio.removeEventListener("ended", hEnded);
    };
  }, []);

  return (
    <div className="px-4 py-2">
      <audio ref={audioRef} />
      <div className="relative">
        <div
          className="absolute top-0 left-0 h-[2px] bg-primary-500"
          style={{ width: `${progressPercentage}%` }}
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
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
              onClick={onNext}
              className="p-2 text-gray-300 hover:text-white"
            >
              <FiSkipForward className="w-5 h-5" />
            </button>
            <span className="text-xs text-gray-400 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3 min-w-0 flex-1" onClick={() => {
            const idOrSlug = track.slug || track.id || track._id;
            if (!idOrSlug) return;
            const path = track.type === 'video' ? `/videos/details/${idOrSlug}` : `/songs/details/${idOrSlug}`;
            window.location.href = path;
          }}>
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
                  const a = audioRef.current; if (a) a.volume = v;
                  onSetVolume && onSetVolume(v);
                }}
                className="w-24"
              />
            </div>
            <button
              className={`p-2 rounded ${repeatLabel !== "none" ? "bg-white/10" : ""}`}
              title={`repeat: ${repeatLabel}`}
              onClick={() => { onCycleRepeat && onCycleRepeat(); }}
            >
              <FiRepeat className="w-5 h-5 text-gray-300" />
            </button>
            <button
              className={`p-2 rounded ${shuffleActive ? "bg-white/10" : ""}`}
              title={shuffleActive ? "Shuffle on" : "Shuffle off"}
              onClick={() => { onToggleShuffle && onToggleShuffle(); }}
            >
              <FiShuffle className="w-5 h-5 text-gray-300" />
            </button>
            <button
              className="p-2"
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  const evt = new CustomEvent("open-auth-modal", { detail: { mode: "login" } });
                  window.dispatchEvent(evt);
                  return;
                }
                const localToken = localStorage.getItem("localToken");
                if (!localToken) {
                  alert("Bạn chưa bật lưu Playlist local. Vào đăng ký và chọn opt-in để sử dụng.");
                  return;
                }
                const refId = sanitize(track._id || track.id || track.slug || track.title || track.name || "");
                const idToUse = refId || (sanitize(`${track.title || ''}-${track.artist || ''}`) || `song-${Date.now()}`);
                // mở modal chọn playlist
                window.dispatchEvent(new CustomEvent('open-playlist-picker', { detail: { refId: idToUse, type: 'song' } }))
              }}
            >
              <FiHeart className={`w-5 h-5 ${liked ? 'text-red-500' : 'text-gray-300'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
