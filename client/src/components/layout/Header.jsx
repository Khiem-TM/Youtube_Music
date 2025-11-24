import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
const Header = ({ onToggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { user, logout, login, register } = useAuth();
  return (
    <header className="flex items-center justify-between h-16 px-4 lg:px-6 bg-dark-900 text-white border-b border-gray-700">
      {/* trái --> btn + logo */}
      <div className="flex items-center gap-4 min-w-max">
        {/* Menu Icon (Hamburger) */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo Container */}
        <div className="flex items-center gap-1 cursor-pointer select-none">
          <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-white translate-x-[1px]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {/* Logo Text */}
          <span className="text-[22px] font-bold tracking-tighter relative -top-[1px]">
            Music
          </span>
        </div>
      </div>

      {/* search bar */}
      <div className="flex-1 max-w-[640px] mx-4 hidden sm:block">
        <div className="group flex items-center w-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] border border-transparent rounded-lg h-10 px-3 transition-all duration-200">
          {/*  Icon */}
          <svg
            className="w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Input Field */}
          {/* call API for searching */}
          <input
            type="text"
            placeholder="Search songs, albums, artists, podcasts"
            className="w-full bg-transparent border-none outline-none text-white ml-3 placeholder-[#909090] text-[15px] font-medium"
          />
        </div>
      </div>

      {/* action - tkhoan/ cart --- */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-max">
        {/* Cast Button  */}
        <button className="p-2 hover:bg-white/10 rounded-full transition text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 17h18M3 21l3-3m-3 3h18"
            />
            <path
              d="M3 13a4 4 0 014 4m-4-8a8 8 0 018 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>

        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="w-8 h-8 rounded-full bg-black border border-gray-700 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <span className="text-[10px] font-bold text-gray-300">2024</span>
        </button>
      </div>
      {/* Modal Profile khi chưa đăng nhập */}
      {profileOpen && !user && (
        <>
          <button
            aria-label="overlay"
            onClick={() => setProfileOpen(false)}
            className="fixed inset-0 bg-black/0"
          />
          <div className="fixed top-16 right-4 z-50 w-80 bg-dark-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-black border border-gray-700 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-gray-300">2024</span>
              </div>
              <div className="text-sm text-gray-400 mb-4">Đăng nhập để truy cập nhiều tính năng hơn</div>
              <button 
                onClick={() => {
                  setProfileOpen(false);
                  setAuthModalOpen(true);
                  setIsLogin(true);
                }}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Đăng nhập
              </button>
              <div className="text-xs text-gray-500 mt-3">
                Chưa có tài khoản? 
                <button 
                  onClick={() => {
                    setProfileOpen(false);
                    setAuthModalOpen(true);
                    setIsLogin(false);
                  }}
                  className="text-blue-400 hover:text-blue-300 ml-1"
                >
                  Đăng ký
                </button>
              </div>
            </div>
            <div className="border-t border-gray-700" />
            <div className="py-2">
              <div className="px-4 py-2 text-xs text-gray-500">
                Đăng nhập để truy cập các tính năng:
              </div>
              <div className="flex items-center gap-3 px-4 py-2">
                <span className="text-sm text-gray-400">• Lưu nhạc yêu thích</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2">
                <span className="text-sm text-gray-400">• Tạo playlist riêng</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2">
                <span className="text-sm text-gray-400">• Đồng bộ thiết bị</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Đăng nhập/Đăng ký */}
      {authModalOpen && (
        <>
          <button 
            aria-label="overlay" 
            onClick={() => setAuthModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 bg-dark-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 text-center">
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </h2>
              
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Họ tên</label>
                  <input
                    type="text"
                    value={authData.name}
                    onChange={(e) => setAuthData({...authData, name: e.target.value})}
                    className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    placeholder="Nhập họ tên"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    value={authData.confirmPassword}
                    onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                    className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    placeholder="Xác nhận mật khẩu"
                  />
                </div>
              )}
              
              <button
                onClick={async () => {
                  try {
                    if (isLogin) {
                      await login(authData.email, authData.password);
                    } else {
                      await register({
                        name: authData.name,
                        email: authData.email,
                        password: authData.password,
                        confirmPassword: authData.confirmPassword
                      });
                    }
                    setAuthModalOpen(false);
                    setAuthData({ name: "", email: "", password: "", confirmPassword: "" });
                  } catch (error) {
                    console.error("Auth error:", error);
                  }
                }}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </button>
              
              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">
                  {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                </span>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {isLogin ? "Đăng ký" : "Đăng nhập"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
