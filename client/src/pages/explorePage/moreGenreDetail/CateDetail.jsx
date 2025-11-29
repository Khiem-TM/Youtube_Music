import React, { useEffect, useState, useRef } from "react";
import Home1Card from "../../../components/card/music/home1";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useParams } from "react-router-dom";

const BASE_URL = "https://youtube-music.f8team.dev/api";

function CateDetail() {
  const { slug } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [scrolling, setScrolling] = useState({});
  const listRefs = useRef([]);
  const timers = useRef([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/categories/${slug}`);
        setDetail(res.data);
      } catch (e) {
        setError("Không thể tải chi tiết");
      }
    };
    fetchDetail();
  }, [slug]);

  const handleScroll = (idx) => {
    setScrolling((s) => ({ ...s, [idx]: true }));
    if (timers.current[idx]) clearTimeout(timers.current[idx]);
    timers.current[idx] = setTimeout(() => {
      setScrolling((s) => ({ ...s, [idx]: false }));
    }, 800);
  };

  return (
    <div className="px-6 py-6">
      {detail && (
        <div className="mb-6">
          <img
            src={detail.thumbnailUrl}
            alt={detail.name}
            className="w-full max-w-[800px] h-[270px] object-cover rounded-lg"
          />
          <h1 className="text-3xl font-bold text-white mt-4">{detail.name}</h1>
          <p className="text-gray-400 mt-1">{detail.description}</p>
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {Array.isArray(detail?.subcategories) &&
        detail.subcategories.map((sub, idx) => (
          <div key={sub._id || sub.slug || idx} className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-white">{sub.name}</h2>
              <div className="flex items-center gap-2">
                <button
                  className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
                  onClick={() =>
                    listRefs.current[idx]?.scrollBy({
                      left: -600,
                      behavior: "smooth",
                    })
                  }
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
                  onClick={() =>
                    listRefs.current[idx]?.scrollBy({
                      left: 600,
                      behavior: "smooth",
                    })
                  }
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
            <div
              ref={(el) => (listRefs.current[idx] = el)}
              onScroll={() => handleScroll(idx)}
              className={`flex gap-4 overflow-x-auto custom-scrollbar ${
                scrolling[idx] ? "" : "no-scrollbar"
              } pb-2`}
            >
              {(sub.playlists || []).map((item, pIdx) => (
                <div
                  key={item._id || item.id || item.slug || pIdx}
                  className="min-w-[280px]"
                >
                  <Home1Card
                    data={{
                      title: item.title || item.name,
                      thumbnails: Array.isArray(item.thumbnails)
                        ? item.thumbnails[0]
                        : item.thumbnailUrl || item.thumb,
                      artists: Array.isArray(item.artists)
                        ? item.artists.join(", ")
                        : item.artist || "",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default CateDetail;

