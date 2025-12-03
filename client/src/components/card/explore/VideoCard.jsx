import React, { useState } from "react";
import { Play } from "lucide-react";

// format time
const formatViews = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M views";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K views";
  }
  return num + " views";
};

function VideoCard({ data, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const channelName = data.channelName || "Various Artists";

  const formattedViews = formatViews(data.views);

  return (
    <div
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        <img
          src={data.thumb}
          alt={data.name}
          className="w-full h-full object-cover"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100 bg-black/30" : "opacity-0"
          }`}
        >
          <button
            // logic phát video
            onClick={() => console.log(`Play video: ${data.videoId}`)}
            className="text-white opacity-90 hover:opacity-100 transition-opacity duration-150"
          >
            <Play className="w-16 h-16" fill="currentColor" />
          </button>
        </div>

        {data.duration && (
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
            {data.duration}
          </div>
        )}
      </div>

      <div className="pt-2">
        <h3 className="text-white text-base font-medium line-clamp-2 leading-tight">
          {data.name}
        </h3>

        <p className="text-neutral-400 text-sm mt-0.5 truncate">
          {channelName} &bull; {formattedViews}
        </p>
      </div>
    </div>
  );
}

export default VideoCard;
