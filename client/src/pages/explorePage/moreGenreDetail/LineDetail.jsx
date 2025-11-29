import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Home1Card from "../../../components/card/music/home1";
import Home3Card from "../../../components/card/music/home3";

const BASE_URL = "https://youtube-music.f8team.dev/api";

function LineDetail() {
  const { slug } = useParams();
  const [detail, setDetail] = useState(null);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  const songsRef = useRef(null);
  const playlistsRef = useRef(null);
  const albumsRef = useRef(null);
  const videosRef = useRef(null);
  const songsTimer = useRef(null);
  const playlistsTimer = useRef(null);
  const albumsTimer = useRef(null);
  const videosTimer = useRef(null);
  const [songsScrolling, setSongsScrolling] = useState(false);
  const [playlistsScrolling, setPlaylistsScrolling] = useState(false);
  const [albumsScrolling, setAlbumsScrolling] = useState(false);
  const [videosScrolling, setVideosScrolling] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dRes, sRes, pRes, aRes, vRes] = await Promise.all([
          axios.get(`${BASE_URL}/lines/${slug}`),
          axios.get(`${BASE_URL}/lines/${slug}/songs`, {
            params: { limit: 20, sort: "-popularity" },
          }),
          axios.get(`${BASE_URL}/lines/${slug}/playlists`, {
            params: { limit: 12, sort: "-popularity" },
          }),
          axios.get(`${BASE_URL}/lines/${slug}/albums`, {
            params: { limit: 12, sort: "-releaseDate" },
          }),
          axios.get(`${BASE_URL}/lines/${slug}/videos`, {
            params: { limit: 12, sort: "-createdAt" },
          }),
        ]);
        setDetail(dRes.data);
        setSongs(Array.isArray(sRes.data?.items) ? sRes.data.items : []);
        setPlaylists(Array.isArray(pRes.data?.items) ? pRes.data.items : []);
        setAlbums(Array.isArray(aRes.data?.items) ? aRes.data.items : []);
        setVideos(Array.isArray(vRes.data?.items) ? vRes.data.items : []);
      } catch (e) {
        setError("Không thể tải chi tiết");
      }
    };
    fetchAll();
  }, [slug]);

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

      <h2 className="text-2xl font-bold text-white mb-3">Playlists nổi bật</h2>
      <div
        ref={playlistsRef}
        onScroll={() => {
          setPlaylistsScrolling(true);
          if (playlistsTimer.current) clearTimeout(playlistsTimer.current);
          playlistsTimer.current = setTimeout(
            () => setPlaylistsScrolling(false),
            800
          );
        }}
        className={`flex gap-4 overflow-x-auto custom-scrollbar ${
          playlistsScrolling ? "" : "no-scrollbar"
        } pb-2`}
      >
        {playlists.map((item, idx) => (
          <div key={item._id || item.id || idx} className="min-w-[280px]">
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

      <h2 className="text-2xl font-bold text-white mt-8 mb-3">Albums</h2>
      <div
        ref={albumsRef}
        onScroll={() => {
          setAlbumsScrolling(true);
          if (albumsTimer.current) clearTimeout(albumsTimer.current);
          albumsTimer.current = setTimeout(
            () => setAlbumsScrolling(false),
            800
          );
        }}
        className={`flex gap-4 overflow-x-auto custom-scrollbar ${
          albumsScrolling ? "" : "no-scrollbar"
        } pb-2`}
      >
        {albums.map((item, idx) => (
          <div key={item._id || item.id || idx} className="min-w-[280px]">
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

      <h2 className="text-2xl font-bold text-white mt-8 mb-3">Songs</h2>
      <div
        ref={songsRef}
        onScroll={() => {
          setSongsScrolling(true);
          if (songsTimer.current) clearTimeout(songsTimer.current);
          songsTimer.current = setTimeout(() => setSongsScrolling(false), 800);
        }}
        className={`flex gap-4 overflow-x-auto custom-scrollbar ${
          songsScrolling ? "" : "no-scrollbar"
        } pb-2`}
      >
        {songs.map((item, idx) => (
          <div key={item._id || item.id || idx} className="min-w-[360px]">
            <Home3Card
              data={{
                title: item.name || item.title,
                thumbnails: item.thumb || item.thumbnailUrl,
                artists: item.albumName || "",
              }}
            />
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-3">Videos</h2>
      <div
        ref={videosRef}
        onScroll={() => {
          setVideosScrolling(true);
          if (videosTimer.current) clearTimeout(videosTimer.current);
          videosTimer.current = setTimeout(
            () => setVideosScrolling(false),
            800
          );
        }}
        className={`flex gap-4 overflow-x-auto custom-scrollbar ${
          videosScrolling ? "" : "no-scrollbar"
        } pb-2`}
      >
        {videos.map((item, idx) => (
          <div key={item._id || item.id || idx} className="min-w-[360px]">
            <Home3Card
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
  );
}

export default LineDetail;
