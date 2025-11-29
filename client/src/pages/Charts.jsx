import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Home1Card from "../components/card/music/home1.jsx";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CountryDropdown from "../components/card/ListDropdown.jsx";

function Charts() {
  const IMG_URL_1 = "https://i.pravatar.cc/150?u=5"; // ảnh bonus cho nghệ sĩ
  const IMG_URL_2 = "https://i.pravatar.cc/150?u=2";
  const videoCharts = [
    {
      _id: "chart1",
      imageUrl: IMG_URL_2,
      title: "Daily Top Music Videos - Global",
      type: "Chart",
      artist: "YouTube Music",
      views: 0,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const artistRef = useRef(null);
  const [artists, setArtists] = useState([]);
  const [countries, setCountries] = useState([]);

  const navigate = useNavigate();

  // Hàm điều hướng chung
  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          "https://youtube-music.f8team.dev/api/charts/top-artists"
        );
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setArtists(items);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          "https://youtube-music.f8team.dev/api/charts/countries"
        );
        const items = Array.isArray(res.data?.countries)
          ? res.data.countries
          : Array.isArray(res.data?.items)
          ? res.data.items
          : [];
        setCountries(items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCountries();
    fetchArtists();
  }, []);

  return (
    <div className="px-8 py-8 min-h-screen bg-black text-white pb-32">
      <div className="mb-10 space-y-4">
        <h1 className="text-5xl font-bold">Charts</h1>
        <CountryDropdown countries={countries} />
      </div>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">Video charts</h2>
        <div
          className="flex flex-wrap gap-6"
          onClick={() => handleNavigation("/explore/charts/videoCharts")}
        >
          {videoCharts.map((chart) => (
            <div key={chart._id} className="w-full sm:w-[220px]">
              <Home1Card data={chart} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Top artists</h2>
          {/* Nút điều hướng Slide  */}
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-[#212121] border border-gray-700 hover:bg-[#3a3a3a] disabled:opacity-50">
              <FiChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-full bg-[#212121] border border-gray-700 hover:bg-[#3a3a3a]">
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {artists.map((artist) => (
            <div
              key={artist.rank}
              className="flex items-center gap-4 p-2 rounded-md hover:bg-[#212121] transition-colors cursor-pointer group"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={IMG_URL_1}
                  alt={artist.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {/* ranking */}
              <div className="flex items-center text-gray-400 text-sm font-medium w-6 justify-center">
                <span className="mr-1 hidden group-hover:inline-block">•</span>{" "}
                {artist.rank}
              </div>

              {/* info */}
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-white truncate">
                  {artist.name}
                </span>
                <span className="text-gray-400 text-sm truncate">
                  Views: {artist.totalViews / 1000}k
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Charts;
