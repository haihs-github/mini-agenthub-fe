import React from "react";
import { FiMoon, FiSun, FiChevronDown } from "react-icons/fi";

// BKAV HaiHS: Component tùy chỉnh giao diện và ngôn ngữ hệ thống - start
const Personalization = () => {
  return (
    <div className="space-y-4 animate-fade-in select-none">
      <div className="flex items-center gap-2 text-white font-bold text-sm">
        <span className="text-gray-400 text-lg">🔮</span>
        <h4>Personalization</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: INTERFACE THEME (Chiếm 2 cột hàng ngang) */}
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

          <div className="flex bg-[#0b0f19] border border-[#232d42] p-1 rounded-xl h-[40px] items-center max-w-xs">
            <button
              type="button"
              className="flex-1 h-full rounded-lg bg-[#1e293b] text-white shadow-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiMoon size={13} />
              <span>Dark</span>
            </button>
            <button
              type="button"
              className="flex-1 h-full rounded-lg text-gray-500 hover:text-gray-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
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
// BKAV HaiHS: Component tùy chỉnh giao diện và ngôn ngữ hệ thống - end

export default Personalization;
