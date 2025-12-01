import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MusicPlayer from "../player/MusicPlayer";
import { usePlayer } from "../../contexts/PlayerContext";

function Layout({ children }) {
  // Khởi tạo trạng thái tĩnh - cục bộ --> đồng thời xét tt sidebar
  // Biến sidebarCollapsed kiểm tra xem sidebar có ở trạng thái thu gọn hay không
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { state, actions } = usePlayer();
  const player = state;
  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* part1 */}
      <Header onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />

      {/* part2 */}
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } border-r border-gray-700 hidden md:block transition-[width] duration-200`}
        >
          <Sidebar collapsed={sidebarCollapsed} />
        </aside>
        {/* main */}
        {/*  truyền children để cập nhật component :V  */}
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      </div>

      {/* part3 */}
      {player.isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-black/80 backdrop-blur">
          <MusicPlayer
            player={{
              isPlaying: player.isPlaying,
              currentTime: player.currentTime,
              duration: player.duration,
              repeatMode: player.repeatMode,
              shuffle: player.shuffle,
              volume: player.volume,
              track: {
                title: player.track?.title || player.track?.name || "",
                artist: Array.isArray(player.track?.artists)
                  ? player.track.artists.join(", ")
                  : player.track?.artist || player.track?.creator || "",
                thumbnailUrl:
                  (Array.isArray(player.track?.thumbnails)
                    ? player.track.thumbnails[0]
                    : player.track?.thumbnailUrl || player.track?.thumb) || "",
                audioUrl: player.track?.audioUrl || "",
                views: player.track?.views || 0,
                likes: player.track?.likes || 0,
              },
            }}
            onPrev={actions.prev}
            onNext={actions.next}
            onPlayPause={actions.togglePlay}
            onSetVolume={actions.setVolume}
            onCycleRepeat={actions.cycleRepeat}
            onToggleShuffle={actions.toggleShuffle}
          />
        </div>
      )}
    </div>
  );
}

export default Layout;
