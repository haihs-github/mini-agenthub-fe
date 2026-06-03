import React, { useState } from "react";
import { FiChevronDown, FiCpu } from "react-icons/fi";

// BKAV HaiHS : Component header của workspace chat, chứa trạng thái kết nối và dropdown chọn model AI - start
const ChatHeader = ({ selectedModel, setSelectedModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  // các model ai
  const models = [
    {
      id: "meta-llama/llama-4-scout-17b-16e-instruct",
      name: "meta-llama/llama-4-scout-17b-16e-instruct)",
      desc: "Siêu tốc độ, tối ưu hội thoại",
    },
    {
      id: "flowise",
      name: "Flowise Agent",
      desc: "Hệ thống AI quy trình kéo thả",
    },
  ];
  // Lấy tên model đang chọn để hiển thị trên nút dropdown
  const currentModelName =
    models.find((m) => m.id === selectedModel)?.name || "Chọn Model AI";

  return (
    <div className="h-16 border-b border-[#1e293b]/60 flex items-center justify-between px-6 bg-[#0b0f19]/80 backdrop-blur-md z-10 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-sm font-semibold text-gray-200">
          Hệ thống trợ lý AI sẵn sàng
        </span>
      </div>

      {/* DROPDOWN CHỌN MODEL*/}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#161b26] border border-[#232d42] hover:border-gray-600 text-xs font-semibold px-4 py-2 rounded-xl transition-all text-gray-300 cursor-pointer"
        >
          <FiCpu className="text-blue-400" />
          <span>{currentModelName}</span>
          <FiChevronDown
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-[#161b26] border border-[#232d42] rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 hover:bg-[#1e293b] flex flex-col transition-colors ${
                  selectedModel === model.id
                    ? "bg-[#1e293b]/60 border-l-2 border-blue-500"
                    : ""
                }`}
              >
                <span className="text-xs font-bold text-white">
                  {model.name}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {model.desc}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// BKAV HaiHS : Component header của workspace chat, chứa trạng thái kết nối và dropdown chọn model AI - end

export default ChatHeader;
