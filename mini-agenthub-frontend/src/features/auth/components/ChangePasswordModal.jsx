import React, { useState } from "react";
import { FiX, FiKey, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { changePasswordApi } from "../authApi";
import { useToast } from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

// BKAV HaiHS: Component đổi mật khẩu - start
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subConfirm, setSubConfirm] = useState({ isOpen: false, type: "" });

  if (!isOpen) return null;

  // Kiểm tra thời gian thực xem tất cả các trường đã điền đủ và mật khẩu mới trùng khớp chưa
  const isFormFilled = oldPassword && newPassword && confirmPassword;
  const isPasswordMatched = newPassword === confirmPassword;
  const isButtonDisabled = !isFormFilled || !isPasswordMatched || isSubmitting;

  // Xử lý kiểm tra bẫy xác nhận trước khi đóng hoặc hủy modal form
  const handleCancelClick = () => {
    if (oldPassword || newPassword || confirmPassword) {
      setSubConfirm({ isOpen: true, type: "cancel" });
    } else {
      onClose();
    }
  };

  // Kích hoạt mở hộp thoại xác nhận đồng ý cập nhật mật khẩu lên hệ thống
  const handleUpdateClick = (e) => {
    e.preventDefault();
    if (isButtonDisabled) return;
    setSubConfirm({ isOpen: true, type: "save" });
  };

  // Thực hiện gọi API gửi dữ liệu thay đổi lên máy chủ Backend
  const executeChangePassword = async () => {
    setIsSubmitting(true);
    setSubConfirm({ isOpen: false, type: "" });

    try {
      await changePasswordApi({ oldPassword, newPassword });
      showToast("Thay đổi mật khẩu tài khoản thành công!", "success");
      onClose(); // Đóng modal biểu mẫu nếu đổi thành công
    } catch (err) {
      // Giữ nguyên thông tin đã nhập tại popup khi xảy ra lỗi từ phía API
      showToast(
        err?.response?.data?.message || "Mật khẩu hiện tại không chính xác!",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = () => {
    if (subConfirm.type === "save") executeChangePassword();
    if (subConfirm.type === "cancel") {
      setSubConfirm({ isOpen: false, type: "" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4 animate-fade-in">
      {/* BKAV HaiHS: Điều chỉnh màu nền và đường viền của Card Modal - Sáng: bg-white / Tối: bg-[#161b26] */}
      <div className="w-full max-w-md bg-white border border-gray-200 dark:bg-[#161b26] dark:border-[#232d42] rounded-2xl p-6 shadow-2xl relative space-y-6 transition-colors duration-300">
        {/* Tiêu đề biểu mẫu và nút dấu X đóng nhanh góc phải */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#232d42]/60 pb-4 select-none transition-colors duration-300">
          {/* BKAV HaiHS: Đổi màu chữ tiêu đề theo theme */}
          <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wide transition-colors duration-300">
            Update Password
          </h3>
          <button
            type="button"
            onClick={handleCancelClick}
            className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleUpdateClick} className="space-y-4">
          {/* TRƯỜNG 1: CURRENT PASSWORD */}
          <div className="space-y-1.5">
            {/* BKAV HaiHS: Sửa màu nền khung bọc input */}
            <div className="relative bg-gray-50 border border-gray-200 dark:bg-[#0b0f19] dark:border-[#232d42] rounded-xl flex items-center px-4 py-2.5 focus-within:border-blue-500/40 transition-all">
              <FiKey
                className="text-gray-400 dark:text-gray-500 shrink-0"
                size={14}
              />
              {/* BKAV HaiHS: Điều chỉnh màu văn bản và placeholder */}
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Current Password"
                className="flex-1 bg-transparent border-0 focus:outline-none text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 pl-3 pr-2 transition-colors duration-300"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer shrink-0"
              >
                {showOld ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
          </div>

          {/* TRƯỜNG 2: NEW PASSWORD */}
          <div className="space-y-1.5">
            <div className="relative bg-gray-50 border border-gray-200 dark:bg-[#0b0f19] dark:border-[#232d42] rounded-xl flex items-center px-4 py-2.5 focus-within:border-blue-500/40 transition-all">
              <FiLock
                className="text-gray-400 dark:text-gray-500 shrink-0"
                size={14}
              />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="flex-1 bg-transparent border-0 focus:outline-none text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 pl-3 pr-2 transition-colors duration-300"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer shrink-0"
              >
                {showNew ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
          </div>

          {/* TRƯỜNG 3: CONFIRM NEW PASSWORD */}
          <div className="space-y-1.5">
            {/* BKAV HaiHS: Đồng bộ màu viền trạng thái bình thường sang cấu trúc Sáng/Tối */}
            <div
              className={`relative bg-gray-50 border dark:bg-[#0b0f19] rounded-xl flex items-center px-4 py-2.5 focus-within:border-blue-500/40 transition-all ${confirmPassword && !isPasswordMatched ? "border-red-500/50" : "border-gray-200 dark:border-[#232d42]"}`}
            >
              <FiLock
                className="text-gray-400 dark:text-gray-500 shrink-0"
                size={14}
              />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="flex-1 bg-transparent border-0 focus:outline-none text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 pl-3 pr-2 transition-colors duration-300"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer shrink-0"
              >
                {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            {confirmPassword && !isPasswordMatched && (
              <p className="text-[10px] text-red-500 dark:text-red-400 font-medium pl-1 animate-fade-in">
                Mật khẩu xác nhận không trùng khớp với mật khẩu mới
              </p>
            )}
          </div>

          {/* KHU VỰC CỤM NÚT ĐIỀU KHIỂN CHÂN TRANG POPUP */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-[#232d42]/40 select-none transition-colors duration-300">
            {/* BKAV HaiHS: Sửa đổi màu chữ và nền hover nút Cancel cho tiệp lớp nền Sáng */}
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isSubmitting}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white px-4 py-2 rounded-xl dark:hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            {/* BKAV HaiHS: Cấu hình lại màu background nút Submit khi rơi vào trạng thái disabled ở nền sáng */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-[#0f131f] dark:disabled:text-gray-600 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:shadow-none transition-colors duration-300"
            >
              {isSubmitting && (
                <FiLoader size={12} className="animate-spin text-blue-400" />
              )}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Hộp thoại bẫy lớp xác nhận hành vi an toàn lồng trong modal */}
      <ConfirmModal
        isOpen={subConfirm.isOpen}
        onClose={() => setSubConfirm({ isOpen: false, type: "" })}
        onConfirm={handleConfirmAction}
        title={
          subConfirm.type === "save"
            ? "Xác nhận đổi mật khẩu"
            : "Xác nhận hủy tác vụ"
        }
        message={
          subConfirm.type === "save"
            ? "Bạn có chắc chắn muốn tiến hành thay đổi mật khẩu truy cập hệ thống không?"
            : "Mọi thông tin mật khẩu vừa nhập sẽ bị xóa bỏ hoàn toàn. Bạn có chắc chắn muốn thoát không?"
        }
        confirmText={
          subConfirm.type === "save" ? "Đồng ý thay đổi" : "Đồng ý hủy"
        }
        cancelText="Quay lại"
        type={subConfirm.type === "save" ? "info" : "warning"}
      />
    </div>
  );
};
// BKAV HaiHS: Component đổi mật khẩu - end

export default ChangePasswordModal;
