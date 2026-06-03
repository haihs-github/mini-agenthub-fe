import React from "react";
import { useAuth } from "../../../auth/AuthContext";
import { FiLogOut } from "react-icons/fi";

// BKAV HaiHS : Component widget hiển thị thông tin người dùng và nút đăng xuất ở cuối sidebar - start
const UserProfileWidget = () => {
  const { user, logout } = useAuth();

  return (
    <div className="mt-auto p-4 border-t border-[#1e293b]/60 flex items-center justify-between bg-[#0a0e18]">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* AVATAR AVATAR KÝ TỰ ĐẦU CỦA USER */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex justify-center items-center font-bold text-white uppercase shrink-0 shadow-lg">
          {user?.email ? user.email.charAt(0) : "U"}
        </div>

        {/* THÔNG TIN CHI TIẾT */}
        <div className="flex flex-col overflow-hidden text-left">
          <span className="text-sm font-semibold text-white truncate">
            {user?.email?.split("@")[0] || "Lập trình viên"}
          </span>
          <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase mt-0.5">
            Thành viên Hub
          </span>
        </div>
      </div>

      {/* NÚT ĐĂNG XUẤT AN TOÀN */}
      <button
        onClick={() => {
          if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?")) {
            logout();
            window.location.href = "/login";
          }
        }}
        title="Đăng xuất tài khoản"
        className="p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
      >
        <FiLogOut size={16} />
      </button>
    </div>
  );
};
// BKAV HaiHS : Component widget hiển thị thông tin người dùng và nút đăng xuất ở cuối sidebar - end

export default UserProfileWidget;
