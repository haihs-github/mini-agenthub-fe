import React from "react";

// BKAV HaiHS : Component hiển thị tin nhắn của người dùng trong workspace chat, hỗ trợ cả text và ảnh đính kèm - start
const UserMessageItem = ({ message }) => {
  return (
    <div className="flex flex-col items-end gap-2 max-w-[75%] ml-auto animate-slide-up">
      {/* 1. HIỂN THỊ MẢNG ẢNH ĐÃ ĐÍNH KÈM (NẾU CÓ) */}
      {message.images && message.images.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-end">
          {message.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Đính kèm từ người dùng"
              className="max-w-[200px] max-h-[150px] rounded-xl object-cover border border-[#232d42] shadow-md"
            />
          ))}
        </div>
      )}

      {/* 2. TEXT CHÍNH CỦA USER */}
      <div className="bg-[#1e293b] text-gray-100 rounded-2xl rounded-tr-none px-5 py-3.5 text-sm leading-relaxed shadow-lg border border-[#2d3748]/40 selection:bg-blue-500/30">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
// BKAV HaiHS : Component hiển thị tin nhắn của người dùng trong workspace chat, hỗ trợ cả text và ảnh đính kèm - end

export default UserMessageItem;
