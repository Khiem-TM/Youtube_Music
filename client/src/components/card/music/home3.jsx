import React, { useState } from "react";

function Home3Card({ data }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center w-[80px] h-[50px] mr-4 flex-shrink-0 relative">
        <img
          src={data.thumbnails}
          alt={data.title}
          className="w-full h-full object-cover rounded-sm"
        />

        {isHovered && (
          <button className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-100 transition-opacity duration-150">
            {/* play */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-white text-base truncate font-medium">
          {data.title}
        </div>

        <div className="text-gray-400 text-sm truncate">{data.artists}</div>
      </div>
    </div>
  );
}

export default Home3Card;
