import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiMusic, FiVideo, FiList, FiImage, FiChevronRight } from "react-icons/fi";

const BASE_URL = "https://youtube-music.f8team.dev/api";

function LineDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [dRes, sRes, pRes, aRes, vRes] = await Promise.all([
          axios.get(`${BASE_URL}/lines/${slug}`),
          axios.get(`${BASE_URL}/lines/${slug}/songs`, {
            params: { limit: 24, sort: "-popularity" },
          }),
          axios.get(`${BASE_URL}/lines/${slug}/playlists`, {
            params: { limit: 24, sort: "-popularity" },
          }),
          axios.get(`${BASE_URL}/lines/${slug}/albums`, {
            params: { limit: 24, sort: "-releaseDate" },
          }),
          axios.get(`${BASE_URL}/lines/${slug}/videos`, {
            params: { limit: 24, sort: "-createdAt" },
          }),
        ]);
        setDetail(dRes.data);
        setSongs(Array.isArray(sRes.data?.items) ? sRes.data.items : []);
        setPlaylists(Array.isArray(pRes.data?.items) ? pRes.data.items : []);
        setAlbums(Array.isArray(aRes.data?.items) ? aRes.data.items : []);
        setVideos(Array.isArray(vRes.data?.items) ? vRes.data.items : []);
      } catch (e) {
        setError("Không thể tải chi tiết");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [slug]);

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
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}
      <section className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Playlists nổi bật</h2>
          <Link to={`/explore/moreGenre/line/${slug}`} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">Xem thêm <FiChevronRight /></Link>
        </div>
        {playlists.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 text-gray-300">
            <FiList className="w-5 h-5" />
            <div>
              <div className="text-sm">Không có playlist nào</div>
              <div className="text-xs opacity-80">Khám phá thêm các danh sách phát phù hợp</div>
            </div>
            <Link to="/explore/moreGenre" className="ml-auto px-3 py-1 rounded bg-white/10 text-white text-xs">Khám phá thêm</Link>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {playlists.map((item, idx) => {
              const thumb = Array.isArray(item.thumbnails) ? item.thumbnails[0] : item.thumbnailUrl || item.thumb;
              const title = item.title || item.name;
              const idOrSlug = item.slug || item.id || item._id;
              return (
                <button key={idOrSlug || idx} onClick={() => idOrSlug && navigate(`/playlists/details/${idOrSlug}`)} className="group rounded-xl bg-[#212121] border border-gray-700 hover:bg-[#2b2b2b] transition-colors overflow-hidden text-left">
                  <div className="w-full" style={{ aspectRatio: '16/9' }}>
                    <img src={thumb || ''} alt={title} className="w-full h-full object-contain bg-black" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-white truncate">{title}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
        {albums.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 text-gray-300">
            <FiImage className="w-5 h-5" />
            <div>
              <div className="text-sm">Không có album nào</div>
              <div className="text-xs opacity-80">Thử khám phá các album theo thể loại khác</div>
            </div>
            <Link to="/explore/moreGenre" className="ml-auto px-3 py-1 rounded bg-white/10 text-white text-xs">Khám phá thêm</Link>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {albums.map((item, idx) => {
              const thumb = Array.isArray(item.thumbnails) ? item.thumbnails[0] : item.thumbnailUrl || item.thumb;
              const title = item.title || item.name;
              const idOrSlug = item.slug || item.id || item._id;
              return (
                <button key={idOrSlug || idx} onClick={() => idOrSlug && navigate(`/albums/details/${idOrSlug}`)} className="group rounded-xl bg-[#212121] border border-gray-700 hover:bg-[#2b2b2b] transition-colors overflow-hidden text-left">
                  <div className="w-full" style={{ aspectRatio: '1/1' }}>
                    <img src={thumb || ''} alt={title} className="w-full h-full object-contain bg-black" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-white truncate">{title}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
        {songs.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 text-gray-300">
            <FiMusic className="w-5 h-5" />
            <div>
              <div className="text-sm">Không có bài hát nào</div>
              <div className="text-xs opacity-80">Thử tìm các bài hát theo tâm trạng khác</div>
            </div>
            <Link to="/explore/moreGenre" className="ml-auto px-3 py-1 rounded bg-white/10 text-white text-xs">Khám phá thêm</Link>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {songs.map((item, idx) => {
              const thumb = item.thumb || item.thumbnailUrl;
              const title = item.name || item.title;
              const idOrSlug = item.slug || item.id || item._id;
              return (
                <button key={idOrSlug || idx} onClick={() => idOrSlug && navigate(`/songs/details/${idOrSlug}`)} className="group rounded-xl bg-[#212121] border border-gray-700 hover:bg-[#2b2b2b] transition-colors overflow-hidden text-left">
                  <div className="w-full" style={{ aspectRatio: '16/9' }}>
                    <img src={thumb || ''} alt={title} className="w-full h-full object-contain bg-black" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-white truncate">{title}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Videos</h2>
        {videos.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 text-gray-300">
            <FiVideo className="w-5 h-5" />
            <div>
              <div className="text-sm">Không có video nào</div>
              <div className="text-xs opacity-80">Khám phá thêm các video ca nhạc mới</div>
            </div>
            <Link to="/explore/moreGenre" className="ml-auto px-3 py-1 rounded bg-white/10 text-white text-xs">Khám phá thêm</Link>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {videos.map((item, idx) => {
              const thumb = Array.isArray(item.thumbnails) ? item.thumbnails[0] : item.thumbnailUrl || item.thumb;
              const title = item.title || item.name;
              const idOrSlug = item.slug || item.id || item._id;
              return (
                <button key={idOrSlug || idx} onClick={() => idOrSlug && navigate(`/videos/details/${idOrSlug}`)} className="group rounded-xl bg-[#212121] border border-gray-700 hover:bg-[#2b2b2b] transition-colors overflow-hidden text-left">
                  <div className="w-full" style={{ aspectRatio: '16/9' }}>
                    <img src={thumb || ''} alt={title} className="w-full h-full object-contain bg-black" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-white truncate">{title}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

    </div>
  );
}

export default LineDetail;
