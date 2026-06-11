import React from "react";
import { FiMoon, FiSun, FiChevronDown } from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext"; // Bốc hook quản lý theme toàn cục về phân khu cài đặt

// BKAV HaiHS: Linh kiện tùy chỉnh giao diện và ngôn ngữ hệ thống hỗ trợ toggle theme thời gian thực
const Personalization = () => {
  const { theme, setTheme } = useTheme(); // Khai báo lấy trạng thái theme hiện tại và hàm cập nhật màu nền

  return (
    <div className="space-y-4 animate-fade-in select-none">
      <div className="flex items-center gap-2 text-white font-bold text-sm">
        <span className="text-gray-400 text-lg">🔮</span>
        <h4>Personalization</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: INTERFACE THEME (Đấu nối sự kiện click đổi màu nền) */}
        <div className="md:col-span-2 bg-[#161b26] border border-[#232d42] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold tracking-widest text-blue-400/80 uppercase">
              Visual Style
            </span>
            <h5 className="text-xs font-bold text-white tracking-wide">
              Interface Theme
            </h5>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Adjust the workspace appearance to reduce eye strain or match your
              lighting environment.
            </p>
          </div>

          {/* Cụm điều khiển nút bấm toggle đổi giao diện */}
          <div className="flex bg-[#0b0f19] border border-[#232d42] p-1 rounded-xl h-[40px] items-center max-w-xs">
            {/* NÚT DARK THEME */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex-1 h-full rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-[#1e293b] text-white shadow-md"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FiMoon size={13} />
              <span>Dark</span>
            </button>

            {/* NÚT LIGHT THEME */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex-1 h-full rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-[#e2e8f0] text-[#0f172a] font-black shadow-md"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FiSun size={13} />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* CARD 2: LANGUAGE SELECTION */}
        <div className="bg-[#161b26] border border-[#232d42] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold tracking-widest text-blue-400/80 uppercase">
              Global
            </span>
            <h5 className="text-xs font-bold text-white tracking-wide">
              Language
            </h5>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Set your preferred communication language.
            </p>
          </div>

          <div className="w-full relative">
            <div className="w-full bg-[#0b0f19] border border-[#232d42] text-xs font-bold text-gray-200 px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-gray-700 transition-all">
              <span>English (US)</span>
              <FiChevronDown size={14} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalization;
