import React, { useState } from "react";
import { Menu, Play } from "lucide-react";

function Home1Card({ data }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardClasses =
    "bg-gray-900 rounded-lg cursor-pointer transition-all duration-300 transform hover:bg-gray-800";

  const overlayClasses =
    "absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 transition-opacity duration-300";

  // logic for menu
  const handleMenuClick = (e) => {
    e.stopPropagation();
    alert(`Mở tùy chọn cho: ${data.title}`);
  };

  // logic 4 play
  const handlePlayClick = (e) => {
    e.stopPropagation();
    alert(`Phát: ${data.title}`);
  };

  const thumbnailUrl = Array.isArray(data.thumbnails)
    ? data.thumbnails[0]
    : data.thumbnails;
  const artistsText = Array.isArray(data.artists)
    ? data.artists.join(", ")
    : data.artists;

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-lg">
        <img
          src={thumbnailUrl}
          alt={data.title}
          className="w-full h-full object-cover"
        />

        <div
          className={`${overlayClasses} ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center hover:scale-110 transition-transform duration-150"
          >
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          </button>
        </div>

        <button
          onClick={handleMenuClick}
          className={`absolute top-3 right-3  text-white  hover:text-black/60 transition-opacity duration-300 z-10 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        {" "}
        <h3 className="text-xl text-white font-semibold line-clamp-2 leading-snug">
          {" "}
          {data.title}
        </h3>
        <p className="text-base text-neutral-400 mt-1 truncate">
          {" "}
          {artistsText}
        </p>
        {data.views && (
          <p className="text-sm text-neutral-500 mt-0.5"> {data.views} views</p>
        )}
      </div>
    </div>
  );
}

export default Home1Card;
