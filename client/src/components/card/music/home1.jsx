import React, { useState } from "react";

function Home1Card({ data }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardClasses =
    "bg-gray-900 rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:bg-gray-800";

  // Hiệu ứng mờ khi hover
  const overlayClasses =
    "absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 transition-opacity duration-300";

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Dùng div cha này để xử lý sự kiện hover
    >
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg">
        {/* Ảnh bìa */}
        <img
          src={data.imageUrl}
          alt={data.title}
          className="w-full h-full object-cover"
        />

        <div
          // Dùng isHovered để kiểm soát opacity và hiển thị các nút
          className={`${overlayClasses} ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Nút play */}
          <button className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center hover:scale-105 transition-transform duration-150">
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

          {/* Menu */}
          <button className="absolute top-4 right-4 text-white p-1 rounded-full hover:bg-black/40 transition-colors duration-150">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 4a2 2 0 104 0 2 2 0 00-4 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* footer - information */}
      <h3 className="text-white text-lg font-bold truncate">{data.title}</h3>
      <p className="text-gray-400 text-sm truncate">
        {data.type} &bull; {data.artist}
      </p>
    </div>
  );
}

export default Home1Card;
