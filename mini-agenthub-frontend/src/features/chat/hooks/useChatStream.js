// file này chứa custom Hook quản lý logic chat stream và hội thoại, giúp tách biệt rõ ràng phần logic nghiệp vụ với phần UI trình bày

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getConversationsApi,
  getConversationDetailApi,
  createConversationApi,
} from "../chatApi";

// Hàm giải mã/lọc dữ liệu SSE nếu gặp chuỗi thô từ DB cũ (legacy data)
const cleanSSEContent = (content) => {
  if (!content || !content.includes("data: ")) return content;

  let accumulated = "";
  const lines = content.split("\n");
  for (const line of lines) {
    const cleanedLine = line.trim();
    if (!cleanedLine || !cleanedLine.startsWith("data: ")) continue;

    const dataStr = cleanedLine.replace("data: ", "").trim();
    if (dataStr === "[DONE]") continue;

    try {
      const parsed = JSON.parse(dataStr);
      if (parsed.choices?.[0]?.delta?.content !== undefined) {
        accumulated += parsed.choices[0].delta.content;
      } else if (parsed.content !== undefined) {
        if (
          typeof parsed.content === "string" &&
          parsed.content.startsWith("data: ")
        ) {
          const innerStr = parsed.content.replace("data: ", "").trim();
          const innerParsed = JSON.parse(innerStr);
          accumulated += innerParsed.choices?.[0]?.delta?.content || "";
        } else {
          accumulated += parsed.content;
        }
      }
    } catch (e) {
      // Bỏ qua dòng bị lỗi parse
    }
  }
  return accumulated || content;
};

