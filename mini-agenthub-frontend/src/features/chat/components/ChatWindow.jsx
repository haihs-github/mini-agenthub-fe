import React, { useState } from "react";
import ChatHeader from "./ChatWorkspace/ChatHeader";
import MessageList from "./ChatWorkspace/MessageList";
import ChatInputArea from "./ChatWorkspace/ChatInputArea";
// BKAV HaiHS : Component chính của workspace chat, kết hợp header, danh sách tin nhắn và khu vực nhập liệu - start
const ChatWindow = ({
  messages,
  isStreaming,
  isWaitingSkeleton,
  sendMessage,
  handleStopStream,
  attachedImages,
  setAttachedImages,
}) => {
  // Quản lý trạng thái chọn Model mặc định ban đầu là Llama3.1
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

      {/* 2. Danh sách tin nhắn kèm Auto-scroll & Skeleton */}
      <MessageList messages={messages} isWaitingSkeleton={isWaitingSkeleton} />

      {/* 3. Ô nhập liệu đa năng */}
      <ChatInputArea
        onSendMessage={(prompt) => sendMessage(prompt, selectedModel)}
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
