import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FiMusic,
  FiTrendingUp,
  FiSmile,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

function Explore() {
  const [moods, setMoods] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Khắc phục: Import useRef và sử dụng tên hàm setter chính xác
  const categoriesRef = useRef(null);
  const categoriesScrollTimer = useRef(null);
  const [categoriesScrolling, setCategoriesScrolling] = useState(false); // Đã sửa tên hàm

  const navigate = useNavigate();

  // Hàm điều hướng chung
  const handleNavigation = (path) => {
    navigate(path);
  };

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
  const TopButton = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-6 h-12 bg-[#2b2b2b] hover:bg-[#3a3a3a] rounded-xl border border-gray-700 text-white font-semibold"
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
  // config Category Card
  const CategoryCard = ({ item }) => (
    <Link
      to={`/explore/${item.slug}`}
      className="flex items-center h-12 px-4 rounded-xl bg-[#2b2b2b] hover:bg-[#3a3a3a] border border-gray-700 text-white min-w-[200px]"
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
        <TopButton
          icon={FiTrendingUp}
          label="Bảng xếp hạng"
          onClick={() => handleNavigation("/explore/charts/playlist")}
        />
        <TopButton icon={FiSmile} label="Tâm trạng và thể loại" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Tâm trạng và thể loại</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg bg-[#2b2b2b] hover:bg-[#3a3a3a] border border-gray-700 text-sm">
              More
            </button>
            <button
              className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] flex items-center justify-center text-white"
              onClick={() =>
                categoriesRef.current?.scrollBy({
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
                categoriesRef.current?.scrollBy({
                  left: 600,
                  behavior: "smooth",
                })
              }
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {loading && <div className="text-gray-400">Đang tải…</div>}
        {error && <div className="text-red-400">{error}</div>}

        {/* list đã được sửa lỗi logic */}

        <div
          ref={categoriesRef}
          onScroll={() => {
            setCategoriesScrolling(true);
            if (categoriesScrollTimer.current)
              clearTimeout(categoriesScrollTimer.current);
            categoriesScrollTimer.current = setTimeout(
              () => setCategoriesScrolling(false),
              800
            );
          }}
          className={`flex gap-3 overflow-x-auto ${
            // Giảm gap
            categoriesScrolling ? "" : "no-scrollbar"
          } pb-2`}
        >
          {/* Sửa lỗi logic: Không lặp lồng và styling thừa.
             Gom các thẻ thành các cột 2 thẻ/cột, mỗi thẻ chiếm 50% chiều rộng của cột
          */}
          {(() => {
            const moodAndGenre = moods.concat(genres);
            const size = 3; // Số thẻ trên 1 cột
            const cols = [];
            for (let i = 0; i < moodAndGenre.length; i += size) {
              cols.push(moodAndGenre.slice(i, i + size));
            }
            return cols.map((col, idx) => (
              <div
                key={idx}
                className="min-w-[420px] flex flex-col gap-3 flex-shrink-0" // Giữ nguyên kích thước cột và ngăn co lại
              >
                {col.map((item) => (
                  <CategoryCard
                    key={item._id || item.id || item.slug}
                    item={item}
                  />
                ))}
              </div>
            ));
          })()}
        </div>
      </section>
    </div>
  );
}

export default Explore;