// BKAV HaiHS : Custom Hook quản lý logic Chat Stream & Hội thoại - start
export const useChatStream = (initialActiveId = "new-chat") => {
  const [activeId, setActiveId] = useState(initialActiveId);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  // Các trạng thái bổ trợ nghiệp vụ
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false); // Trạng thái AI đang nhả chữ
  const [isWaitingSkeleton, setIsWaitingSkeleton] = useState(false); // Trạng thái AI đang suy nghĩ
  const [attachedImages, setAttachedImages] = useState([]); // Lưu ảnh preview tạm thời

  // Dùng Ref để lưu trữ AbortController, phục vụ chức năng bấm "Dừng" chat
  const abortControllerRef = useRef(null);

  // 1. Hàm lấy danh sách hội thoại (Cuộn vô hạn)
  const fetchConversations = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      if (isLoadingHistory) return;
      setIsLoadingHistory(true);
      try {
        const res = await getConversationsApi(pageNum, 20);

        // Tự động dò mảng danh sách từ mọi kiểu bọc dữ liệu của BE
        const fetchedList = res?.data || (Array.isArray(res) ? res : []);

        if (isLoadMore) {
          setConversations((prev) => [...prev, ...fetchedList]);
        } else {
          setConversations(fetchedList);
        }

        if (fetchedList.length < 20) setHasMore(false);
        setPage(pageNum);
      } catch (err) {
        console.error("Không thể lấy lịch sử hội thoại", err);
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [isLoadingHistory],
  );

  // Tự động load trang đầu tiên khi mở ứng dụng
  useEffect(() => {
    fetchConversations(1, false);
  }, []);

  // 2. Hàm chuyển hội thoại & lấy tin nhắn cũ
  const selectConversation = async (id) => {
    if (isStreaming) handleStopStream();

    setActiveId(id);
    setAttachedImages([]);

    if (id === "new-chat") {
      setMessages([]);
      return;
    }

    setIsWaitingSkeleton(true);
    try {
      const res = await getConversationDetailApi(id);

      // Dò tìm mảng lịch sử tin nhắn cũ chuẩn xác, chặn đứng lỗi undefined
      const oldMessages =
        res?.data?.messages || res?.messages || (Array.isArray(res) ? res : []);

      const cleanedMessages = oldMessages.map((msg) => ({
        ...msg,
        content:
          msg.role === "assistant" ? cleanSSEContent(msg.content) : msg.content,
      }));
      setMessages(cleanedMessages);
    } catch (err) {
      console.error("Lỗi lấy chi tiết tin nhắn", err);
    } finally {
      setIsWaitingSkeleton(false);
    }
  };

  // 3. Hàm kích hoạt chức năng Dừng (Stop Generation)
  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Phát tín hiệu ngắt kết nối HTTP
      setIsStreaming(false);
      setIsWaitingSkeleton(false);
    }
  };

  // 4. CORE CHAT: Hàm gửi câu hỏi & Đọc dữ liệu Stream SSE phẳng chuẩn chỉnh
  const sendMessage = async (prompt, modelName) => {
    if (!prompt.trim() || isStreaming) return;

    const imagesToSend = [...attachedImages];
    let currentId = activeId;
    setIsWaitingSkeleton(true);
    setIsStreaming(true);

    if (currentId === "new-chat") {
      try {
        const titleProposal =
          prompt.length > 25 ? prompt.substring(0, 25) + "..." : prompt;
        const newRoom = await createConversationApi(titleProposal);

        const roomData = newRoom?.data || newRoom;
        currentId = roomData?.id;

        if (!currentId) {
          throw new Error(
            "Không bóc tách được ID phòng mới từ cấu trúc phản hồi của BE",
          );
        }

        setActiveId(currentId);
        setConversations((prev) => [roomData, ...prev]);
      } catch (err) {
        console.error("Không thể khởi tạo hội thoại ngầm dưới BE", err);
        setIsStreaming(false);
        setIsWaitingSkeleton(false);
        return;
      }
    }

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: prompt,
      images: imagesToSend.map((img) => img.preview),
    };
    setMessages((prev) => [...prev, userMsg]);
    setAttachedImages([]);

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("modelName", modelName);

    imagesToSend.forEach((img) => {
      formData.append("images", img.fileObj);
    });

    abortControllerRef.current = new AbortController();
    const token = localStorage.getItem("token");

    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const response = await fetch(
        `${baseUrl}/conversations/${currentId}/chat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          signal: abortControllerRef.current.signal,
        },
      );

      if (!response.ok) throw new Error("Đường truyền API Chat thất bại");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      const aiMsgId = Date.now() + 1;
      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: "assistant", content: "", isStreaming: true },
      ]);
      setIsWaitingSkeleton(false);

      let accumulatedText = "";
      let streamBuffer = ""; // BIẾN CỨU CÁNH: Bộ đệm chắp vá các mảnh dữ liệu bị cắt nửa dòng

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Cộng dồn dữ liệu thô vào bộ đệm mạng
        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split("\n");

        // Giữ lại dòng cuối cùng dở dang chưa có ký tự xuống dòng (\n) sang chunk sau xử lý tiếp
        streamBuffer = lines.pop() || "";

        for (const line of lines) {
          const cleanedLine = line.trim();
          if (!cleanedLine || !cleanedLine.startsWith("data: ")) continue;

          const dataStr = cleanedLine.replace("data: ", "").trim();
          if (dataStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(dataStr);
            let textToken = "";

            //  CHIẾN LƯỢC ĐA PHÒNG THỦ: Trích xuất chữ bất kể Backend đang chạy phiên bản nào
            if (parsed.content) {
              // Kịch bản A: Lỡ Backend bị bọc kép dạng { content: 'data: {"choices":...}' }
              if (
                typeof parsed.content === "string" &&
                parsed.content.startsWith("data: ")
              ) {
                try {
                  const innerStr = parsed.content.replace("data: ", "").trim();
                  const innerParsed = JSON.parse(innerStr);
                  textToken = innerParsed.choices?.[0]?.delta?.content || "";
                } catch (e) {
                  textToken = parsed.content;
                }
              } else {
                // Kịch bản B: Backend trả về chuẩn sạch dạng { content: "từ_chữ" }
                textToken = parsed.content;
              }
            } else if (parsed.choices?.[0]?.delta?.content !== undefined) {
              // Kịch bản C: Backend bắn thẳng cấu hình thô OpenAI/Groq SDK
              textToken = parsed.choices[0].delta.content;
            }

            // Tiến hành cập nhật thời gian thực lên màn hình bong bóng chat
            if (textToken) {
              accumulatedText += textToken;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMsgId
                    ? { ...msg, content: accumulatedText }
                    : msg,
                ),
              );
            }
          } catch (e) {
            // Im lặng bỏ qua lỗi parse nếu dòng dữ liệu chưa hoàn chỉnh hẳn
          }
        }
      }

      // STREAM KẾT THÚC THÀNH CÔNG
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, isStreaming: false, modelName, responseTime: "1.2s" }
            : msg,
        ),
      );

      setConversations((prev) => {
        const target = prev.find((c) => c.id === currentId);
        if (!target) return prev;
        const filtered = prev.filter((c) => c.id !== currentId);
        return [target, ...filtered];
      });
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Người dùng chủ động nhấn dừng Stream.");
      } else {
        console.error("Lỗi trong quá trình đọc Stream chữ chạy:", err);
      }
    } finally {
      setIsStreaming(false);
      setIsWaitingSkeleton(false);
      abortControllerRef.current = null;
    }
  };
  // BKAV HaiHS : Custom Hook quản lý logic Chat Stream & Hội thoại - end

  return {
    activeId,
    conversations,
    messages,
    hasMore,
    isLoadingHistory,
    isStreaming,
    isWaitingSkeleton,
    attachedImages,
    setAttachedImages,
    setConversations,
    selectConversation,
    fetchConversations,
    sendMessage,
    handleStopStream,
    page,
  };
};
