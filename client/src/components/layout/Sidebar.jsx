import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiCompass,
  FiMusic,
  FiHeart,
  FiClock,
  FiPlus,
  FiStar,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import localSvc from "../../services/localPlaylistService";

function Sidebar({ collapsed = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Danh sach items ben sidebar
  const menuItems = [
    { path: "/", label: "Home", icon: FiHome },
    { path: "/explore", label: "Explore", icon: FiCompass },
    { path: "/library", label: "Library", icon: FiMusic },
  ];

  // local playlists
  const [playlists, setPlaylists] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    if (!user) return;
    localSvc.listMyPlaylists().then(setPlaylists).catch(()=>{})
  }, [user]);

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

          {user && (
            <Link
              to="/upgrade"
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-3 py-2 rounded-lg hover:bg-white/10`}
            >
              <FiStar className="w-5 h-5" />
              {!collapsed && (
                <span className="text-sm font-medium">Upgrade</span>
              )}
            </Link>
          )}
        </div>

        {user ? (
          <div className="my-4">
            <button
              className={`w-full flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-3 py-2 rounded-lg border border-white/5 hover:bg-white/10`}
              onClick={() => setShowCreate(true)}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                <FiPlus className="w-4 h-4" />
              </span>
              {!collapsed && (
                <span className="text-sm font-medium">New playlist</span>
              )}
            </button>
            {showCreate && (
              <div className="mt-3 space-y-2">
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="My Favourite Playlist" className="w-full bg-dark-800 border border-gray-700 rounded px-3 py-2 text-white" />
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded bg-white/10 text-white" onClick={()=>setShowCreate(false)}>Cancel</button>
                  <button className="px-3 py-2 rounded bg-primary-500 text-white" onClick={async ()=>{
                    try { const pl = await localSvc.createPlaylist(name); setShowCreate(false); setName(''); const next = await localSvc.listMyPlaylists(); setPlaylists(next); navigate(`/my-playlists/${pl._id}`) } catch(e){ alert('Không thể tạo playlist') }
                  }}>Create</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            {!collapsed && <div className="border-t border-gray-700 my-3" />}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }))
              }}
              className={`w-full ${
                collapsed ? "px-2" : "px-4"
              } h-10 rounded-full bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white`}
            >
              {!collapsed ? 'Đăng nhập' : '↪'}
            </button>
            {!collapsed && (
              <p className="text-[13px] text-gray-400 mt-3 leading-6">
                Đăng nhập để tạo và chia sẻ danh sách phát, nhận nội dung đề xuất dành riêng cho bạn và hơn thế nữa.
              </p>
            )}
          </div>
        )}

        {user && !collapsed && (
          <div className="space-y-1">
            {playlists.map((p) => (
              <Link key={p._id} to={`/my-playlists/${p._id}`} className="block px-3 py-2 rounded-lg hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <img src="/favicon.ico" alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm text-white">{p.name}</div>
                    <div className="text-xs text-gray-400">Playlist</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
