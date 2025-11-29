import React, { useEffect, useState, useRef } from "react";
import { FiPlay, FiMoreVertical, FiBookmark } from "react-icons/fi";
import ItemMusicCard from "../../components/card/ItemMusicCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RealeasedDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // top video
  const [videos, setVideos] = useState([]);
  const videosRef = useRef(null);
  const videosScrollTimer = useRef(null);
  const [videosScrolling, setVideosScrolling] = useState(false);

  // Navigate
  const navigate = useNavigate();
  const handleNavigation = (path) => navigate(path);

  // Fetch API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          "https://youtube-music.f8team.dev/api/charts/videos"
        );
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setVideos(items);
      } catch (error) {
        setError("Failed to load videos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a3b3b] via-[#121212] to-black text-white font-sans">
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-12">
        {/* LEFT INFO PANEL */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="sticky top-24 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="relative group shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-lg">
              <img
                src="https://music.youtube.com/img/chart_daily_top_100.png"
                alt="Daily Top 100"
                className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-lg"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/300x300/222/FFF?text=Top+100")
                }
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Daily Top Music Videos - Global
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300 font-medium">
                <span className="text-red-500 font-bold">YouTube Music</span>
                <span>•</span>
                <span>Chart</span>
                <span>•</span>
                <span>2025</span>
              </div>

              <div className="text-sm text-gray-400">
                100 songs • 5 hours, 34 minutes
                <br />
                Today's ranking of the most popular music videos on YouTube.
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <FiBookmark className="w-5 h-5" />
              </button>

              <button className="w-16 h-16 rounded-full bg-white text-black hover:scale-105 transition flex items-center justify-center shadow-lg">
                <FiPlay className="w-8 h-8 ml-1" />
              </button>

              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT LIST */}
        <div className="w-full md:w-2/3">
          <div className="flex flex-col space-y-1">
            {videos.map((video) => (
              <div key={video.videoId} className="min-w-[250px] flex-shrink-0">
                <ItemMusicCard song={video} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealeasedDetails;
