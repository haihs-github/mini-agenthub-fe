import React from "react";
import PersonalInfo from "./PersonalInfo";
import Personalization from "./Personalization";
import AccountSecurity from "./AccountSecurity";

// BKAV HaiHS: components chính trang setting - start
const SettingsWindow = () => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0b0f19] px-8 py-8 flex flex-col">
      <div className="w-full max-w-4xl mx-auto space-y-8 flex-1 pb-12">
        {/* Khối tiêu đề phân khu làm việc tổng thể */}
        <div className="space-y-1.5 select-none border-b border-[#232d42]/40 pb-5">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Workspace Settings
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Manage your personal profiles, interface preferences, and system
            security credentials.
          </p>
        </div>

        {/* 1. Phân khu Linh kiện Thông tin tài khoản */}
        <PersonalInfo />

        {/* 2. Phân khu Linh kiện Tùy chỉnh giao diện Theme màu */}
        <Personalization />

        {/* 3. Phân khu Linh kiện Bản chốt bảo mật và Phiên đăng nhập */}
        <AccountSecurity />
      </div>
    </div>
  );
};
// BKAV HaiHS: components chính trang setting - end

export default SettingsWindow;
