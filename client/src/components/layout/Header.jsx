import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiUser,
  FiPlay,
  FiChevronRight,
  FiLogOut,
  FiUpload,
  FiClock,
  FiSettings,
  FiShield,
  FiHelpCircle,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";
import searchService from "../../services/searchService";
const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const {
    user,
    logout,
    login,
    register,
    updateProfile,
    changePassword,
    loading,
    error,
  } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      setProfileOpen(false);
      setAuthModalOpen(true);
      setIsLogin(e.detail?.mode !== "register");
    };
    window.addEventListener("open-auth-modal", handler);
    return () => window.removeEventListener("open-auth-modal", handler);
  }, []);

  // Handle search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const suggestions = await searchService.getSuggestions(searchQuery);
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Lỗi lấy gợi ý tìm kiếm:", error);
        setSearchSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results page or handle search
      console.log("Search for:", searchQuery);
      setShowSuggestions(false);
      // You can navigate to search results page here
    }
  };
  return (
    <header className="flex items-center justify-between h-16 px-4 lg:px-6 bg-dark-900 text-white border-b border-gray-700">
      {/* trái --> btn + logo */}
      <div className="flex items-center gap-4 min-w-max">
        {/* Menu Icon  */}
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
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
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
      <div className="flex-1 max-w-[640px] mx-4 hidden sm:block relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="group flex items-center w-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] border border-transparent rounded-lg h-10 px-3 transition-all duration-200">
            {/* Search Icon */}
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
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.length >= 2 && setShowSuggestions(true)
              }
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search songs, albums, artists, podcasts"
              className="w-full bg-transparent border-none outline-none text-white ml-3 placeholder-[#909090] text-[15px] font-medium"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-gray-400 hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-dark-700 cursor-pointer text-sm"
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-gray-700 rounded-lg shadow-lg z-50 p-2">
            <div className="text-center text-gray-400 text-sm">
              Đang tìm kiếm...
            </div>
          </div>
        )}
      </div>

      {/* action - tkhoan/ cart --- */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-max">
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
          {/* Tạo ra 1 overlay phủ toàn màn hình --> click = đóng modal */}
          <button
            aria-label="overlay"
            onClick={() => setProfileOpen(false)}
            className="fixed inset-0 bg-black/0"
          />
          <div className="fixed top-16 right-4 z-50 w-80 bg-dark-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-black border border-gray-700 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-gray-300">Log In</span>
              </div>
              <div className="text-sm text-gray-400 mb-4">
                Đăng nhập để truy cập nhiều tính năng hơn
              </div>
              {/* Mở form đăng nhập */}
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
                {/* Mở form đăng kí */}
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
          </div>
        </>
      )}
      {/* modal khi đang trong phiên đăng nhập */}
      {profileOpen && user && (
        <>
          <button
            aria-label="overlay"
            onClick={() => setProfileOpen(false)}
            className="fixed inset-0 bg-black/0"
          />
          <div className="fixed top-16 right-4 z-50 w-80 bg-dark-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black border border-gray-700 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-300">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  {user.name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700" />
            <div className="py-2">
              <button
                onClick={() => {
                  setProfileForm({
                    name: user.name || "",
                    email: user.email || "",
                  });
                  setProfileEditOpen(true);
                  setProfileOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left"
              >
                <FiUser className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Your channel</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left">
                <FiPlay className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Get Music Premium</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left">
                <span className="text-sm flex-1">Switch account</span>
                <FiChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left"
              >
                <FiLogOut className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
            <div className="border-t border-gray-700" />
            <div className="py-2">
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left">
                <FiUpload className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Upload music</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left">
                <FiClock className="w-5 h-5 text-gray-300" />
                <span className="text-sm">History</span>
              </button>
              <button
                onClick={() => {
                  setChangePasswordOpen(true);
                  setProfileOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left"
              >
                <FiSettings className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Settings</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left">
                <FiShield className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Terms & privacy policy</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left">
                <FiHelpCircle className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Help</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left">
                <FiMessageSquare className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Send feedback</span>
              </button>
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
                  <label className="block text-sm text-gray-400 mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={authData.name}
                    onChange={(e) =>
                      setAuthData({ ...authData, name: e.target.value })
                    }
                    className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    placeholder="Nhập họ tên"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={authData.email}
                  onChange={(e) =>
                    setAuthData({ ...authData, email: e.target.value })
                  }
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="email@example.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={authData.password}
                  onChange={(e) =>
                    setAuthData({ ...authData, password: e.target.value })
                  }
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    value={authData.confirmPassword}
                    onChange={(e) =>
                      setAuthData({
                        ...authData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    placeholder="Xác nhận mật khẩu"
                  />
                </div>
              )}

              {error && (
                <div className="text-red-400 text-sm mb-3 text-center">
                  {error}
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
                        confirmPassword: authData.confirmPassword,
                      });
                    }
                    setAuthModalOpen(false);
                    setAuthData({
                      name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                    });
                  } catch (error) {
                    console.error("Auth error:", error);
                  }
                }}
                disabled={loading}
                className={`w-full ${
                  loading
                    ? "bg-primary-500/60"
                    : "bg-primary-500 hover:bg-primary-600"
                } text-white py-3 px-4 rounded-lg font-medium transition-colors`}
              >
                {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
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

      {profileEditOpen && (
        <>
          <button
            aria-label="overlay"
            onClick={() => setProfileEditOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 bg-dark-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 text-center">
                Cập nhật thông tin
              </h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="email@example.com"
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    await updateProfile(profileForm);
                    setProfileEditOpen(false);
                  } catch (error) {}
                }}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </>
      )}

      {changePasswordOpen && (
        <>
          <button
            aria-label="overlay"
            onClick={() => setChangePasswordOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 bg-dark-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 text-center">
                Đổi mật khẩu
              </h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    await changePassword(passwordForm);
                    setChangePasswordOpen(false);
                  } catch (error) {}
                }}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
