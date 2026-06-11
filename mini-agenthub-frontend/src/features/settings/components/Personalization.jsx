import React from "react";
import { FiMoon, FiSun, FiChevronDown } from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";

// BKAV HaiHS: Linh kiện tùy chỉnh giao diện và ngôn ngữ hệ thống hỗ trợ toggle theme thời gian thực
const Personalization = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4 animate-fade-in select-none">
      <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm transition-colors duration-300">
        <span className="text-gray-400 text-lg">🔮</span>
        <h4>Personalization</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: INTERFACE THEME */}
        {/* BKAV HaiHS: Sửa nền, viền Card theo mode */}
        <div className="md:col-span-2 bg-white dark:bg-[#161b26] border border-gray-200 dark:border-[#232d42] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-colors duration-300">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400/80 uppercase">
              Visual Style
            </span>
            <h5 className="text-xs font-bold text-gray-900 dark:text-white tracking-wide transition-colors">
              Interface Theme
            </h5>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium transition-colors">
              Adjust the workspace appearance to reduce eye strain or match your
              lighting environment.
            </p>
          </div>

          {/* BKAV HaiHS: Sửa nền, viền cụm nút điều khiển toggle */}
          <div className="flex bg-gray-100 dark:bg-[#0b0f19] border border-gray-200 dark:border-[#232d42] p-1 rounded-xl h-[40px] items-center max-w-xs transition-colors">
            {/* NÚT DARK THEME */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex-1 h-full rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ? "bg-white dark:bg-[#e2e8f0] text-gray-900 dark:text-[#0f172a] font-black shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <FiSun size={13} />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* CARD 2: LANGUAGE SELECTION */}
        {/* BKAV HaiHS: Sửa nền, viền Card theo mode */}
        <div className="bg-white dark:bg-[#161b26] border border-gray-200 dark:border-[#232d42] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-colors duration-300">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400/80 uppercase">
              Global
            </span>
            <h5 className="text-xs font-bold text-gray-900 dark:text-white tracking-wide transition-colors">
              Language
            </h5>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium transition-colors">
              Set your preferred communication language.
            </p>
          </div>

          <div className="w-full relative">
            {/* BKAV HaiHS: Sửa màu nền input giả định */}
            <div className="w-full bg-gray-50 dark:bg-[#0b0f19] border border-gray-200 dark:border-[#232d42] text-xs font-bold text-gray-900 dark:text-gray-200 px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-gray-400 dark:hover:border-gray-700 transition-all">
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
