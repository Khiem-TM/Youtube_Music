import { useState } from "react";

// chuyển định dạng time
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function MusicPlayerForm({ currentTrack }) {
  const [activeTab, setActiveTab] = useState("RELATED");
  const thumb = Array.isArray(currentTrack?.thumbnails)
    ? currentTrack.thumbnails[0]
    : currentTrack?.thumbnailUrl || "";
  const related = Array.isArray(currentTrack?.album?.tracks)
    ? currentTrack.album.tracks
    : [];

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
              {activeTab === "RELATED" && (
                <div className="space-y-1">
                  {related.length === 0 && (
                    <div className="text-gray-400 text-center py-12">Không có bài hát liên quan</div>
                  )}
                  {related.map((track) => (
                    <div
                      key={track.id}
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
                        <div className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                          {track.title}
                        </div>
                        {track.artist && (
                          <div className="text-gray-400 text-sm truncate">
                            {track.artist}
                          </div>
                        )}
                      </div>

                      <div className="text-gray-400 text-sm flex-shrink-0">
                        {formatDuration(track.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* UP NEXT tab */}
              {activeTab === "UP NEXT" && (
                <div className="text-gray-400 text-center py-12">
                  No upcoming tracks
                </div>
              )}

              {/* Không có trong server */}
              {activeTab === "LYRICS" && (
                <div className="text-gray-400 text-center py-12">
                  Lyrics not available
                </div>
              )}
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
