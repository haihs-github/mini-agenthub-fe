import React, { useState } from "react";
import { FiKey, FiTrash2, FiUserX, FiLogOut, FiLoader } from "react-icons/fi";
import ChangePasswordModal from "../../auth/components/ChangePasswordModal";
import ConfirmModal from "../../../components/ConfirmModal";
import { clearAllChatHistoryApi } from "../../chat/chatApi";
import { deleteAccountApi } from "../../users/userApi";
import { useToast } from "../../../components/Toast";
import { useAuth } from "../../auth/AuthContext";

// BKAV HaiHS: Component bảo mật tài khoản - start
const AccountSecurity = ({ setConversations }) => {
  const { showToast } = useToast();
  const { login } = useAuth();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false); // Trạng thái kiểm soát modal xác nhận đăng xuất

  const [isClearing, setIsClearing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Xử lý gọi API dọn dẹp lịch sử tin nhắn của phòng chat
  const handleExecuteClearHistory = async () => {
    setIsClearing(true);
    try {
      await clearAllChatHistoryApi();
      showToast("Xóa toàn bộ lịch sử cuộc hội thoại thành công!", "success");
      if (setConversations) setConversations([]);
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Trục trặc hệ thống khi tiến hành xóa lịch sử",
        "error",
      );
    } finally {
      setIsClearing(false);
      setIsClearModalOpen(false);
    }
  };

  // Thực hiện gọi API xóa vĩnh viễn tài khoản và giải phóng bộ nhớ cookie
  const handleExecuteDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountApi();
      showToast(
        "Tài khoản của bạn đã được xóa vĩnh viễn khỏi hệ thống!",
        "success",
      );
      localStorage.removeItem("token");
      if (login) login(null);
      window.location.href = "/";
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Không thể thực hiện xóa tài khoản do lỗi phân quyền",
        "error",
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // BKAV HaiHS: Xử lý đăng xuất tài khoản, xóa sạch token cục bộ để khóa đường truyền bảo mật
  const handleExecuteSignOut = () => {
    localStorage.removeItem("token"); // Xóa bỏ mã token xác thực khỏi bộ nhớ thiết bị
    if (login) {
      login(null); // Làm rỗng trạng thái user đăng nhập tại AuthContext để đá ra khay LoginForm
    }
    window.location.href = "/"; // Điều hướng trình duyệt quay về trang chủ gốc an toàn
    setIsSignOutModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in select-none">
      <div className="flex items-center gap-2 text-white font-bold text-sm">
        <span className="text-gray-400 text-lg">🛡️</span>
        <h4>Account & Security</h4>
      </div>

      <div className="bg-[#161b26] border border-[#232d42] rounded-2xl p-5 divide-y divide-[#232d42]/60 shadow-xl">
        {/* ROW 1: PASSWORD & SECURITY */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <FiKey size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs font-bold text-white">
                Password & Security
              </h5>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                Enable 2FA for better security.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-4 py-1.5 bg-[#1e2533] border border-[#232d42] hover:bg-gray-800 text-[11px] font-bold text-blue-400 rounded-full transition-all shrink-0 shadow-md cursor-pointer"
          >
            Update
          </button>
        </div>

        {/* ROW 2: CLEAR CHAT HISTORY */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-orange-400 shrink-0 shadow-inner">
              <FiTrash2 size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs font-bold text-white">
                Clear Chat History
              </h5>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                Permanently delete all your conversation data across the system.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            disabled={isClearing}
            className="px-5 py-1.5 bg-transparent border border-orange-500/30 text-orange-400 text-[11px] font-bold rounded-full hover:bg-orange-500/5 transition-all shrink-0 shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
          >
            {isClearing && (
              <FiLoader size={12} className="animate-spin text-orange-500" />
            )}
            <span>Clear</span>
          </button>
        </div>

        {/* ROW 3: DELETE ACCOUNT */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-red-400 shrink-0 shadow-inner">
              <FiUserX size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs font-bold text-white">Delete Account</h5>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                Permanently remove your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
            className="px-5 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-[11px] font-bold rounded-full transition-all shrink-0 shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
          >
            {isDeleting && (
              <FiLoader size={12} className="animate-spin text-white" />
            )}
            <span>Delete</span>
          </button>
        </div>

        {/* ROW 4: SIGN OUT (Mở hộp thoại bẫy xác nhận khi bấm Sign Out) */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-gray-400 shrink-0 shadow-inner">
              <FiLogOut size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs font-bold text-white">Sign Out</h5>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                End your current session and securely log out of the interface.
              </p>
            </div>
          </div>
          {/* BKAV HaiHS: Gán onClick mở modal chốt xác nhận đăng xuất */}
          <button
            type="button"
            onClick={() => setIsSignOutModalOpen(true)}
            className="px-4 py-1.5 bg-[#1a202c] border border-[#232d42] text-gray-400 hover:text-white text-[11px] font-bold rounded-full transition-all shrink-0 shadow-md cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleExecuteClearHistory}
        title="Xác nhận xóa lịch sử chat"
        message="Hành động này sẽ loại bỏ vĩnh viễn toàn bộ danh sách các phòng chat và tin nhắn cũ của bạn ra khỏi máy chủ. Bạn có chắc chắn muốn tiếp tục không?"
        confirmText="Đồng ý xóa sạch"
        cancelText="Quay lại"
        type="danger"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleExecuteDeleteAccount}
        title="CẢNH BÁO: XÓA TÀI KHOẢN VĨNH VIỄN"
        message="Hệ thống sẽ tiến hành xóa bỏ toàn bộ thông tin hồ sơ cá nhân, các nhóm quyền và lịch sử hội thoại của bạn. Hành động này không thể hoàn tác, bạn sẽ bị đăng xuất lập tức. Bạn vẫn muốn tiếp tục chứ?"
        confirmText="Tôi chắc chắn, xóa tài khoản"
        cancelText="Hủy bỏ quay lại"
        type="danger"
      />

      {/* BKAV HaiHS: Hộp thoại chốt chặn an toàn hỏi ý kiến người dùng trước khi hủy phiên làm việc */}
      <ConfirmModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleExecuteSignOut}
        title="Xác nhận đăng xuất tài khoản"
        message="Bạn có chắc chắn muốn kết thúc phiên làm việc hiện tại và đăng xuất khỏi hệ thống quản trị Agent Hub không?"
        confirmText="Đồng ý đăng xuất"
        cancelText="Quay lại"
        type="warning"
      />
    </div>
  );
};
// BKAV HaiHS: Component bảo mật tài khoản - end

export default AccountSecurity;
