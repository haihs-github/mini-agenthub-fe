import React from "react";

// BKAV HaiHS : Component hiển thị tin nhắn của người dùng trong workspace chat, hỗ trợ cả text và ảnh đính kèm - start
const UserMessageItem = ({ message }) => {
  return (
    <div className="flex flex-col items-end gap-2 max-w-[75%] ml-auto animate-slide-up">
      {/* 1. HIỂN THỊ MẢNG ẢNH ĐÃ ĐÍNH KÈM (NẾU CÓ) */}
      {message.images && message.images.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-end">
          {message.images.map((img, idx) => (
            /* BKAV HaiHS: Sửa viền ảnh đính kèm cho cả 2 mode */
            <img
              key={idx}
              src={img}
              alt="Đính kèm từ người dùng"
              className="max-w-[200px] max-h-[150px] rounded-xl object-cover border border-gray-200 dark:border-[#232d42] shadow-md transition-colors"
            />
          ))}
        </div>
      )}

      {/* 2. TEXT CHÍNH CỦA USER */}
      {/* BKAV HaiHS: Sửa màu nền và màu chữ bong bóng chat - Sáng: bg-blue-600/text-white / Tối: bg-[#1e293b]/text-gray-100 */}
      <div className="bg-blue-600 text-white dark:bg-[#1e293b] dark:text-gray-100 rounded-2xl rounded-tr-none px-5 py-3.5 text-sm leading-relaxed shadow-lg border border-transparent dark:border-[#2d3748]/40 selection:bg-blue-500/30 transition-colors duration-300">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
// BKAV HaiHS : Component hiển thị tin nhắn của người dùng trong workspace chat, hỗ trợ cả text và ảnh đính kèm - end

export default UserMessageItem;
