import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

// BKAV HaiHS : Component Popup xác nhận hành động nguy hiểm - start
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  type = "danger",
}) => {
  if (!isOpen) return null;

  // Xác định màu sắc chủ đạo theo loại thông báo (danger: đỏ, warning: vàng, info: xanh)
  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fade-in">
      <div className="w-full max-w-sm bg-[#1a202c] border border-[#2d3748] rounded-2xl shadow-2xl overflow-hidden">
        {/* Đầu thông báo */}
        <div className="px-5 py-4 border-b border-[#2d3748] flex justify-between items-center bg-[#111622]/40">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <FiAlertTriangle
              className={isDanger ? "text-red-500" : "text-amber-500"}
              size={16}
            />
            <span>{title}</span>
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Nội dung tin nhắn tùy biến */}
        <div className="p-5">
          <p className="text-sm text-gray-300 leading-relaxed">{message}</p>
        </div>

        {/* Cặp nút hành động cuối trang */}
        <div className="px-5 py-3.5 bg-[#111622]/40 border-t border-[#2d3748] flex justify-end items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white bg-[#1a202c] border border-[#2d3748] hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-md cursor-pointer ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/10"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/10"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
// BKAV HaiHS : Component Popup xác nhận hành động nguy hiểm - end

export default ConfirmModal;
