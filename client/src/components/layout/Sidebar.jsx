import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiMusic,
  FiHeart,
  FiClock,
  FiPlus,
} from "react-icons/fi";

function Sidebar({ collapsed = false }) {
  const location = useLocation();

  // Danh sach items ben sidebar
  const menuItems = [
    { path: "/", label: "Home", icon: FiHome },
    { path: "/explore", label: "Explore", icon: FiCompass },
    { path: "/library", label: "Library", icon: FiMusic },
    { path: "/upgrade", label: "Upgrade", icon: FiHeart },
  ];

  // Map API
  const playlists = [
    // TODO: Ta cần thực hiện nối API
    { path: "/liked", label: "Liked Music", note: "Auto playlist" },
    { path: "/study", label: "Chill for study", note: "Truong Manh Khiem" },
    { path: "/hiphop", label: "HIPHOP", note: "Truong Manh Khiem" },
    { path: "/later", label: "Episodes for Later", note: "Auto playlist" },
  ];

  return (
    <div className="h-full bg-dark-900 text-gray-300">
      <div
        className={`${
          collapsed ? "justify-center p-4" : "gap-2 p-4"
        } flex items-center`}
      ></div>
      <nav className="p-2">
        <div className="space-y-1">
          {/* Lấy ra mục yêu thích - 3 con đầu tiên */}
          {menuItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  collapsed ? "justify-center" : "gap-3"
                } px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "bg-white/10 text-white" : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}

          <Link
            to="/upgrade"
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } px-3 py-2 rounded-lg hover:bg-white/10`}
          >
            <FiMusic className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">Upgrade</span>}
          </Link>
        </div>

        <div className="my-4">
          <button
            className={`w-full flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } px-3 py-2 rounded-lg border border-white/5 hover:bg-white/10`}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
              <FiPlus className="w-4 h-4" />
            </span>
            {!collapsed && (
              <span className="text-sm font-medium">New playlist</span>
            )}
          </button>
        </div>

        {!collapsed && (
          <div className="space-y-1">
            {playlists.map((p) => (
              <Link
                key={p.path}
                to={p.path}
                className="block px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <div className="text-sm text-white">{p.label}</div>
                <div className="text-xs text-gray-400">{p.note}</div>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
