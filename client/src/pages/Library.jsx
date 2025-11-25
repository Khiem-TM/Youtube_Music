import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiDisc } from "react-icons/fi";

function Library() {
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* bonus decor */}
        <div className="mb-6 animate-pulse">
          <FiDisc className="w-20 h-20 text-gray-700" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Khám phá nội dung yêu thích
        </h2>

        <p className="text-gray-400 mb-8 text-sm md:text-base max-w-sm">
          Đăng nhập để xem các bản nhạc bạn đã thích hoặc lưu lại trong thư viện
          của mình.
        </p>

        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-auth-modal", { detail: { mode: "login" } })
            )
          }
          className="px-8 py-2.5 rounded-full border border-gray-600 text-white font-medium text-sm hover:bg-white/10 hover:border-white transition-all duration-300"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  // UI nếu đã đăng nhập
  return (
    <div className="px-6 py-8 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Thư viện</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#212121] rounded-lg">
          <h3 className="font-bold">Bài hát đã thích</h3>
        </div>
      </div>
    </div>
  );
}

export default Library;
