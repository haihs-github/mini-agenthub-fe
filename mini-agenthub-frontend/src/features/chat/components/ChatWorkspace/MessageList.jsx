import React, { useEffect, useRef } from "react";
import UserMessageItem from "./UserMessageItem";
import AIMessageItem from "./AIMessageItem";

// BKAV HaiHS : Component danh sách tin nhắn trong workspace chat - start
const MessageList = ({ messages, isWaitingSkeleton }) => {
  const messagesEndRef = useRef(null);

  // Kỹ thuật Auto-scroll đóng băng góc nhìn luôn nằm ở đáy khung chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaitingSkeleton]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 bg-[#0b0f19]">
      {messages.length === 0 && !isWaitingSkeleton ? (
        /* GIAO DIỆN MÀN HÌNH CHÀO MỪNG TRỐNG (WELCOME SCREEN) */
        <div className="h-full flex flex-col justify-center items-center text-center opacity-40 select-none animate-fade-in">
          <span className="text-6xl mb-4">🧠</span>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Mini Agent Hub Workspace
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs leading-5">
            Hãy chọn một mô hình AI và gửi câu hỏi đầu tiên để bắt đầu cuộc trò
            chuyện đột phá bứt phá.
          </p>
        </div>
      ) : (
        /* VÒNG LẶP RENDER TIN NHẮN THEO DANH TÍNH */
        messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessageItem key={msg.id} message={msg} />
          ) : (
            <AIMessageItem key={msg.id} message={msg} />
          ),
        )
      )}

      {/* 🌟 HIỆU ỨNG SKELETON AI SUY NGHĨ NHẤP NHÁY (GIỐNG CHATGPT CHUẨN DESIGN) */}
      {isWaitingSkeleton && (
        <div className="flex gap-4 max-w-[80%] mr-auto animate-pulse">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex justify-center items-center text-sm shrink-0">
            🤖
          </div>
          <div className="flex flex-col gap-2.5 flex-1 pt-1">
            <div className="h-3.5 bg-[#161b26] border border-[#232d42] rounded-md w-[90%]"></div>
            <div className="h-3.5 bg-[#161b26] border border-[#232d42] rounded-md w-[65%]"></div>
          </div>
        </div>
      )}

      {/* Div mốc neo giữ auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};
// BKAV HaiHS : Component danh sách tin nhắn trong workspace chat - end

export default MessageList;
