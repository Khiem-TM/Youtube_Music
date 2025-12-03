import { useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";

// chuyển định dạng time
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function MusicPlayerForm({ currentTrack, onSelectTrack }) {
  const [activeTab, setActiveTab] = useState("RELATED");
  const { actions } = usePlayer();
  const thumb = Array.isArray(currentTrack?.thumbnails)
    ? currentTrack.thumbnails[0]
    : currentTrack?.thumbnailUrl || "";
  const albumTracks = Array.isArray(currentTrack?.album?.tracks)
    ? currentTrack.album.tracks
    : [];
  const playlists = Array.isArray(currentTrack?.playlists)
    ? currentTrack.playlists
    : [];
  const songName = currentTrack.title;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* thumbnail for music */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="w-full max-w-[800px] aspect-square">
              <img
                src={thumb}
                alt={currentTrack?.title || ""}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
              <h2 className="text-2xl font-semibold text-center mt-4 tracking-wide">
                {songName}
              </h2>
            </div>
          </div>

          {/* table for information */}
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex gap-16 border-b border-gray-800 mb-6">
              {["UP NEXT", "LYRICS", "RELATED"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium tracking-wider transition-colors relative ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pr-4 max-h-[700px] custom-scrollbar">
              {activeTab === "UP NEXT" && (
                <div className="space-y-1">
                  {albumTracks.length === 0 && (
                    <div className="text-gray-400 text-center py-12">Không có bài trong album</div>
                  )}
                  {albumTracks.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => {
                        actions.playTrack({
                          ...track,
                          type: "song",
                          title: track.title,
                          audioUrl: track.audioUrl,
                          thumbnails: track.thumbnails,
                          artist: track.artist,
                        }, albumTracks);
                        onSelectTrack && onSelectTrack(track);
                      }}
                      className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 flex-shrink-0">
                        <img
                          src={(Array.isArray(track.thumbnails) ? track.thumbnails[0] : track.thumbnailUrl || "")}
                          alt={track.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{track.title}</div>
                        {track.artist && (
                          <div className="text-gray-400 text-sm truncate">{track.artist}</div>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm flex-shrink-0">{formatDuration(track.duration || 0)}</div>
                      <a
                        href={`/songs/details/${track.id || ''}`}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-2 hidden group-hover:block px-3 py-1 text-xs rounded bg-white/10 hover:bg-white/20"
                      >
                        Detail
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "RELATED" && (
                <div className="space-y-6">
                  {playlists.length === 0 && (
                    <div className="text-gray-400 text-center py-12">Không có danh sách phát liên quan</div>
                  )}
                  {playlists.map((pl, idx) => (
                    <div key={pl.id || pl.slug || idx}>
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={(Array.isArray(pl.thumbnails) ? pl.thumbnails[0] : pl.thumbnailUrl || "")}
                          alt={pl.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="text-white font-semibold truncate">{pl.title}</div>
                      </div>
                      <div className="space-y-1">
                        {(Array.isArray(pl.tracks) ? pl.tracks : []).map((track) => (
                          <div
                            key={track.id}
                            onClick={() => {
                              actions.playTrack({
                                ...track,
                                type: "song",
                                title: track.title,
                                audioUrl: track.audioUrl,
                                thumbnails: track.thumbnails,
                              }, pl.tracks);
                              onSelectTrack && onSelectTrack(track);
                            }}
                            className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <div className="w-12 h-12 flex-shrink-0">
                              <img
                                src={(Array.isArray(track.thumbnails) ? track.thumbnails[0] : track.thumbnailUrl || "")}
                                alt={track.title}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{track.title}</div>
                              {track.artist && (
                                <div className="text-gray-400 text-sm truncate">{track.artist}</div>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm flex-shrink-0">{formatDuration(track.duration || 0)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* UP NEXT tab */}
              {activeTab === "LYRICS" && (
                <div className="text-gray-400 text-center py-12">Lyrics not available</div>
              )}

              {/* Không có trong server */}
              {activeTab === "UP NEXT" && null}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
