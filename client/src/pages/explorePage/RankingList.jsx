import React from "react";
import {
  FiPlay,
  FiMoreVertical,
  FiBookmark,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
} from "react-icons/fi";

const generateSongs = () => {
  return Array.from({ length: 100 }, (_, i) => {
    const trend = Math.random();
    let trendIcon = "neutral";
    if (trend > 0.6) trendIcon = "up";
    else if (trend > 0.3) trendIcon = "down";

    return {
      id: i + 1,
      rank: i + 1,
      title: i === 0 ? "Golden" : i === 1 ? "Soda Pop" : `Song Title #${i + 1}`,
      artist: i === 0 ? "HUNTR/X, EJAE..." : `Artist Name ${i + 1}`,
      thumbnail: `https://picsum.photos/seed/${i + 1}/100/100`,
      duration: "3:45",
      trend: trendIcon,
      views: Math.floor(Math.random() * 5000000) + " views",
    };
  });
};

const songs = generateSongs();

function RankingList() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a3b3b] via-[#121212] to-black text-white font-sans">
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="sticky top-24 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="relative group shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-lg">
              <img
                src="https://music.youtube.com/img/chart_daily_top_100.png"
                alt="Daily Top 100"
                className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-lg"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/300x300/222/FFF?text=Top+100")
                }
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Daily Top Music Videos - Global
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300 font-medium">
                <span className="text-red-500 font-bold">YouTube Music</span>
                <span>•</span>
                <span>Chart</span>
                <span>•</span>
                <span>2025</span>
              </div>

              <div className="text-sm text-gray-400">
                100 songs • 5 hours, 34 minutes
                <br />
                Today's ranking of the most popular music videos on YouTube.
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Nút Save */}
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <FiBookmark className="w-5 h-5" />
              </button>

              {/* Nút Play  */}
              <button className="w-16 h-16 rounded-full bg-white text-black hover:scale-105 transition flex items-center justify-center shadow-lg">
                <FiPlay className="w-8 h-8 ml-1" fill="currentColor" />
              </button>

              {/* Nút Menu */}
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="flex flex-col space-y-1">
            {songs.map((song) => (
              <div
                key={song.id}
                className="group flex items-center p-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                {/* Thumbnail + Rank */}
                <div className="flex items-center w-16 md:w-20 flex-shrink-0 relative">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-12 h-8 object-cover rounded md:w-16 md:h-10 opacity-80 group-hover:opacity-100 transition"
                  />
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                    <FiPlay className="text-white w-4 h-4" fill="white" />
                  </div>
                </div>

                {/* ranking */}
                <div className="w-12 flex flex-col items-center justify-center mx-2 space-y-1">
                  <span className="font-bold text-gray-200 text-sm">
                    {song.rank}
                  </span>
                  {/* icon xu hướng */}
                  {song.trend === "up" && (
                    <div className="flex items-center text-green-500 text-xs">
                      <FiArrowUp size={10} />
                    </div>
                  )}
                  {song.trend === "down" && (
                    <div className="flex items-center text-red-500 text-xs">
                      <FiArrowDown size={10} />
                    </div>
                  )}
                  {song.trend === "neutral" && (
                    <div className="flex items-center text-gray-500 text-xs">
                      <FiMinus size={10} />
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0 pr-4">
                  <h3 className="text-white font-medium text-base truncate group-hover:text-white">
                    {song.title}
                  </h3>
                  <p className="text-gray-400 text-sm truncate group-hover:text-gray-300">
                    {song.artist}
                  </p>
                </div>

                <div className="text-gray-400 text-sm font-variant-numeric tabular-nums">
                  {song.duration}
                </div>

                <div className="w-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiMoreVertical className="text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingList;
