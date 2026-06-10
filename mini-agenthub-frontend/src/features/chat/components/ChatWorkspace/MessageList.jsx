import React, { useEffect, useRef, useState } from "react";
import { FiLoader } from "react-icons/fi";
import UserMessageItem from "./UserMessageItem";
import AIMessageItem from "./AIMessageItem";

// BKAV HaiHS : Component danh sách tin nhắn hỗ trợ phân trang cuộn ngược và đồng bộ ảnh khi refresh trang - start
const MessageList = ({
  activeConversationId,
  messages,
  isWaitingSkeleton,
  isStreaming,
  loadMoreMessages,
  hasMoreMessages,
  isLoadingMore,
}) => {
  const scrollContainerRef = useRef(null);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [isScrollToBottomNeeded, setIsScrollToBottomNeeded] = useState(true);

  const BASE_URL = "http://localhost:3000/";

  // Tự động cuộn xuống đáy khi có tin nhắn mới hoặc đang trong tiến trình AI đổ chữ stream
  useEffect(() => {
    if (scrollContainerRef.current && isScrollToBottomNeeded) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isStreaming, isWaitingSkeleton, isScrollToBottomNeeded]);

  // Giữ nguyên vị trí góc nhìn cuộn của người dùng sau khi prepend tin nhắn cũ thành công
  useEffect(() => {
    if (
      scrollContainerRef.current &&
      previousScrollHeight > 0 &&
      !isScrollToBottomNeeded
    ) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight - previousScrollHeight;
      setPreviousScrollHeight(0);
    }
  }, [messages, previousScrollHeight, isScrollToBottomNeeded]);

  // Theo dõi hành vi cuộn chuột để bắt sát ngưỡng đỉnh đầu 0px nhằm kích hoạt tải phân trang lịch sử cũ
  const handleScroll = async (e) => {
    const container = e.currentTarget;
    if (
      container.scrollTop === 0 &&
      hasMoreMessages &&
      !isLoadingMore &&
      loadMoreMessages &&
      activeConversationId
    ) {
      setIsScrollToBottomNeeded(false);
      setPreviousScrollHeight(container.scrollHeight);
      await loadMoreMessages(activeConversationId);
    } else if (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 50
    ) {
      setIsScrollToBottomNeeded(true);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[#0b0f19] cyber-scrollbar"
    >
      <style>{`
        .cyber-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .cyber-scrollbar::-webkit-scrollbar-track { background: #0b0f19; }
        .cyber-scrollbar::-webkit-scrollbar-thumb { background: #232d42; border-radius: 99px; }
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>

      {/* Hiển thị vòng xoay loading ở đỉnh đầu khi đang gọi kéo trang lịch sử cũ */}
      {isLoadingMore && (
        <div className="w-full flex justify-center py-2 animate-fade-in">
          <FiLoader size={16} className="text-blue-500 animate-spin" />
        </div>
      )}

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
        /* VÒNG LẶP RENDER TIN NHẮN THEO DANH TÍNH KÈM KHỐI CHUẨN HÓA ẢNH ĐÍNH KÈM */
        messages.map((msg) => {
          const isUser = msg.role === "user";

          // BKAV HaiHS: Hợp nhất ảnh lịch sử trường attachments từ BE và mảng ảnh chuỗi preview từ trạng thái local FE
          const imageUrls = [];
          if (msg.attachments && msg.attachments.length > 0) {
            msg.attachments.forEach((att) => {
              const path = att.filePath || "";
              imageUrls.push(
                path.startsWith("http") ? path : `${BASE_URL}${path}`,
              );
            });
          } else if (msg.images && msg.images.length > 0) {
            imageUrls.push(...msg.images);
          }

          // Khởi tạo một đối tượng message đã được đồng bộ toàn vẹn cả 2 khóa để truyền xuống linh kiện con
          const normalizedMsg = {
            ...msg,
            images: imageUrls,
            attachments:
              msg.attachments || imageUrls.map((url) => ({ filePath: url })),
          };

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full animate-fade-in`}
            >
              {isUser ? (
                <UserMessageItem message={normalizedMsg} />
              ) : (
                <AIMessageItem message={normalizedMsg} />
              )}

              {/* Tự động kết xuất khay ảnh bổ trợ nếu linh kiện con UserMessageItem chưa cấu hình bóc tách mảng */}
              {imageUrls.length > 0 &&
                (!msg.attachments || msg.attachments.length === 0) && (
                  <div
                    className={`grid grid-cols-1 gap-2 max-w-[70%] mt-2 ${isUser ? "mr-0" : "ml-12"}`}
                  >
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden border border-[#232d42] bg-[#0b0f19] shadow-2xl max-w-xs sm:max-w-sm"
                      >
                        <img
                          src={url}
                          alt="Attached content"
                          className="w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(url, "_blank")}
                        />
                      </div>
                    ))}
                  </div>
                )}
            </div>
          );
        })
      )}

      {/* HIỆU ỨNG SKELETON AI SUY NGHĨ NHẤP NHÁY (GIỐNG CHATGPT CHUẨN DESIGN) */}
      {isWaitingSkeleton && (
        <div className="flex gap-4 max-w-[80%] mr-auto animate-pulse">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex justify-center items-center text-sm shrink-0"></div>
          <div className="flex flex-col gap-2.5 flex-1 pt-1">
            <div className="h-3.5 bg-[#161b26] border border-[#232d42] rounded-md w-[90%]"></div>
            <div className="h-3.5 bg-[#161b26] border border-[#232d42] rounded-md w-[65%]"></div>
          </div>
        </div>
      )}
    </div>
  );
};
// BKAV HaiHS : Component danh sách tin nhắn hỗ trợ phân trang cuộn ngược và đồng bộ ảnh khi refresh trang - end

export default MessageList;
