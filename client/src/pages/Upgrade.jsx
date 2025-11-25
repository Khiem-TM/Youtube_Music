import React from "react";
import {
  FiMusic,
  FiDownload,
  FiPlay,
  FiUser,
  FiUsers,
  FiCheck,
  FiBook,
} from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";

function FeatureItem({ icon: Icon, title, desc, color }) {
  const iconColorClass = color.replace("bg-", "text-");

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-4 group">
      <div
        className={`w-16 h-16 rounded-full ${color} bg-opacity-20 flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110`}
      >
        {Icon && <Icon className={`w-8 h-8 ${iconColorClass}`} />}
      </div>
      <h3 className="text-white font-bold text-lg max-w-[200px]">{title}</h3>
      <p className="text-gray-400 text-sm max-w-[250px] leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function PlanCard({ icon: Icon, name, price, note, subNote }) {
  return (
    <div className="rounded-2xl bg-[#212121] p-6 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-white/5 border border-transparent hover:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-800 rounded-full">
          {Icon && <Icon className="w-5 h-5 text-gray-200" />}
        </div>
        <h3 className="text-white text-xl font-bold">{name}</h3>
      </div>

      <div className="flex-grow space-y-1 mb-6">
        <div className="text-gray-200 text-sm font-medium">{price}</div>
        <div className="text-gray-400 text-xs">{note}</div>
        {subNote && (
          <div className="text-gray-500 text-[10px] mt-2">{subNote}</div>
        )}
      </div>

      <button className="w-full py-2.5 rounded-full bg-[#3ea6ff] hover:bg-[#6dbcfc] text-black font-semibold text-sm transition-colors shadow-[0_0_15px_rgba(62,166,255,0.3)] hover:shadow-[0_0_20px_rgba(62,166,255,0.5)]">
        Dùng thử 1 tháng miễn phí
      </button>
    </div>
  );
}

function Upgrade() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-red-500 selection:text-white overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-[#4a2a4a] via-[#1a1a1a] to-black opacity-60 blur-3xl -z-10 pointer-events-none" />

      <section className="px-6 pt-20 pb-24 text-center space-y-8 max-w-4xl mx-auto animate-fade-in-up">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
            <FaYoutube size={18} />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            Music Premium
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Nghe nhạc không quảng cáo,
          <br className="hidden md:block" /> ngoại tuyến & tắt màn hình
        </h1>

        <p className="text-gray-300 text-lg">
          Dùng thử 1 tháng với giá ₫0 • Sau đó ₫65.000/tháng • Chưa bao gồm VAT
          • Hủy bất cứ lúc nào
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="px-8 py-3 rounded-full bg-[#3ea6ff] hover:bg-[#6dbcfc] text-black font-bold text-sm shadow-lg shadow-blue-900/20 transition-all transform hover:scale-105">
            Dùng thử 1 tháng với giá ₫0
          </button>
        </div>

        <div className="text-xs text-[#3ea6ff] hover:underline cursor-pointer mt-4">
          Hoặc tiết kiệm tiền với gói gia đình hoặc sinh viên
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-16 max-w-3xl mx-auto">
          Hơn 100 triệu bài hát, video, màn trình diễn trực tiếp và hơn thế nữa
          trong tầm tay bạn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureItem
            icon={FiMusic}
            color="bg-green-500"
            title="Nghe nhạc không quảng cáo"
            desc="Thưởng thức âm nhạc và video không bị gián đoạn bởi quảng cáo."
          />
          <FeatureItem
            icon={FiDownload}
            color="bg-blue-500"
            title="Tải xuống và đi"
            desc="Nghe nhạc ngoại tuyến yêu thích của bạn mọi lúc, mọi nơi."
          />
          <FeatureItem
            icon={FiPlay}
            color="bg-purple-500"
            title="Phát trong nền"
            desc="Tiếp tục nghe nhạc khi sử dụng các ứng dụng khác hoặc tắt màn hình."
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Chọn gói hội viên phù hợp với bạn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlanCard
            icon={FiUser}
            name="Cá nhân"
            price="₫65.000/tháng"
            note="1 tháng dùng thử ₫0 • Chưa bao gồm VAT"
            subNote="Áp dụng các hạn chế."
          />
          <PlanCard
            icon={FiUsers}
            name="Gia đình"
            price="₫99.000/tháng"
            note="1 tháng dùng thử ₫0 • Chưa bao gồm VAT"
            subNote="Thêm tối đa 5 thành viên gia đình (từ 13 tuổi trở lên) trong cùng hộ gia đình."
          />
          <PlanCard
            icon={FiBook}
            name="Sinh viên"
            price="₫35.000/tháng"
            note="1 tháng dùng thử ₫0 • Chưa bao gồm VAT"
            subNote="Chỉ dành cho sinh viên đủ điều kiện. Yêu cầu xác minh hàng năm."
          />
        </div>
      </section>

      {/* --- CONTENT BLOCKS (ZIGZAG) --- */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-32">
        {/* Block 1: Text Left - Image Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              YouTube Music theo cách của bạn
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Khám phá các bản mix dựa trên âm nhạc bạn yêu thích và hàng ngàn
              danh sách phát được tuyển chọn phù hợp với mọi tâm trạng hoặc thời
              điểm.
            </p>
          </div>
          <div className="relative h-[300px] w-full group">
            <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-br from-yellow-600 to-red-600 rounded-lg opacity-80 transform rotate-3 blur-sm transition-all duration-500 group-hover:rotate-6 group-hover:opacity-100"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="bg-gray-800 h-32 rounded-lg opacity-80"></div>
                <div className="bg-gray-700 h-32 rounded-lg mt-8 opacity-80"></div>
                <div className="bg-gray-700 h-32 rounded-lg -mt-8 opacity-80"></div>
                <div className="bg-gray-800 h-32 rounded-lg opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:justify-end order-2 md:order-1">
            <div className="w-[280px] h-[550px] bg-black border-4 border-gray-800 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-4">
              <div className="w-full h-full bg-gray-900 rounded-[2rem] flex flex-col relative">
                <div className="h-2/3 bg-gradient-to-b from-blue-900 to-black p-6 flex flex-col justify-end">
                  <div className="w-40 h-40 bg-gray-700 rounded shadow-lg mx-auto mb-6"></div>
                  <div className="h-4 w-3/4 bg-gray-700 rounded mb-2 mx-auto"></div>
                  <div className="h-3 w-1/2 bg-gray-800 rounded mx-auto"></div>
                </div>
                <div className="h-1/3 bg-black p-6 flex items-center justify-center gap-6">
                  <FiPlay className="text-white w-12 h-12" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Tùy chỉnh trải nghiệm nghe của bạn
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Kết hợp các nghệ sĩ yêu thích của bạn, tinh chỉnh âm nhạc của
              riêng bạn và để thuật toán của chúng tôi làm phần còn lại.
            </p>
            <ul className="space-y-3">
              {[
                "Tạo đài phát thanh của riêng bạn",
                "Khám phá các bản phối lại",
                "Nghe danh sách phát cộng đồng",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-300 gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                    <FiCheck className="text-white w-3 h-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-800 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FaYoutube className="text-gray-500" size={20} />
            <span className="text-gray-500 font-semibold">Music</span>
          </div>
          <div className="text-gray-600 text-sm">
            © 2024 Google LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Upgrade;
