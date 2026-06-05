import React from "react";

// BKAV HaiHS: Component phân trang cho trang quản lý nhóm - start
const GroupPagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const startNode = (currentPage - 1) * 10 + 1;
  const endNode = Math.min(currentPage * 10, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2 select-none">
      <div className="text-xs text-gray-500 font-medium">
        Showing {totalItems > 0 ? startNode : 0} to {endNode} of {totalItems}{" "}
        nodes
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
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
              className={`w-7 h-7 flex justify-center items-center rounded-lg font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
// BKAV HaiHS: Component phân trang cho trang quản lý nhóm - end

export default GroupPagination;
