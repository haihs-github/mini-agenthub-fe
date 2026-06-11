import React, { useState } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { FiLogOut } from "react-icons/fi";
import ConfirmModal from "../ConfirmModal"; // Nhúng hộp thoại xác nhận đồng bộ giao diện tối Cyber

// BKAV HaiHS : Component widget hiển thị thông tin người dùng và nút đăng xuất ở cuối sidebar - start
const UserProfileWidget = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái điều khiển đóng mở hộp thoại xác nhận

  // Xử lý dọn sạch mã xác thực và đưa trình duyệt về trang chủ để nạp biểu mẫu đăng nhập
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Xóa bỏ mã token bảo mật khỏi bộ nhớ cục bộ thiết bị
    if (logout) {
      logout(); // Kích hoạt hàm xóa trạng thái đăng nhập trong AuthContext
    }
    window.location.href = "/"; // Chuyển hướng về trang gốc để AppContentSwitcher tự render LoginForm
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
            {user?.role || "Thành viên Hub"}
          </span>
        </div>
      </div>

      {/* NÚT ĐĂNG XUẤT KÍCH HOẠT HỘP THOẠI POPUP */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        title="Đăng xuất tài khoản"
        className="p-2 rounded-xl hover:bg-red-500/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer"
      >
        <FiLogOut size={16} />
      </button>

      {/* Hộp thoại bẫy xác nhận hành vi đăng xuất đồng bộ toàn hệ thống */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSignOut}
        title="Xác nhận đăng xuất tài khoản"
        message="Bạn có chắc chắn muốn kết thúc phiên làm việc hiện tại và đăng xuất khỏi hệ thống quản trị Agent Hub không?"
        confirmText="Đồng ý đăng xuất"
        cancelText="Quay lại"
        type="warning"
      />
    </div>
  );
};
// BKAV HaiHS : Component widget hiển thị thông tin người dùng và nút đăng xuất ở cuối sidebar - end

export default UserProfileWidget;
