import { useEffect, useState, useRef } from "react";
import AlbumCard from "../../components/card/explore/AlbumCard";
import VideoCard from "../../components/card/explore/VideoCard";
import ReleaseHubCard from "../../components/card/explore/ReleaseHubCard";
import axios from "axios";
import {
  FiMusic,
  FiTrendingUp,
  FiSmile,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { div } from "framer-motion/client";
const BASE_URL = "https://youtube-music.f8team.dev/api";

function NewRealease() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // new release (single)
  const [latestRelease, setLatestRelease] = useState(null);

  // new albums
  const [albums, setAlbums] = useState([]);

  // new video - sử dụng form 2 (video)
  const [videos, setVideos] = useState([]);

  // loading scroll for album and video
  const videosRef = useRef(null);
  const albumsRef = useRef(null);
  const videosScrollTimer = useRef(null);
  const albumsScrollTimer = useRef(null);
  const [albumsScrolling, setAlbumsScrolling] = useState(false);
  const [videosScrolling, setVideosScrolling] = useState(false);

  // Hàm điều hướng chung
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  // API for release and more
  useEffect(() => {
    const fetchNewRelease = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/explore/new-releases`, {
          params: { limit: 1 },
        });
        const items = Array.isArray(res.data)
          ? res.data
          : res.data?.items || [];
        if (Array.isArray(items) && items.length > 0) {
          const r = items[0];
          setLatestRelease({
            id: r.id || r._id,
            slug: r.slug || r.id,
            imageUrl: r.thumb || r.thumbnailUrl,
            title: r.name || r.title,
            artistName: r.artist || "Various Artists",
          });
        } else {
          setLatestRelease(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVideoAndAlbum = async () => {
      try {
        const [aRes, vRes] = await Promise.all([
          axios.get(`${BASE_URL}/explore/albums`, {
            params: {
              limit: 10,
            },
          }),
          axios.get(`${BASE_URL}/explore/videos`, {
            params: {
              limit: 15,
            },
          }),
        ]);
        const albums = Array.isArray(aRes.data)
          ? aRes.data
          : aRes.data?.items || [];
        const videos = Array.isArray(vRes.data)
          ? vRes.data
          : vRes.data?.items || [];

        setAlbums(albums);
        setVideos(videos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNewRelease();
    fetchVideoAndAlbum();
  }, []);

  //   return page

  return (
    <div className="px-4 pt-4 space-y-8">
      {/* released */}
      {latestRelease && (
        <section>
          <h2 className="text-3xl font-bold text-white mb-4">Released</h2>
          <ReleaseHubCard data={latestRelease} />
        </section>
      )}

      {/* new albúms */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-white">Albums mới</h2>
        <div className="flex items-center gap-2">
          {/* left */}
          <button
            className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
            onClick={() =>
              albumsRef.current?.scrollBy({
                left: -600,
                behavior: "smooth",
              })
            }
          >
            <FiChevronLeft />
          </button>
          {/* right */}
          <button
            className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
            onClick={() =>
              albumsRef.current?.scrollBy({ left: 600, behavior: "smooth" })
            }
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* list */}
      <div
        ref={albumsRef}
        onScroll={() => {
          setAlbumsScrolling(true);
          if (albumsScrollTimer.current)
            clearTimeout(albumsScrollTimer.current);
          albumsScrollTimer.current = setTimeout(
            () => setAlbumsScrolling(false),
            800
          );
        }}
        className={`flex gap-4 overflow-x-auto custom-scrollbar ${
          albumsScrolling ? "" : "no-scrollbar"
        } pb-2`}
      >
        {/* item from list */}
        {albums.map((item) => (
          <div
            key={item._id || item.id || item.slug}
            className="min-w-[250px] flex-shrink-0"
          >
            <AlbumCard data={item} />
          </div>
        ))}
      </div>

      {/* New music videos */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-white">Video ca nhạc mới</h2>
        <div className="flex items-center gap-2">
          {/* left */}
          <button
            className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
            onClick={() =>
              videosRef.current?.scrollBy({
                left: -600,
                behavior: "smooth",
              })
            }
          >
            <FiChevronLeft />
          </button>
          {/* right */}
          <button
            className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
            onClick={() =>
              videosRef.current?.scrollBy({ left: 600, behavior: "smooth" })
            }
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* list */}
      <div
        ref={videosRef}
        onScroll={() => {
          setVideosScrolling(true);
          if (videosScrollTimer.current)
            clearTimeout(videosScrollTimer.current);
          videosScrollTimer.current = setTimeout(
            () => setVideosScrolling(false),
            800
          );
        }}
        className={`flex gap-4 overflow-x-auto custom-scrollbar ${
          videosScrolling ? "" : "no-scrollbar"
        } pb-2`}
      >
        {/* item from list */}
        {videos.map((item) => (
          <div
            key={item._id || item.id || item.slug}
            className="min-w-[250px] flex-shrink-0"
          >
            <VideoCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewRealease;
