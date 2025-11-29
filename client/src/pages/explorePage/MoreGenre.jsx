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
const BASE_URL = "https://youtube-music.f8team.dev/api";

function MoreGenre() {
  const [moods, setMoods] = useState([]);
  const [genres, setGenres] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // loading scroll for moods and genre
  const categoriesRef = useRef(null);
  const categoriesScrollTimer = useRef(null);
  const [categoriesScrolling, setCategoriesScrolling] = useState(false);
  const linesRef = useRef(null);
  const linesScrollTimer = useRef(null);
  const [linesScrolling, setLinesScrolling] = useState(false);

  const navigate = useNavigate();

  // Hàm điều hướng chung
  const handleNavigation = (path) => {
    navigate(path);
  };

  // config Category Card
  const CategoryCard = ({ item, to }) => (
    <Link
      to={to}
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

  //   API
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        const [cRes, lRes] = await Promise.all([
          axios.get(`${BASE_URL}/categories`),
          axios.get(`${BASE_URL}/lines`),
        ]);
        const items = Array.isArray(cRes.data?.items) ? cRes.data.items : [];
        const lines = Array.isArray(lRes.data?.items) ? lRes.data.items : [];
        setMoods(items.filter((i) => i.type === "mood"));
        setGenres(items.filter((i) => i.type === "genre"));
        setLines(lines);
      } catch (error) {
        setError("Loi");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="px-4 pt-4 space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Tâm trạng</h2>
          <div className="flex items-center gap-2"></div>
        </div>
        {/* pre render */}
        {loading && <div className="text-gray-400">Đang tải…</div>}
        {error && <div className="text-red-400">{error}</div>}

        <div className="grid gap-4">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            }}
          >
            {(() => {
              const moodAndGenre = moods;

              // Lặp qua từng item (thẻ)
              return moodAndGenre.map((item) => (
                <div
                  key={item._id || item.id || item.slug}
                  className="col-span-1"
                >
                  <CategoryCard item={item} to={`/explore/moreGenre/category/${item.slug}`} />
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Thể loại</h2>
          <div className="flex items-center gap-2"></div>
        </div>
        {/* pre render */}
        {loading && <div className="text-gray-400">Đang tải…</div>}
        {error && <div className="text-red-400">{error}</div>}

        <div className="grid gap-4">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            }}
          >
            {(() => {
              const moodAndGenre = genres;

              return moodAndGenre.map((item) => (
                <div
                  key={item._id || item.id || item.slug}
                  className="col-span-1"
                >
                  <CategoryCard item={item} to={`/explore/moreGenre/category/${item.slug}`} />
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Dòng nhạc</h2>
          <div className="flex items-center gap-2"></div>
        </div>
        {/* pre render */}
        {loading && <div className="text-gray-400">Đang tải…</div>}
        {error && <div className="text-red-400">{error}</div>}

        <div className="grid gap-4">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            }}
          >
            {(() => {
              return lines.map((item) => (
                <div key={item._id} className="col-span-1">
                  <CategoryCard item={item} to={`/explore/moreGenre/line/${item.slug}`} />
                </div>
              ));
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MoreGenre;
