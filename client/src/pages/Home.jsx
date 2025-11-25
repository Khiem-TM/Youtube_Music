import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Home1Card from "../components/card/music/home1";
import Home2Card from "../components/card/music/home2";
import Home3Card from "../components/card/music/home3";

// Hàm helper để map dữ liệu cho gọn code (tránh lặp lại logic map ở nhiều chỗ)
const mapData = (items, type) => {
  if (!Array.isArray(items)) return [];
  return items.map((i) => ({
    _id: i._id || i.id,
    title: i.title || i.name || "",
    imageUrl:
      i.thumbnailUrl ||
      i.coverUrl ||
      (Array.isArray(i.thumbnails)
        ? i.thumbnails[0]?.url || i.thumbnails[0]
        : "") ||
      "",
    artist: Array.isArray(i.artists)
      ? i.artists.map((a) => a.name).join(", ")
      : i.artist || i.creator || "",
    type: type || "Song",
    duration: i.duration || "",
    views: i.views || i.popularity || 0,
  }));
};

function Home() {
  const { token } = useAuth();

  // --- State cũ ---
  const [albums, setAlbums] = useState([]);
  const [hits, setHits] = useState([]);
  const [playlistsByCountry, setPlaylistsByCountry] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- State MỚI cho Moods ---
  const [moods, setMoods] = useState([]); // Danh sách danh mục
  const [selectedMood, setSelectedMood] = useState("all"); // 'all' hoặc slug của mood
  const [quickPicks, setQuickPicks] = useState([]); // Dữ liệu bài hát khi chọn mood

  const base = "https://youtube-music.f8team.dev/api";

  // 1. Fetch dữ liệu ban đầu (Thêm gọi API Moods)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        // Dùng Promise.allSettled để nếu 1 cái lỗi thì các cái khác vẫn chạy
        const results = await Promise.allSettled([
          axios.get(`${base}/home/albums-for-you`, {
            params: { country: "GLOBAL", limit: 12 },
          }),
          axios.get(`${base}/home/todays-hits`, {
            params: { country: "GLOBAL", limit: 12 },
          }),
          axios.get(`${base}/playlists/by-country`, {
            params: { country: "VN", limit: 12 },
          }),
          axios.get(`${base}/moods`, { params: { limit: 20 } }), // <--- MỚI: Lấy danh sách mood
        ]);

        // Helper lấy data an toàn từ Promise.allSettled
        const getData = (res) =>
          res.status === "fulfilled"
            ? res.value.data?.data?.items || res.value.data?.items
            : [];

        setAlbums(mapData(getData(results[0]), "Album"));
        setHits(mapData(getData(results[1]), "Song"));
        setPlaylistsByCountry(mapData(getData(results[2]), "Playlist"));

        // Set Moods
        const moodData = getData(results[3]);
        setMoods(moodData);
      } catch (e) {
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []); // Chỉ chạy 1 lần khi mount

  // 2. Fetch Personalized (Riêng biệt khi có Token)
  useEffect(() => {
    if (!token) return;
    const fetchPersonalized = async () => {
      try {
        const perRes = await axios.get(`${base}/home/personalized`, {
          params: { limit: 12 },
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = perRes.data?.data?.items || perRes.data?.items;
        setPersonalized(mapData(items, "Song"));
      } catch {}
    };
    fetchPersonalized();
  }, [token]);

  // 3. Hàm xử lý khi bấm vào Mood (MỚI)
  const handleMoodClick = async (slug) => {
    setSelectedMood(slug);

    // Nếu chọn "Tất cả" thì không cần fetch gì thêm
    if (slug === "all") {
      setQuickPicks([]);
      return;
    }

    // Fetch Quick Picks theo mood
    try {
      // Có thể thêm loading nhỏ ở đây nếu muốn
      const res = await axios.get(`${base}/quick-picks`, {
        params: { mood: slug, limit: 20 },
      });
      const items = res.data?.data?.items || res.data?.items;
      setQuickPicks(mapData(items, "Song"));
    } catch (err) {
      console.error("Lỗi tải quick picks", err);
    }
  };

  const recordPlay = async (payload) => {
    if (!token) return;
    try {
      await axios.post(`${base}/events/play`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  };

  return (
    <div className="px-4 pt-4 space-y-8 pb-20">
      {/* --- PHẦN MỚI: THANH MOOD BAR (Sticky Top) --- */}
      <div className="sticky top-0 z-10 bg-black/95 py-3 -mx-4 px-4 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {/* Nút mặc định: Tất cả */}
          <button
            onClick={() => handleMoodClick("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedMood === "all"
                ? "bg-white text-black"
                : "bg-[#212121] text-white hover:bg-[#3a3a3a] border border-white/10"
            }`}
          >
            Tất cả
          </button>

          {/* Render danh sách Moods từ API */}
          {moods.map((mood) => (
            <button
              key={mood._id || mood.slug}
              onClick={() => handleMoodClick(mood.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedMood === mood.slug
                  ? "bg-white text-black"
                  : "bg-[#212121] text-white hover:bg-[#3a3a3a] border border-white/10"
              }`}
            >
              {mood.title}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-gray-400">Đang tải…</div>}
      {error && <div className="text-red-400">{error}</div>}

      {/* --- CONDITIONAL RENDERING --- */}

      {/* TRƯỜNG HỢP 1: Đang chọn Mood -> Chỉ hiện Quick Picks */}
      {selectedMood !== "all" ? (
        <section className="animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-white capitalize">
            Gợi ý cho:{" "}
            {moods.find((m) => m.slug === selectedMood)?.title || selectedMood}
          </h2>
          {quickPicks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {quickPicks.map((c) => (
                <div key={c._id} onClick={() => recordPlay({ songId: c._id })}>
                  {/* Bạn có thể dùng Home1Card hoặc Home3Card tùy sở thích hiển thị */}
                  <Home1Card data={c} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">Đang tải danh sách bài hát...</div>
          )}
        </section>
      ) : (
        /* TRƯỜNG HỢP 2: Chọn "Tất cả" -> Hiện giao diện gốc (Albums, Hits, Playlists...) */
        <>
          {albums.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold mb-4">Gợi ý Album</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {albums.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => recordPlay({ albumId: c._id })}
                  >
                    <Home1Card data={c} />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            !loading && (
              <section>
                <h2 className="text-xl font-bold mb-4">Gợi ý Album</h2>
                <div className="text-gray-500">Không có dữ liệu</div>
              </section>
            )
          )}

          {hits.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold mb-4">Todays Hits</h2>
              <div className="flex flex-wrap gap-4">
                {hits.map((c) => (
                  <div
                    key={c._id}
                    className="w-64"
                    onClick={() => recordPlay({ songId: c._id })}
                  >
                    <Home2Card data={c} />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            !loading && (
              <section>
                <h2 className="text-xl font-bold mb-4">Todays Hits</h2>
                <div className="text-gray-500">Không có dữ liệu</div>
              </section>
            )
          )}

          {playlistsByCountry.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold mb-4">
                Playlists theo quốc gia
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {playlistsByCountry.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => recordPlay({ playlistId: c._id })}
                  >
                    <Home1Card data={c} />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            !loading && (
              <section>
                <h2 className="text-xl font-bold mb-4">
                  Playlists theo quốc gia
                </h2>
                <div className="text-gray-500">Không có dữ liệu</div>
              </section>
            )
          )}

          {personalized.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold mb-4">Dành cho bạn</h2>
              <div className="space-y-1">
                {personalized.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => recordPlay({ songId: c._id })}
                  >
                    <Home3Card data={c} />
                  </div>
                ))}
              </div>
            </section>
          ) : token && !loading ? (
            <section>
              <h2 className="text-xl font-bold mb-4">Dành cho bạn</h2>
              <div className="text-gray-500">Không có dữ liệu</div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Home;
