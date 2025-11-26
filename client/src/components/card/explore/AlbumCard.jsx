import React from "react";

function AlbumCard({ data }) {
  const artistName = data.artist || "Nhiều Nghệ Sĩ";
  const isExplicit = data.explicit;
  const isSingle = data.albumType === "Single";

  return (
    <div className="w-[250px] flex-shrink-0 cursor-pointer group">
      <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow-xl">
        <img
          src={data.thumb}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {isExplicit && (
          <div className="absolute top-2 right-2 text-white bg-black/50 px-1 py-0.5 rounded text-xs font-bold">
            E
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-white text-base font-semibold truncate">
          {data.name}
        </div>

        <div className="text-gray-400 text-sm truncate">
          {data.albumType} • {artistName}
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;
