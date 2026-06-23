import React, { useState } from "react";
import { FiSend, FiPaperclip, FiSquare, FiX } from "react-icons/fi";
import { useToast } from "../../../../components/Toast";
import { useLanguage } from "../../../../context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ

// BKAV HaiHS : Component khu vực nhập liệu và gửi câu hỏi trong workspace chat, hỗ trợ đính kèm ảnh và trạng thái đang trả lời - start
const ChatInputArea = ({
  onSendMessage,
  isStreaming,
  onStopStream,
  attachedImages,
  setAttachedImages,
}) => {
  const { showToast } = useToast();
  const { t } = useLanguage(); // BKAV HaiHS: Khai báo hàm dịch thuật
  const [prompt, setPrompt] = useState("");
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        showToast(
          t("toast_image_only") ||
            "Hệ thống chỉ hỗ trợ đính kèm tệp tin hình ảnh!",
          "warning",
        );
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAttachedImages((prev) => [
        ...prev,
        { fileObj: file, preview: previewUrl },
      ]);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(attachedImages[indexToRemove].preview);
    setAttachedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isStreaming) {
      onStopStream();
      return;
    }
    if (!prompt.trim()) return;

    onSendMessage(prompt.trim());
    setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-[#0b0f19] border-t border-gray-200 dark:border-[#1e293b]/60 shrink-0 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto relative bg-white border border-gray-200 dark:bg-[#161b26] dark:border-[#232d42] rounded-2xl focus-within:border-blue-500/50 transition-all shadow-2xl overflow-hidden px-4 py-3"
      >
        {/* 1. KHAY HIỂN THỊ XEM TRƯỚC ẢNH ĐÍNH KÈM */}
        {attachedImages.length > 0 && (
          <div className="flex flex-wrap gap-2.5 pb-3 border-b border-gray-100 dark:border-[#232d42]/60 mb-2 animate-fade-in transition-colors">
            {attachedImages.map((imgObj, idx) => (
              <div
                key={idx}
                className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 dark:border-[#2d3748] group shadow-inner"
              >
                <img
                  src={imgObj.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <FiX size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 2. Ô NHẬP TEXTAREA + NÚT CHỨC NĂNG CHÂN TRANG */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-all cursor-pointer"
            title={t("attach_image") || "Đính kèm hình ảnh"}
          >
            <FiPaperclip size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            accept="image/*"
          />

          <textarea
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              t("chat_placeholder") || "Nhập nội dung câu hỏi tại đây..."
            }
            className="flex-1 bg-transparent border-0 focus:outline-none resize-none text-sm text-gray-900 dark:text-gray-100 max-h-36 placeholder-gray-400 dark:placeholder-gray-600 leading-6 py-1.5 transition-colors"
            style={{ height: "auto" }}
          />

          <button
            type="submit"
            disabled={!isStreaming && !prompt.trim()}
            className={`p-2.5 rounded-full transition-all flex justify-center items-center cursor-pointer shadow-lg ${
              isStreaming
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200 dark:disabled:bg-[#0f131f] disabled:text-gray-400 dark:disabled:text-gray-700 disabled:shadow-none"
            }`}
          >
            {isStreaming ? (
              <FiSquare size={14} fill="white" />
            ) : (
              <FiSend size={14} />
            )}
          </button>
        </div>
      </form>
      {/* BKAV HaiHS: Sửa màu chữ cảnh báo cuối trang */}
      <div className="text-center text-[10px] text-gray-500 dark:text-gray-600 tracking-wide mt-2 transition-colors">
        {t("ai_disclaimer") ||
          "Hệ thống trí tuệ nhân tạo có thể đưa ra câu trả lời chưa chính xác, vui lòng kiểm tra lại nguồn dữ liệu."}
      </div>
    </div>
  );
};
// BKAV HaiHS : Component khu vực nhập liệu và gửi câu hỏi trong workspace chat, hỗ trợ đính kèm ảnh và trạng thái đang trả lời - end

export default ChatInputArea;
