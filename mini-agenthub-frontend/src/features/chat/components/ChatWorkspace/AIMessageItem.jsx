import React, { useState } from "react";
import { FiCopy, FiThumbsUp, FiCheck } from "react-icons/fi";
import { useToast } from "../../../../components/Toast";
import { RiRobotLine } from "react-icons/ri";
// BKAV HaiHS : Component hiển thị tin nhắn của AI trong workspace chat, hỗ trợ trạng thái đang trả lời, thông tin meta và nút tương tác like/copy - start
const AIMessageItem = ({ message }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  // Xử lý sao chép văn bản vào bộ nhớ đệm
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      showToast("Đã sao chép câu trả lời vào bộ nhớ tạm!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast("Không thể sao chép văn bản!", "error");
    }
  };

  return (
    <div className="flex gap-4 max-w-[85%] mr-auto animate-fade-in group">
      {/* AVATAR BOT ROBOT */}
      <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/30 flex justify-center items-center font-bold text-blue-400 shrink-0 shadow-inner">
        <RiRobotLine size={16} /> {/* Thay con robot cũ bằng con này */}
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {/* KHU VỰC HIỂN THỊ NỘI DUNG TEXT CHỮ CHẠY */}
        <div className="text-gray-200 text-sm leading-7 whitespace-pre-wrap selection:bg-blue-600/30 font-normal">
          {message.content || (
            <span className="text-gray-600 italic">
              Đang tải câu trả lời...
            </span>
          )}
        </div>

        {/* CHỈ HIỂN THỊ THÔNG TIN META VÀ NÚT BẤM KHI AI ĐÃ XỬ LÝ XONG (isStreaming === false) */}
        {!message.isStreaming && message.content && (
          <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-[#1e293b]/30 animate-fade-in">
            {/* Tên Model và Thời gian phản hồi */}
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
              <span className="uppercase tracking-wider font-bold text-gray-400">
                {message.modelName || "GROQ-AI"}
              </span>
              <span>•</span>
              <span>Thời gian phản hồi: {message.responseTime || "1.2s"}</span>
            </div>

            {/* Bộ đôi nút Tương tác */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  liked
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-gray-500 hover:text-gray-300 hover:bg-[#161b26]"
                }`}
                title="Hữu ích"
              >
                <FiThumbsUp size={14} />
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#161b26] transition-colors cursor-pointer"
                title="Sao chép câu trả lời"
              >
                {copied ? (
                  <FiCheck size={14} className="text-green-500" />
                ) : (
                  <FiCopy size={14} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// BKAV HaiHS : Component hiển thị tin nhắn của AI trong workspace chat, hỗ trợ trạng thái đang trả lời, thông tin meta và nút tương tác like/copy - end

export default AIMessageItem;
