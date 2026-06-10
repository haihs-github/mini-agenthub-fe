import React, { useState } from "react";
import ChatHeader from "./ChatWorkspace/ChatHeader";
import MessageList from "./ChatWorkspace/MessageList";
import ChatInputArea from "./ChatWorkspace/ChatInputArea";

// BKAV HaiHS : Component chính của workspace chat, kết hợp header, danh sách tin nhắn và khu vực nhập liệu - start
const ChatWindow = ({
  activeConversationId, // Tiếp nhận mã định danh phòng chat hiện tại để phục vụ luồng cuộn phân trang
  messages,
  isStreaming,
  isWaitingSkeleton,
  sendMessage,
  handleStopStream,
  attachedImages,
  setAttachedImages,
  loadMoreMessages, // Tiếp nhận hàm gọi nạp thêm lịch sử tin nhắn cũ từ hook cha
  hasMoreMessages, // Tiếp nhận cờ kiểm tra xem hệ thống còn trang tin nhắn cũ nào không
  isLoadingMore, // Tiếp nhận trạng thái xoay vòng loading khi phân trang ngược
}) => {
  const [selectedModel, setSelectedModel] = useState(
    "meta-llama/llama-4-scout-17b-16e-instruct",
  );

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#0b0f19]">
      {/* 1. Thanh đầu trang chọn model AI */}
      <ChatHeader
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* 2. Danh sách tin nhắn kèm bộ điều phối cuộn vô hạn ngược dòng dữ liệu */}
      <MessageList
        activeConversationId={activeConversationId}
        messages={messages}
        isWaitingSkeleton={isWaitingSkeleton}
        isStreaming={isStreaming}
        loadMoreMessages={loadMoreMessages}
        hasMoreMessages={hasMoreMessages}
        isLoadingMore={isLoadingMore}
      />

      {/* 3. Ô nhập liệu đa năng */}
      <ChatInputArea
        onSendMessage={(prompt, images) =>
          sendMessage(prompt, selectedModel, images)
        }
        isStreaming={isStreaming}
        onStopStream={handleStopStream}
        attachedImages={attachedImages}
        setAttachedImages={setAttachedImages}
      />
    </div>
  );
};
// BKAV HaiHS : Component chính của workspace chat, kết hợp header, danh sách tin nhắn và khu vực nhập liệu - end

export default ChatWindow;
