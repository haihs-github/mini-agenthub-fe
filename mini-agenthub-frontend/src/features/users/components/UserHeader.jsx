import React from "react";
import { FiFilter, FiUserPlus } from "react-icons/fi";

// BKAV HaiHS : Component Chứa tiêu đề module, mô tả hệ thống mạng trí tuệ và cặp đôi nút "Bộ lọc", "Thêm người dùng" - start
const UserHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 select-none">
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-white">
          User Management
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
          Điều phối mạng lưới tình báo của bạn. Quản lý quyền hạn hệ thống, vai
          trò và các nhóm cộng tác trên toàn bộ hệ sinh thái Mini AgentHub.
        </p>
      </div>

      {/* CẶP NÚT CHỨC NĂNG CHUẨN DESIGN */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="flex items-center gap-2 bg-[#161b26] border border-[#232d42] hover:border-gray-500 text-xs font-semibold px-4 py-2.5 rounded-xl text-gray-300 transition-all cursor-pointer">
          <FiFilter size={14} />
          <span>Bộ lọc</span>
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all shadow-lg shadow-blue-600/10 cursor-pointer">
          <FiUserPlus size={14} />
          <span>Add User</span>
        </button>
      </div>
    </div>
  );
};
// BKAV HaiHS : Component Chứa tiêu đề module, mô tả hệ thống mạng trí tuệ và cặp đôi nút "Bộ lọc", "Thêm người dùng" - end

export default UserHeader;
