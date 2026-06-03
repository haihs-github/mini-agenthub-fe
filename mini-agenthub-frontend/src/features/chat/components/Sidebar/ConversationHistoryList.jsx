import React, { useState, useEffect, useRef } from "react";
import ConversationItem from "./ConversationItem";
import { FiPlus, FiAlertTriangle, FiLoader } from "react-icons/fi";
import {
  updateConversationTitleApi,
  deleteConversationApi,
} from "../../chatApi";
import { useToast } from "../../../../components/Toast";

// BKAV HaiHS : Component danh sách lịch sử hội thoại trong sidebar - start
const ConversationHistoryList = ({
  conversations,
  setConversations,
  activeId,
  selectConversation,
  hasMore,
  isLoadingHistory,
  fetchConversations,
  page,
}) => {
  const { showToast } = useToast();

  // Các State phục vụ đóng mở Modal Đổi tên / Xóa
  const [targetConv, setTargetConv] = useState(null);
  const [modalType, setModalType] = useState(null); // 'rename' hoặc 'delete'
  const [newTitle, setNewTitle] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Khai báo Ref cắm vào đáy danh sách để bẫy sự kiện cuộn chuột
  const loadMoreRef = useRef(null);

  // KÍCH HOẠT INFINITE SCROLL BẰNG INTERSECTION OBSERVER CHUẨN GOOGLE
  useEffect(() => {
    if (!hasMore || isLoadingHistory) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Khi div đáy lọt vào tầm nhìn của mắt người dùng -> Tự tải trang kế tiếp
          fetchConversations(page + 1, true);
        }
      },
      { threshold: 1.0 },
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingHistory, page, fetchConversations]);

  // Xử lý Gửi lệnh Đổi tên lên BE
  const handleRenameSubmit = async () => {
    if (!newTitle.trim() || newTitle === targetConv.title) return;
    setIsActionLoading(true);
    try {
      await updateConversationTitleApi(targetConv.id, newTitle.trim());
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConv.id ? { ...c, title: newTitle.trim() } : c,
        ),
      );
      showToast("Đã đổi tên hội thoại thành công!", "success");
      setModalType(null);
    } catch (err) {
      showToast("Đổi tên thất bại, vui lòng thử lại!", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Xử lý Gửi lệnh Xóa lên BE
  const handleDeleteSubmit = async () => {
    setIsActionLoading(true);
    try {
      await deleteConversationApi(targetConv.id);
      setConversations((prev) => prev.filter((c) => c.id !== targetConv.id));
      showToast("Đã xóa cuộc hội thoại thành công!", "success");

      // Nếu xóa trúng phòng đang xem, tự động đá người dùng về phòng mới rỗng
      if (activeId === targetConv.id) {
        selectConversation("new-chat");
      }
      setModalType(null);
    } catch (err) {
      showToast("Không thể xóa hội thoại, lỗi hệ thống!", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* NÚT THÊM HỘI THOẠI MỚI CHUẨN DESIGN */}
      <div className="px-4 py-3">
        <button
          onClick={() => selectConversation("new-chat")}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/10 cursor-pointer"
        >
          <FiPlus size={16} />
          <span>Đoạn hội thoại mới</span>
        </button>
      </div>

      {/* VÙNG CUỘN DANH SÁCH LỊCH SỬ */}
      <div className="flex-1 overflow-y-auto space-y-1.5 py-2 scrollbar-thin scrollbar-thumb-gray-800">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={activeId === conv.id}
            onSelect={selectConversation}
            onOpenRename={(c) => {
              setTargetConv(c);
              setNewTitle(c.title);
              setModalType("rename");
            }}
            onOpenDelete={(c) => {
              setTargetConv(c);
              setModalType("delete");
            }}
          />
        ))}

        {/* DIV ĐÁY NHẬN DIỆN LOAD MORE PHÂN TRANG */}
        <div
          ref={loadMoreRef}
          className="h-10 w-full flex justify-center items-center"
        >
          {isLoadingHistory && (
            <FiLoader className="animate-spin text-blue-500 text-lg" />
          )}
        </div>
      </div>

      {/* =========================================================================
          HỆ THỐNG POPUP MODAL XÁC NHẬN SỬA / XÓA DÙNG HOOK THUẦN (AN TOÀN TUYỆT ĐỐI)
          ========================================================================= */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-[#161b26] border border-[#232d42] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-yellow-500">
              <FiAlertTriangle size={24} />
              <h3 className="text-lg font-bold text-white">
                {modalType === "rename"
                  ? "Đổi tên cuộc trò chuyện"
                  : "Cảnh báo xóa dữ liệu"}
              </h3>
            </div>

            <p className="text-sm text-gray-400">
              {modalType === "rename"
                ? "Nhập tên tiêu đề mới cho phòng chat này của bạn:"
                : `Bạn có chắc chắn muốn xóa đoạn hội thoại "${targetConv?.title}" không? Hành động này không thể hoàn tác.`}
            </p>

            {modalType === "rename" && (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#0f131f] border border-[#232d42] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                placeholder="Nhập tên mới..."
              />
            )}

            <div className="flex justify-end gap-3 pt-2 text-sm font-semibold">
              <button
                onClick={() => setModalType(null)}
                disabled={isActionLoading}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={
                  modalType === "rename"
                    ? handleRenameSubmit
                    : handleDeleteSubmit
                }
                disabled={
                  isActionLoading ||
                  (modalType === "rename" && !newTitle.trim())
                }
                className={`px-4 py-2 rounded-xl text-white transition-colors flex items-center gap-2 cursor-pointer ${
                  modalType === "rename"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isActionLoading && <FiLoader className="animate-spin" />}
                <span>Xác nhận</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// BKAV HaiHS : Component danh sách lịch sử hội thoại trong sidebar - start

export default ConversationHistoryList;
