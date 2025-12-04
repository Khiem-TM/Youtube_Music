import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";
import { FiPlay, FiPause } from "react-icons/fi";

const BASE_URL = "https://youtube-music.f8team.dev/api";

export default function VideoDetails() {
  const { id } = useParams();
  const { actions, state } = usePlayer();

  const [data, setData] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState("");

  const loadVideoDetails = useCallback(async (videoId) => {
    try {
      const res = await axios.get(`${BASE_URL}/videos/details/${videoId}`, {
        params: { limit: 20 },
      });

      const d = res.data || {};
      setData(d);

      const items = Array.isArray(d.items) ? d.items : [];

      if (items.length) setRelated(items);
      else {
        const backup = await axios.get(`${BASE_URL}/explore/videos`, {
          params: { limit: 15 },
        });
        const v = Array.isArray(backup.data)
          ? backup.data
          : backup.data?.items || [];
        setRelated(v);
      }
      return d;
    } catch (e) {
      console.error(e);
      setError("Không thể tải video");
      return null;
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const frame = requestAnimationFrame(() => {
      loadVideoDetails(id);
    });
    return () => cancelAnimationFrame(frame);
  }, [id, loadVideoDetails]);

  const normalizeId = (info) =>
    (info?._id || info?.id || info?.videoId || info?.slug || "").toString();

  const toTrackPayload = (info) => ({
    ...info,
    type: "video",
    title: info.title || info.name,
    thumbnails: Array.isArray(info.thumbnails)
      ? info.thumbnails
      : [info.thumbnailUrl || info.thumb].filter(Boolean),
    artists: Array.isArray(info.artists)
      ? info.artists
      : [info.artist].filter(Boolean),
    audioUrl: info.audioUrl,
    videoId: info.videoId || info.id,
  });

  const playVideo = (info) => {
    actions.playTrack(toTrackPayload(info));
  };

  const handleSelectVideo = async (v) => {
    const vid = v.id || v._id || v.videoId || v.slug;
    if (!vid) return;

    const detail = await loadVideoDetails(vid);
    playVideo(detail || v);
  };

  const currentTrackId = useMemo(
    () =>
      (
        state.track?._id ||
        state.track?.id ||
        state.track?.videoId ||
        state.track?.slug ||
        ""
      ).toString(),
    [state.track]
  );

  const currentVideoId = normalizeId(data);
  const isCurrentVideo = currentVideoId && currentVideoId === currentTrackId;
  const isPlaying = isCurrentVideo && state.isPlaying;

  const handleToggleCurrentVideo = () => {
    if (!data) return;
    if (!isCurrentVideo) {
      playVideo(data);
      return;
    }
    actions.togglePlay();
  };

  const cover =
    (Array.isArray(data?.thumbnails)
      ? data.thumbnails[0]
      : data?.thumbnailUrl || data?.thumb) || "";

  return (
    <div className="px-6 py-6">
      {error && <div className="text-red-400">{error}</div>}

      {data && (
        <div className="max-w-[1400px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div className="relative">
            <div className="sticky top-4">
              <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/10 shadow-lg shadow-black/20">
                {data.videoId ? (
                  <iframe
                    className="w-full h-full rounded-xl"
                    src={`https://www.youtube.com/embed/${data.videoId}`}
                    title={data.title || data.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={cover}
                    alt={data.title || data.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* <div className="absolute top-3 right-3 flex items-center gap-2">
                  {isCurrentVideo && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isPlaying
                          ? "bg-primary-500 text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {isPlaying ? "Đang phát" : "Tạm dừng"}
                    </span>
                  )}
                  <button
                    aria-label={
                      isPlaying
                        ? "Tạm dừng trong Music Player"
                        : "Phát trong Music Player"
                    }
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 text-white text-xs hover:bg-black/80 transition-colors"
                    onClick={handleToggleCurrentVideo}
                  >
                    {isPlaying ? (
                      <FiPause className="w-4 h-4" />
                    ) : (
                      <FiPlay className="w-4 h-4" />
                    )}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>
                </div> */}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-white mt-4">
                {data.title || data.name}
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                {Array.isArray(data.artists)
                  ? data.artists.join(", ")
                  : data.artist || ""}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col overflow-y-auto pr-2"
            style={{ maxHeight: "calc(100vh - 40px)" }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Related Videos
            </h2>

            <div className="space-y-3 pb-10">
              {related.map((v, idx) => (
                <div
                  key={v._id || v.id || idx}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-150"
                  onClick={() => handleSelectVideo(v)}
                >
                  <img
                    src={
                      (Array.isArray(v.thumbnails)
                        ? v.thumbnails[0]
                        : v.thumbnailUrl || v.thumb) || ""
                    }
                    alt={v.title || v.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {v.title || v.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">
                      {Array.isArray(v.artists)
                        ? v.artists.join(", ")
                        : v.artist || ""}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {v.duration
                      ? `${Math.floor(v.duration / 60)}:${String(
                          v.duration % 60
                        ).padStart(2, "0")}`
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
