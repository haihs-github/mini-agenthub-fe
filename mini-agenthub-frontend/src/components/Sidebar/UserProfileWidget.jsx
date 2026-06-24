import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { FiLogOut } from "react-icons/fi";
import ConfirmModal from "../ConfirmModal"; // Nhúng hộp thoại xác nhận đồng bộ giao diện tối Cyber
import { useLanguage } from "../../context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ

// BKAV HaiHS : Component widget hiển thị thông tin người dùng và nút đăng xuất ở cuối sidebar - start
const UserProfileWidget = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái điều khiển đóng mở hộp thoại xác nhận
  const { t } = useLanguage(); // BKAV HaiHS: Khai báo hàm dịch thuật

  const navigate = useNavigate();

  // Xử lý dọn sạch mã xác thực và đưa trình duyệt về trang chủ để nạp biểu mẫu đăng nhập
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Xóa bỏ mã token bảo mật khỏi bộ nhớ cục bộ thiết bị
    if (logout) {
      logout(); // Kích hoạt hàm xóa trạng thái đăng nhập trong AuthContext
    }
    navigate("/"); // Chuyển hướng về trang gốc để AppContentSwitcher tự render LoginForm
    setIsModalOpen(false);
  };

  return (
    <div className="mt-auto p-4 border-t border-gray-200 dark:border-[#1e293b]/60 flex items-center justify-between bg-gray-50 dark:bg-[#0a0e18] select-none shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* AVATAR TRÍCH XUẤT 2 KÝ TỰ ĐẦU THEO TÊN ĐẦY ĐỦ CỦA USER */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex justify-center items-center font-bold text-white uppercase shrink-0 shadow-lg">
          {user?.fullname ? user.fullname.substring(0, 2).toUpperCase() : "US"}
        </div>

        {/* THÔNG TIN HỒ SƠ CHI TIẾT */}
        <div className="flex flex-col overflow-hidden text-left">
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate capitalize transition-colors duration-300">
            {user?.fullname || user?.email?.split("@")[0] || "superadmin"}
          </span>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mt-0.5 transition-colors duration-300">
            {/* BKAV HaiHS : Dịch nhãn vai trò người dùng - start */}
            {user?.role || t("hub_member")}
            {/* BKAV HaiHS : Dịch nhãn vai trò người dùng - end */}
          </span>
        </div>
      </div>

      {/* BKAV HaiHS : Dịch tiêu đề nút đăng xuất và sự kiện click - start */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        title={t("signOut")}
        className="p-2 rounded-xl hover:bg-red-500/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer"
      >
        <FiLogOut size={16} />
      </button>
      {/* BKAV HaiHS : Dịch tiêu đề nút đăng xuất và sự kiện click - end */}

      {/* BKAV HaiHS : Hộp thoại xác nhận đăng xuất dịch thuật - start */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSignOut}
        title={t("confirm_signout_title")}
        message={t("confirm_signout_msg")}
        confirmText={t("agree_signout_btn")}
        cancelText={t("go_back_btn")}
        type="warning"
      />
      {/* BKAV HaiHS : Hộp thoại xác nhận đăng xuất dịch thuật - end */}
    </div>
  );
};
// BKAV HaiHS : Component widget hiển thị thông tin người dùng và nút đăng xuất ở cuối sidebar - end

export default UserProfileWidget;
