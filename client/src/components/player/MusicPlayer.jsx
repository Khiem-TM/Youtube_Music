import { useEffect, useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiRepeat,
  FiShuffle,
  FiMoreVertical,
} from "react-icons/fi";

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
}) {
  const [localPlayer, setLocalPlayer] = useState(player);
  const audioRef = useRef(null);

  const isPlaying = localPlayer.isPlaying;
  const currentTime = localPlayer.currentTime;
  const duration = localPlayer.duration;
  const track = localPlayer.track || {};

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
  }, [player]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.audioUrl || "";
    if (track.audioUrl && isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [track.audioUrl, isPlaying]);

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
    return () => {
      audio.removeEventListener("timeupdate", hTime);
      audio.removeEventListener("loadedmetadata", hMeta);
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

          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={track.thumbnailUrl || "/placeholder-cover.jpg"}
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
            <FiVolume2 className="w-5 h-5 text-gray-300" />
            <FiRepeat className="w-5 h-5 text-gray-300" />
            <FiShuffle className="w-5 h-5 text-gray-300" />
            <FiMoreVertical className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
