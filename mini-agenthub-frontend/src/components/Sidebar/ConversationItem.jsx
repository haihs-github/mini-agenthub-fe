import React, { useState, useRef, useEffect } from "react";
import {
  FiMessageSquare,
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
  onOpenRename,
  onOpenDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Tự động đóng menu thả xuống nếu click ra ngoài vùng chọn
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group px-2">
      <button
        onClick={() => onSelect(conversation.id)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all text-left pr-12 ${
          isActive
            ? "bg-[#1e293b]/80 border border-[#3b82f6]/30 text-white font-semibold"
            : "text-gray-400 hover:bg-[#161b26] hover:text-gray-200"
        } ${showMenu ? "bg-[#161b26] text-white" : ""}`} // MẸO: Giữ nguyên màu hover khi đang mở tùy chọn
      >
        <FiMessageSquare
          size={16}
          className={`shrink-0 ${isActive ? "text-blue-400" : "text-gray-500"}`}
        />
        <span className="truncate flex-1">
          {conversation.title || "Đoạn hội thoại không tên"}
        </span>
      </button>

      {/* SỬA LỖI TẠI ĐÂY: Nếu showMenu bằng true, ép cứng trạng thái 'block' để không bị hidden khi rời chuột */}
      <div
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 ${
          showMenu ? "block" : "hidden group-hover:block"
        }`}
        ref={menuRef}
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); // Chặn sự kiện lan ra nút chọn phòng cha
            setShowMenu(!showMenu);
          }}
          className="p-1.5 rounded-lg hover:bg-[#2d3748] text-gray-400 hover:text-white transition-colors cursor-pointer block"
        >
          <FiMoreHorizontal size={16} />
        </button>

        {/* MENU THẢ XUỐNG CHI TIẾT TÍNH NĂNG */}
        {showMenu && (
          <div className="absolute right-0 mt-1 w-36 bg-[#1e2430] border border-[#2d3748] rounded-xl shadow-2xl py-1.5 animate-fade-in z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false); // Đóng menu luôn
                onOpenRename(conversation); // Kích hoạt popup đổi tên
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-[#2d3748] hover:text-white transition-colors text-left"
            >
              <FiEdit2 size={13} />
              Đổi tên
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false); // Đóng menu luôn
                onOpenDelete(conversation); // Kích hoạt popup xóa
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
            >
              <FiTrash2 size={13} />
              Xóa hội thoại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;
