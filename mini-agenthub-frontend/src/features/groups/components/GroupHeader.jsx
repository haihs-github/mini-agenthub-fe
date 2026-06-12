import React from "react";
import { FiPlus } from "react-icons/fi";
import { useLanguage } from "../../../context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ

// BKAV HaiHS: Component header của trang quản lý nhóm, hiển thị tiêu đề và nút tạo mới nhóm nếu có quyền - start
const GroupHeader = ({ onCreateClick, canCreate }) => {
  const { t } = useLanguage(); // BKAV HaiHS: Khai báo hàm dịch thuật

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 select-none">
      <div>
        {/* BKAV HaiHS: Đổi màu chữ tiêu đề theo theme */}
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
          {t("group_title") || "Group Management"}
        </h2>
        {/* BKAV HaiHS: Đổi màu mô tả phụ */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed transition-colors duration-300">
          {t("group_desc") ||
            "Monitor and coordinate high-performance intelligence teams. View active groups, manage permissions, and inspect nested member hierarchies."}
        </p>
      </div>

      <div className="shrink-0">
        {canCreate && (
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all shadow-lg shadow-blue-600/10 cursor-pointer animate-fade-in"
          >
            <FiPlus size={14} />
            <span>{t("group_add") || "Create New Group"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
// BKAV HaiHS: Component header của trang quản lý nhóm, hiển thị tiêu đề và nút tạo mới nhóm nếu có quyền - end

export default GroupHeader;
