import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight, FiList } from "react-icons/fi";
import { useParams, useNavigate, Link } from "react-router-dom";

const BASE_URL = "https://youtube-music.f8team.dev/api";

function CateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrolling, setScrolling] = useState({});
  const listRefs = useRef([]);
  const timers = useRef([]);
  const [navLoading, setNavLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/categories/${slug}`);
        setDetail(res.data);
      } catch (e) {
        setError("Không thể tải chi tiết");
      } finally { setLoading(false) }
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
          <div className="w-full max-w-[1000px] mx-auto">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <img
                src={detail.thumbnailUrl}
                alt={detail.name}
                className="absolute inset-0 w-full h-full object-contain rounded-lg bg-black"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">{detail.name}</h1>
          <p className="text-gray-400 mt-1">{detail.description}</p>
          {(loading || navLoading) && <div className="text-xs text-gray-400 mt-2">Đang tải…</div>}
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {Array.isArray(detail?.subcategories) && detail.subcategories.length === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 text-gray-300">
          <FiList className="w-5 h-5" />
          <div>
            <div className="text-sm">Không có dữ liệu</div>
            <div className="text-xs opacity-80">Thử khám phá danh mục khác</div>
          </div>
          <Link to="/explore/moreGenre" className="ml-auto px-3 py-1 rounded bg-white/10 text-white text-xs">Khám phá thêm</Link>
        </div>
      )}

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
              {Array.isArray(sub.playlists) && sub.playlists.length > 0 ? (
                sub.playlists.map((item, pIdx) => {
                  const thumb = Array.isArray(item.thumbnails) ? item.thumbnails[0] : item.thumbnailUrl || item.thumb;
                  const title = item.title || item.name;
                  const idOrSlug = item.slug || item.id || item._id;
                  return (
                    <button key={idOrSlug || pIdx} onClick={() => {
                      if (!idOrSlug) return;
                      setNavLoading(true);
                      navigate(`/playlists/details/${idOrSlug}`);
                      setTimeout(() => setNavLoading(false), 600);
                    }} className="group min-w-[280px] rounded-xl bg-[#212121] border border-gray-700 hover:bg-[#2b2b2b] transition-colors overflow-hidden text-left">
                      <div className="w-full" style={{ aspectRatio: '16/9' }}>
                        <img src={thumb || ''} alt={title} className="w-full h-full object-contain bg-black" />
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-semibold text-white truncate">{title}</div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 text-gray-300">
                  <FiList className="w-5 h-5" />
                  <div>
                    <div className="text-sm">Không có dữ liệu</div>
                    <div className="text-xs opacity-80">Danh mục này hiện chưa có nội dung</div>
                  </div>
                  <Link to="/explore/moreGenre" className="ml-auto px-3 py-1 rounded bg-white/10 text-white text-xs">Khám phá thêm</Link>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default CateDetail;
