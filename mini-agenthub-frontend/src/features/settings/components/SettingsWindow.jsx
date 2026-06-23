import React from "react";
import { FiMenu } from "react-icons/fi";
import PersonalInfo from "./PersonalInfo";
import Personalization from "./Personalization";
import AccountSecurity from "./AccountSecurity";
import { useLanguage } from "../../../context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ
import { useSidebar } from "../../../components/layout/AppLayout";

// BKAV HaiHS: components chính trang setting - start
const SettingsWindow = ({ setConversations }) => {
  const { t } = useLanguage(); // BKAV HaiHS: Khai báo hàm dịch thuật
  const { setIsSidebarOpen } = useSidebar();

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#0b0f19] px-4 py-4 md:px-8 md:py-8 flex flex-col transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto space-y-8 flex-1 pb-12">
        {/* Khối tiêu đề phân khu làm việc tổng thể */}
        <div className="space-y-1.5 select-none border-b border-gray-200 dark:border-[#232d42]/40 pb-5 transition-colors duration-300 flex items-start gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden cursor-pointer shrink-0 mt-0.5 transition-colors duration-300"
            title="Mở menu"
          >
            <FiMenu size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide transition-colors duration-300">
              {t("workspaceSettings") || "Workspace Settings"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300 mt-1.5">
              {t("settingsDesc") ||
                "Manage your personal profiles, interface preferences, and system security credentials."}
            </p>
          </div>
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
