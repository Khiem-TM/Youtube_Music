// Đây là item cho các playlist của dạng danh sách theo hàng dọc
import React from "react";
import {
  FiPlay,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
  FiMoreVertical,
} from "react-icons/fi";
import { Link } from "react-router-dom";

// Lấy data từ input
const ItemMusicCard = ({ song }) => {
  const { _id, videoId, title, artists, thumb, rank, previousRank } = song;
  // handle ranking
  const calculateTrend = () => {
    if (previousRank === null) {
      return "new";
    }
    if (rank < previousRank) {
      return "up";
    }
    if (rank > previousRank) {
      return "down";
    }
    return "neutral"; // const thứ hạng
  };

  const trend = calculateTrend();

  //   handle artist
  const artistString = Array.isArray(artists)
    ? artists.join(", ")
    : "Unknown Artist";

  // handle Trending Icon
  const TrendIcon = () => {
    switch (trend) {
      case "up":
        return <FiArrowUp size={10} className="text-green-500" />;
      case "down":
        return <FiArrowDown size={10} className="text-red-500" />;
      case "new":
        return (
          <span className="text-yellow-500 text-[10px] font-bold">NEW</span>
        );
      case "neutral":
      default:
        return <FiMinus size={10} className="text-gray-500" />;
    }
  };

  return (
    // Link dẫn đến page cụ thể --> update sau
    <Link
      to={`/song/${videoId || _id}`}
      className="group flex items-center p-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
    >
      {/* thumbnail */}
      <div className="flex items-center w-16 md:w-20 flex-shrink-0 relative">
        <img
          src={thumb}
          alt={title}
          className="w-12 h-8 object-cover rounded md:w-16 md:h-10 opacity-80 group-hover:opacity-100 transition"
        />
        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded">
          <FiPlay className="text-white w-4 h-4" fill="white" />
        </div>
      </div>

      {/* ranking */}
      <div className="w-12 flex flex-col items-center justify-center mx-2 space-y-1">
        <span className="font-bold text-gray-200 text-sm">{rank}</span>
        <div className="flex items-center text-xs">
          <TrendIcon />
        </div>
      </div>

      {/* infor */}
      <div className="flex-grow min-w-0 pr-4">
        <h3 className="text-white font-medium text-base truncate group-hover:text-white">
          {title}
        </h3>
        <p className="text-gray-400 text-sm truncate group-hover:text-gray-300">
          {artistString}
        </p>
      </div>

      {/* duration */}
      <div className="text-gray-400 text-sm font-variant-numeric tabular-nums">
        {song.duration || "--:--"}
      </div>

      {/* menu btn */}
      <div className="w-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <FiMoreVertical className="text-gray-300" />
      </div>
    </Link>
  );
};

export default ItemMusicCard;
