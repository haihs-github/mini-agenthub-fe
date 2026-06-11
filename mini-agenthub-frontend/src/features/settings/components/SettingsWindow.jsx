import React from "react";
import PersonalInfo from "./PersonalInfo";
import Personalization from "./Personalization";
import AccountSecurity from "./AccountSecurity";

// BKAV HaiHS: components chính trang setting - start
const SettingsWindow = ({ setConversations }) => {
  return (
    /* BKAV HaiHS: Cập nhật màu nền trang Setting - Sáng: gray-50 / Tối: #0b0f19 */
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#0b0f19] px-8 py-8 flex flex-col transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto space-y-8 flex-1 pb-12">
        {/* Khối tiêu đề phân khu làm việc tổng thể */}
        {/* BKAV HaiHS: Cập nhật màu border và màu chữ tiêu đề */}
        <div className="space-y-1.5 select-none border-b border-gray-200 dark:border-[#232d42]/40 pb-5 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide transition-colors duration-300">
            Workspace Settings
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
            Manage your personal profiles, interface preferences, and system
            security credentials.
          </p>
        </div>

        {/* 1. Phân khu Linh kiện Thông tin tài khoản */}
        <PersonalInfo />

        {/* 2. Phân khu Linh kiện Tùy chỉnh giao diện Theme màu */}
        <Personalization />

        {/* 3. Phân khu Linh kiện Bản chốt bảo mật và Phiên đăng nhập */}
        <AccountSecurity setConversations={setConversations} />
      </div>
    </div>
  );
};
// BKAV HaiHS: components chính trang setting - end

export default SettingsWindow;
