import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Home1Card from "../components/card/music/home1";
import Home2Card from "../components/card/music/home2";
import Home3Card from "../components/card/music/home3";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../contexts/PlayerContext";

const BASE_URL = "https://youtube-music.f8team.dev/api";

function Home() {
  // moods
  const [moods, setMoods] = useState([]);
  const [selectedMoodSlug, setSelectedMoodSlug] = useState(null);
  const [quickPicks, setQuickPicks] = useState([]);
  const [homeAlbums, setHomeAlbums] = useState([]);
  const [todaysHits, setTodaysHits] = useState([]);
  const [countryCode, setCountryCode] = useState("GLOBAL");
  const [countryPlaylists, setCountryPlaylists] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const { token } = useAuth();
  const moodsRef = useRef(null);
  const albumsRef = useRef(null);
  const hitsRef = useRef(null);
  const countryRef = useRef(null);
  const personalizedRef = useRef(null);
  const moodsScrollTimer = useRef(null);
  const albumsScrollTimer = useRef(null);
  const hitsScrollTimer = useRef(null);
  const countryScrollTimer = useRef(null);
  const personalizedScrollTimer = useRef(null);
  const [moodsScrolling, setMoodsScrolling] = useState(false);
  const [albumsScrolling, setAlbumsScrolling] = useState(false);
  const [hitsScrolling, setHitsScrolling] = useState(false);
  const [countryScrolling, setCountryScrolling] = useState(false);
  const [personalizedScrolling, setPersonalizedScrolling] = useState(false);
  const navigate = useNavigate();
  const { actions } = usePlayer();

  // load moods
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/moods`, {
          params: { limit: 20, sort: "-popularity" },
        });
        const fetchedMoods =
          res.data?.items || res.data?.data || res.data || [];
        setMoods(fetchedMoods);
      } catch (error) {
        console.error(error);
      }
    };
    // home def
    const fetchHomeSections = async () => {
      try {
        // aRes --> album res/ hRes --> hits res / cREs --> country res
        const [aRes, hRes] = await Promise.all([
          axios.get(`${BASE_URL}/home/albums-for-you`, {
            params: { country: "GLOBAL", limit: 12 },
          }),
          axios.get(`${BASE_URL}/home/todays-hits`, {
            params: { country: "GLOBAL", limit: 40 },
          }),
        ]);
        const albums = Array.isArray(aRes.data)
          ? aRes.data
          : aRes.data?.items || [];
        const hits = Array.isArray(hRes.data)
          ? hRes.data
          : hRes.data?.items || [];

        setHomeAlbums(albums);
        setTodaysHits(hits);
      } catch (error) {
        console.error("Error fetching home sections:", error);
      }
    };
    fetchMoods();
    fetchHomeSections();
  }, []);

  useEffect(() => {
    const fetchByCountry = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/playlists/by-country`, {
          params: { country: countryCode, limit: 12 },
        });
        const items = Array.isArray(res.data) ? res.data : res.data?.items || [];
        setCountryPlaylists(items);
      } catch (e) {
        setCountryPlaylists([]);
      }
    };
    fetchByCountry();
  }, [countryCode]);

  useEffect(() => {
    const fetchPersonalized = async () => {
      if (!token) {
        setPersonalized([]);
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/home/personalized`, {
          params: { limit: 20 },
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = Array.isArray(res.data) ? res.data : res.data?.items || [];
        setPersonalized(items);
      } catch (e) {
        setPersonalized([]);
      }
    };
    fetchPersonalized();
  }, [token]);

  const handlePlayEvent = async (item) => {
    try {
      if (!token) return;
      const body = {};
      const type = item.type || "";
      const id = item._id || item.id || item.slug;
      if (type === "playlist") body.playlistId = id;
      else if (type === "album") body.albumId = id;
      else body.songId = id;
      body.playedAt = new Date().toISOString();
      await axios.post(`${BASE_URL}/events/play`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
  };

  const fetchQuickPicks = async (slug) => {
    try {
      const res = await axios.get(`${BASE_URL}/quick-picks`, {
        params: { mood: slug, limit: 20 },
      });
      const items = Array.isArray(res.data) ? res.data : res.data?.items || [];
      setQuickPicks(items);
    } catch (error) {
      console.error(error);
      setQuickPicks([]);
    }
  };

  // call api khi selected mood change
  useEffect(() => {
    if (selectedMoodSlug) {
      fetchQuickPicks(selectedMoodSlug);
    }
  }, [selectedMoodSlug]);

  // handle click mood
  const handleSelectMood = (mood) => {
    // Chỉ cần cập nhật state, useEffect sẽ lo việc gọi API
    setSelectedMoodSlug(mood.slug);
  };

  return (
    <div className="w-full">
      {/* moods list */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div
          ref={moodsRef}
          onScroll={() => {
            setMoodsScrolling(true);
            if (moodsScrollTimer.current) clearTimeout(moodsScrollTimer.current);
            moodsScrollTimer.current = setTimeout(() => setMoodsScrolling(false), 800);
          }}
          className={`flex gap-3 overflow-x-auto custom-scrollbar ${moodsScrolling ? "" : "no-scrollbar"} py-4`}
        >
          {moods.map((mood) => (
            <div
              key={mood._id || mood.id || mood.slug}
              onClick={() => handleSelectMood(mood)}
              className={`px-4 py-1 text-sm rounded-lg whitespace-nowrap cursor-pointer transition
                ${
                  selectedMoodSlug === mood.slug
                    ? "bg-white text-black font-semibold"
                    : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                }
              `}
            >
              {mood.name}
            </div>
          ))}
        </div>
      </div>

      {/* default page */}
      {!selectedMoodSlug && (
        // albums for u
        <div className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">Albums for you</h2>
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
              {/* x */}
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
            {homeAlbums.map((item) => (
              <div key={item._id || item.id || item.slug} className="min-w-[300px]">
                <Home1Card
                  data={item}
                  onClick={() => {
                    const slug = item.slug || item.id;
                    if (item.type === "album") navigate(`/albums/details/${slug}`);
                    else navigate(`/playlists/details/${slug}`);
                  }}
                  onPlay={() => actions.playTrack({
                    ...item,
                    title: item.title || item.name,
                    type: item.type === "album" ? "album" : "playlist",
                  })}
                />
              </div>
            ))}
          </div>

          {/* today hits */}
          <div className="flex items-center justify-between mt-8 mb-4">
            <h2 className="text-3xl font-bold text-white">Today's hits</h2>
            <div className="flex items-center gap-2">
              <button
                className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
                onClick={() =>
                  hitsRef.current?.scrollBy({ left: -600, behavior: "smooth" })
                }
              >
                <FiChevronLeft />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
                onClick={() =>
                  hitsRef.current?.scrollBy({ left: 600, behavior: "smooth" })
                }
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          {/* list */}
          <div
            ref={hitsRef}
            onScroll={() => {
              setHitsScrolling(true);
              if (hitsScrollTimer.current)
                clearTimeout(hitsScrollTimer.current);
              hitsScrollTimer.current = setTimeout(
                () => setHitsScrolling(false),
                800
              );
            }}
            className={`flex gap-6 overflow-x-auto custom-scrollbar ${
              hitsScrolling ? "" : "no-scrollbar"
            } pb-2`}
          >
            {(() => {
              const size = 2;
              const cols = [];
              for (let i = 0; i < todaysHits.length; i += size) {
                cols.push(todaysHits.slice(i, i + size));
              }
              return cols.map((col, idx) => (
                <div key={idx} className="min-w-[420px] flex flex-col gap-3">
                  {col.map((item) => (
                    <div key={item._id || item.id || item.slug} className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-3">
                      <Home3Card
                        data={item}
                        onClick={() => {
                          const idOrSlug = item.slug || item.id;
                          if (item.type === "playlist") navigate(`/playlists/details/${idOrSlug}`);
                          else if (item.type === "album") navigate(`/albums/details/${idOrSlug}`);
                          else if (item.type === "video") navigate(`/videos/details/${idOrSlug}`);
                          else navigate(`/songs/details/${idOrSlug}`);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>

          {/* country playlists */}
          <div className="flex items-center justify-between mt-8 mb-4">
            <h2 className="text-3xl font-bold text-white">Playlists by country</h2>
            <div className="flex items-center gap-2">
              <button
                className={`px-3 h-9 rounded-full border border-gray-700 ${countryCode === "GLOBAL" ? "bg-white text-black" : "bg-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.25)]"}`}
                onClick={() => setCountryCode("GLOBAL")}
              >
                Global
              </button>
              <button
                className={`px-3 h-9 rounded-full border border-gray-700 ${countryCode === "VN" ? "bg-white text-black" : "bg-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.25)]"}`}
                onClick={() => setCountryCode("VN")}
              >
                Vietnam
              </button>
              <button
                className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
                onClick={() => countryRef.current?.scrollBy({ left: -600, behavior: "smooth" })}
              >
                <FiChevronLeft />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
                onClick={() => countryRef.current?.scrollBy({ left: 600, behavior: "smooth" })}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div
            ref={countryRef}
            onScroll={() => {
              setCountryScrolling(true);
              if (countryScrollTimer.current) clearTimeout(countryScrollTimer.current);
              countryScrollTimer.current = setTimeout(() => setCountryScrolling(false), 800);
            }}
            className={`flex gap-4 overflow-x-auto custom-scrollbar ${countryScrolling ? "" : "no-scrollbar"} pb-2`}
          >
            {countryPlaylists.map((item) => (
              <div key={item._id || item.id || item.slug} className="min-w-[300px]" onClick={() => handlePlayEvent({ ...item, type: "playlist" })}>
                <Home3Card data={{
                  title: item.title || item.name,
                  thumbnails: Array.isArray(item.thumbnails) ? item.thumbnails[0] : item.thumbnailUrl || item.thumb,
                  artists: Array.isArray(item.artists) ? item.artists.join(", ") : item.artist || "",
                }} />
              </div>
            ))}
          </div>

          {/* personalized */}
          {token && personalized.length > 0 && (
            <>
              <div className="flex items-center justify-between mt-8 mb-4">
                <h2 className="text-3xl font-bold text-white">Based on your history</h2>
                <div className="flex items-center gap-2">
                  <button
                    className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
                    onClick={() => personalizedRef.current?.scrollBy({ left: -600, behavior: "smooth" })}
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
                    onClick={() => personalizedRef.current?.scrollBy({ left: 600, behavior: "smooth" })}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
              <div
                ref={personalizedRef}
                onScroll={() => {
                  setPersonalizedScrolling(true);
                  if (personalizedScrollTimer.current) clearTimeout(personalizedScrollTimer.current);
                  personalizedScrollTimer.current = setTimeout(() => setPersonalizedScrolling(false), 800);
                }}
                className={`flex gap-4 overflow-x-auto custom-scrollbar ${personalizedScrolling ? "" : "no-scrollbar"} pb-2`}
              >
                {personalized.map((item) => (
                  <div key={item._id || item.id || item.slug} className="min-w-[300px]" onClick={() => handlePlayEvent(item)}>
                    <Home1Card
                      data={{
                        title: item.title || item.name,
                        thumbnails: Array.isArray(item.thumbnails) ? item.thumbnails[0] : item.thumbnailUrl || item.thumb,
                        artists: Array.isArray(item.artists) ? item.artists.join(", ") : item.artist || "",
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      
    </div>
  );
}

export default Home;
