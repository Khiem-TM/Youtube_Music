import React, { useState } from "react";

function Home3Card({ data }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center w-12 h-12 mr-4 flex-shrink-0 relative">
        {/* Thumbnail nhỏ */}
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          className="w-10 h-10 object-cover rounded-sm"
        />

        {isHovered && (
          <button className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-100 transition-opacity duration-150">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.06l2.12-2.12 1.41 1.41L12 14.88z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-white text-base truncate font-medium">
          {data.title}
        </div>
        <div
          className="text-gray-400 text-sm truncate"
          // Gạch chân nghệ sĩ khi hover
          style={{ textDecoration: isHovered ? "underline" : "none" }}
        >
          {data.artist} &bull; {data.duration}
        </div>
      </div>

      <div className="flex items-center ml-4 space-x-4">
        {isHovered ? (
          <>
            {/* Dislike */}
            <button className="text-gray-300 hover:text-white p-1">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            {/* Like */}
            <button className="text-gray-300 hover:text-white p-1">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10h-4m0 0V4m0 6h4m-4 0v6m4-6h-4m4 0h4m-4 0v6m4 0h-4m4 0v-6"
                />
              </svg>
            </button>

            <button className="text-gray-300 hover:text-white p-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 4a2 2 0 104 0 2 2 0 00-4 0z"></path>
              </svg>
            </button>
          </>
        ) : (
          <span className="text-white text-base flex-shrink-0">
            {data.duration}
          </span>
        )}
      </div>
    </div>
  );
}

export default Home3Card;
