import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiMusic,
  FiTrendingUp,
  FiSmile,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function Explore() {
  const [moods, setMoods] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          "https://youtube-music.f8team.dev/api/categories"
        );
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setMoods(items.filter((i) => i.type === "mood"));
        setGenres(items.filter((i) => i.type === "genre"));
      } catch (e) {
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // congfig
  const TopButton = ({ icon: Icon, label }) => (
    <button className="flex items-center gap-3 px-6 h-12 bg-[#2b2b2b] hover:bg-[#3a3a3a] rounded-xl border border-gray-700 text-white font-semibold">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  // config
  const CategoryCard = ({ item }) => (
    <Link
      to={`/categories/${item.slug}`}
      className="flex items-center h-12 px-4 rounded-xl bg-[#2b2b2b] hover:bg-[#3a3a3a] border border-gray-700 text-white"
    >
      <span
        className="w-[3px] h-6 mr-3 rounded"
        style={{ backgroundColor: item.color }}
      />
      <span className="text-sm font-medium truncate max-w-[220px]">
        {item.name}
      </span>
    </Link>
  );

  // page return
  return (
    <div className="px-4 pt-4 space-y-8">
      {/* Bổ sung link tới page mới */}
      <div className="flex flex-wrap gap-4">
        <TopButton icon={FiMusic} label="Bản phát hành mới" />
        <TopButton icon={FiTrendingUp} label="Bảng xếp hạng" />
        <TopButton icon={FiSmile} label="Tâm trạng và thể loại" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Tâm trạng và thể loại</h2>
          {/* Bổ sung link cho 3 btn*/}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg bg-[#2b2b2b] hover:bg-[#3a3a3a] border border-gray-700 text-sm">
              More
            </button>
            <button className="p-2 rounded-full bg-[#2b2b2b] hover:bg-[#3a3a3a] border border-gray-700">
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-[#2b2b2b] hover:bg-[#3a3a3a] border border-gray-700">
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && <div className="text-gray-400">Đang tải…</div>}
        {error && <div className="text-red-400">{error}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {/* loading genre card */}
          {moods.concat(genres).map((item) => (
            <CategoryCard key={item._id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Explore;
