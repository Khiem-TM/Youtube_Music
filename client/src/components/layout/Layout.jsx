import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MusicPlayer from "../player/MusicPlayer";

function Layout({ children }) {
  // Khởi tạo trạng thái tĩnh - cục bộ --> đồng thời xét tt sidebar
  // Biến sidebarCollapsed kiểm tra xem sidebar có ở trạng thái thu gọn hay không
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* part3 */}
      <div className="border-t border-gray-700 bg-black/80 backdrop-blur">
        <MusicPlayer />
      </div>
    </div>
  );
}

export default Layout;
