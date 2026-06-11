import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// BKAV HaiHS : Component Phân trang danh sách user - start
const UserPagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2 select-none">
      {/* BKAV HaiHS: Đổi màu chữ hiển thị số trang */}
      <div className="text-xs font-medium text-gray-500 dark:text-gray-500 transition-colors duration-300">
        Hiển thị trang{" "}
        <span className="text-gray-900 dark:text-gray-300">{currentPage}</span>{" "}
        trên tổng số{" "}
        <span className="text-gray-900 dark:text-gray-300">{totalPages}</span>{" "}
        trang ({totalItems} nodes)
      </div>

      <div className="flex items-center gap-1.5 text-xs font-bold">
        {/* Nút lùi trang */}
        {/* BKAV HaiHS: Cập nhật nền, viền và màu chữ nút điều hướng cho mode sáng/tối */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-xl bg-white dark:bg-[#161b26] border border-gray-200 dark:border-[#232d42] text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <FiChevronLeft size={14} />
        </button>

        {/* Vòng lặp vẽ các nút số trang */}
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              /* BKAV HaiHS: Cấu hình màu cho nút số trang hiện tại và hover trạng thái khác */
              className={`w-9 h-9 rounded-xl font-bold transition-all cursor-pointer flex justify-center items-center ${
                isCurrent
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white dark:bg-[#161b26] border border-gray-200 dark:border-[#232d42] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Nút tiến trang */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-xl bg-white dark:bg-[#161b26] border border-gray-200 dark:border-[#232d42] text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
// BKAV HaiHS : Component Phân trang danh sách user - end

export default UserPagination;
