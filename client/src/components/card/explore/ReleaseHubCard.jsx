import React from "react";
import { Link } from "react-router-dom";

const ReleaseHubCard = ({ data }) => {
  const imageUrl = data.imageUrl;

  const title = data?.title || "RELEASED";
  const sub = data?.sub || "Various Artists";
  const linkPath = `/release/${data?.slug || data?.id || "unknown"}`;

  return (
    <Link
      to={linkPath}
      className="block w-[230px] rounded-lg overflow-hidden bg-black text-white 
                 shadow-lg hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="relative flex w-full h-[140px] bg-[#1a1a1a]">
        <div className="relative w-[75%] h-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />

          <div
            className="absolute top-2 left-2 w-6 h-6 rounded-full border border-white 
                          flex items-center justify-center bg-black/40"
          >
            <span className="text-white text-[10px]">▶</span>
          </div>

          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-xs font-medium px-2 py-1 bg-black/40 rounded">
              {sub}
            </p>
          </div>
        </div>

        <div className="w-[25%] flex items-center justify-center bg-white">
          <p
            className="text-black font-bold tracking-widest text-[14px]"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            RELEASED
          </p>
        </div>
      </div>

      <div className="px-2 py-3">
        <p className="text-base font-semibold truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{sub}</p>
      </div>
    </Link>
  );
};

export default ReleaseHubCard;
