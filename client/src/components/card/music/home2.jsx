import React, { useState } from "react";

function Home2Card({ data }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardClasses =
    "bg-gray-900 rounded-lg p-3 cursor-pointer transition-all duration-300 transform hover:bg-gray-800 w-64";

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-lg">
        {/* Ảnh bìa */}
        <img
          src={data.imageUrl}
          alt={data.title}
          className="w-full h-full object-cover"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300`}
        >
          <button
            className={`w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center transition-opacity duration-300 
                         ${isHovered ? "opacity-100" : "opacity-80"}`}
            style={{
              filter: isHovered
                ? "none"
                : "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
            }}
          >
            {/* Icon Play */}
            <svg
              className="w-6 h-6 ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          <button
            className={`absolute top-2 right-2 text-white p-1 rounded-full hover:bg-black/40 transition-opacity duration-300 
                         ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 4a2 2 0 104 0 2 2 0 00-4 0z"></path>
            </svg>
          </button>

          <div
            className={`absolute top-2 left-2 px-2 py-1 bg-black/80 text-white text-xs rounded-md max-w-[90%] transition-opacity duration-300 
                         ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            {data.title.length > 50
              ? data.title.substring(0, 50) + "..."
              : data.title}
          </div>
        </div>
      </div>

      <h3 className="text-white text-base font-medium line-clamp-2 leading-snug">
        {data.title}
      </h3>
      <p className="text-gray-400 text-sm mt-1 truncate">
        {data.creator} &bull; {data.views} views
      </p>
    </div>
  );
}

export default Home2Card;
