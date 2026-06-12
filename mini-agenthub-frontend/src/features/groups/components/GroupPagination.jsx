import React from "react";
import { useLanguage } from "../../../context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ

// BKAV HaiHS: Component phân trang cho trang quản lý nhóm - start
const GroupPagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const { t } = useLanguage(); // BKAV HaiHS: Khai báo hàm dịch thuật
  const startNode = (currentPage - 1) * 10 + 1;
  const endNode = Math.min(currentPage * 10, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2 select-none">
      {/* BKAV HaiHS: Đổi màu chữ thông báo số lượng item và dịch thuật */}
      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">
        {t("showing") || "Showing"} {totalItems > 0 ? startNode : 0}{" "}
        {t("to") || "to"} {endNode} {t("of") || "of"} {totalItems}{" "}
        {t("nodes") || "nodes"}
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        {/* BKAV HaiHS: Đổi màu nút điều hướng */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              /* BKAV HaiHS: Cấu hình màu nền cho page đang chọn và màu hover cho nền sáng/tối */
              className={`w-7 h-7 flex justify-center items-center rounded-lg font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
// BKAV HaiHS: Component phân trang cho trang quản lý nhóm - end

export default GroupPagination;
