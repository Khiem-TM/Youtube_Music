import React, { useState } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Home1Card from "../components/card/music/home1.jsx";

function Charts() {
  // mock data - testing
  const videoCharts = [
    {
      _id: "chart1",
      imageUrl: "",
      title: "Daily Top Music Videos - Global",
      type: "Chart",
      artist: "YouTube Music",
      views: 0,
    },
    {
      _id: "chart2",
      imageUrl: "",
      title: "Top 100 Music Videos Global",
      type: "Chart",
      artist: "YouTube Music",
      views: 0,
    },
  ];

  // data cho top art
  const topArtists = [
    {
      rank: 1,
      name: "Alka Yagnik",
      subs: "1.7M subscribers",
      img: "https://i.pravatar.cc/150?u=1",
    },
    {
      rank: 2,
      name: "Udit Narayan",
      subs: "3.49M subscribers",
      img: "https://i.pravatar.cc/150?u=2",
    },
    {
      rank: 3,
      name: "Arijit Singh",
      subs: "5.48M subscribers",
      img: "https://i.pravatar.cc/150?u=3",
    },
    {
      rank: 4,
      name: "Kumar Sanu",
      subs: "1.24M subscribers",
      img: "https://i.pravatar.cc/150?u=4",
    },
    {
      rank: 5,
      name: "Shreya Ghoshal",
      subs: "2.46M subscribers",
      img: "https://i.pravatar.cc/150?u=5",
    },
    {
      rank: 6,
      name: "KPop Demon Hunters",
      subs: "120K subscribers",
      img: "https://i.pravatar.cc/150?u=6",
    },
    {
      rank: 7,
      name: "Shilpi Raj",
      subs: "1.01M subscribers",
      img: "https://i.pravatar.cc/150?u=7",
    },
    {
      rank: 8,
      name: "Bad Bunny",
      subs: "51.3M subscribers",
      img: "https://i.pravatar.cc/150?u=8",
    },
    {
      rank: 9,
      name: "Sonu Nigam",
      subs: "3.58M subscribers",
      img: "https://i.pravatar.cc/150?u=9",
    },
    {
      rank: 10,
      name: "Fuerza Regida",
      subs: "6.16M subscribers",
      img: "https://i.pravatar.cc/150?u=10",
    },
    {
      rank: 11,
      name: "Pawan Singh",
      subs: "6.06M subscribers",
      img: "https://i.pravatar.cc/150?u=11",
    },
    {
      rank: 12,
      name: "Khesari Lal Yadav",
      subs: "11M subscribers",
      img: "https://i.pravatar.cc/150?u=12",
    },
  ];

  return (
    <div className="px-8 py-8 min-h-screen bg-black text-white pb-32">
      <div className="mb-10 space-y-4">
        <h1 className="text-5xl font-bold">Charts</h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#212121] hover:bg-[#303030] rounded-full border border-gray-700 cursor-pointer transition-colors">
          <span className="text-sm font-medium text-gray-200">Global</span>
          <FiChevronDown className="text-gray-400" />
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">Video charts</h2>
        <div className="flex flex-wrap gap-6">
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
          {topArtists.map((artist) => (
            <div
              key={artist.rank}
              className="flex items-center gap-4 p-2 rounded-md hover:bg-[#212121] transition-colors cursor-pointer group"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={artist.img}
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
                  {artist.subs}
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
