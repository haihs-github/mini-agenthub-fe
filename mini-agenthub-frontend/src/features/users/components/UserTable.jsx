import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

// BKAV HaiHS : Component Bảng hiển thị danh sách user - start
const UserTable = ({
  users,
  isLoading,
  onEditClick,
  onViewClick,
  onDeleteClick,
  canRead,
  canUpdate,
  canDelete,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setSelectedIds([]);
  }, [users]);

  const handleSelectAllToggle = (e) => {
    if (e.target.checked) {
      const allCurrentIds = users.map((user) => user.id);
      setSelectedIds(allCurrentIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRowToggle = (userId) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const isAllSelectedOnPage =
    users.length > 0 && selectedIds.length === users.length;

  return (
    <div className="w-full bg-[#161b26]/60 border border-[#232d42] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* THANH ĐẾM SỐ LƯỢNG (Chỉ cho phép chọn nếu có quyền đọc danh sách) */}
      {canRead && (
        <div className="px-6 py-4 bg-[#111622]/90 border-b border-[#232d42] flex items-center gap-3 text-xs font-semibold tracking-wider text-gray-400 select-none">
          <input
            type="checkbox"
            checked={isAllSelectedOnPage}
            onChange={handleSelectAllToggle}
            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
          />
          <span
            className={selectedIds.length > 0 ? "text-blue-400 font-bold" : ""}
          >
            {selectedIds.length} Users selected
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#232d42] text-[11px] font-bold tracking-widest text-gray-500 uppercase select-none">
              <th className="py-4 px-6 w-12"></th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              {/* ẨN LUÔN CỘT ACTIONS NẾU CẢ 3 QUYỀN HÀNH ĐỘNG ĐỀU BẰNG FALSE */}
              {(canRead || canUpdate || canDelete) && (
                <th className="py-4 px-6 text-right pr-8">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#232d42]/40 text-sm text-gray-300">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-5 px-6">
                    <div className="h-4 w-4 bg-gray-800 rounded"></div>
                  </td>
                  <td className="py-5 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                    <div className="h-4 bg-gray-800 rounded w-28"></div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="h-4 bg-gray-800 rounded w-44"></div>
                  </td>
                  <td className="py-5 px-6 text-right pr-8">
                    <div className="h-4 bg-gray-800 rounded w-16 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : !canRead ? (
              // YÊU CẦU ĐẶC BIỆT: Nếu vào được trang nhưng không có quyền USER_R để xem danh sách
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-amber-500/80 italic font-medium bg-[#111622]/20"
                >
                  Tài khoản của bạn không có quyền USER_R để đọc dữ liệu danh
                  sách thành viên.
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-gray-500 italic"
                >
                  Không tìm thấy nhân sự nào.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const nameDisplay =
                  user.fullname || user.email?.split("@")[0] || "Unknown";
                const avatarCode = user.email
                  ? user.email.substring(0, 2).toUpperCase()
                  : "US";
                const isRowChecked = selectedIds.includes(user.id);

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors group ${isRowChecked ? "bg-blue-500/5" : "hover:bg-[#1e2533]/40"}`}
                  >
                    <td className="py-4 px-6">
                      {canRead && (
                        <input
                          type="checkbox"
                          checked={isRowChecked}
                          onChange={() => handleSelectRowToggle(user.id)}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex justify-center items-center text-xs font-bold text-blue-400">
                        {avatarCode}
                      </div>
                      <span className="capitalize">{nameDisplay}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                      {user.email}
                    </td>

                    {/* KHU VỰC ẨN HÀNH VI THEO QUYỀN HẠT NHÂN HÓA */}
                    {(canRead || canUpdate || canDelete) && (
                      <td className="py-4 px-6 text-right pr-8">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* ẨN ICON XEM CHI TIẾT NẾU THIẾU USER_R */}
                          {canRead && (
                            <button
                              title="Xem chi tiết"
                              onClick={() => onViewClick(user)}
                              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
                            >
                              <FiEye size={15} />
                            </button>
                          )}
                          {/* ẨN ICON CÂY BÚT CHÌ NẾU THIẾU USER_U */}
                          {canUpdate && (
                            <button
                              title="Sửa thông tin"
                              onClick={() => onEditClick(user)}
                              className="p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer"
                            >
                              <FiEdit2 size={14} />
                            </button>
                          )}
                          {/* ẨN ICON THÙNG RÁC NẾU THIẾU USER_D */}
                          {canDelete && (
                            <button
                              title="Xóa tài khoản"
                              onClick={() => onDeleteClick(user)}
                              className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// BKAV HaiHS : Component Bảng hiển thị danh sách user - end

export default UserTable;
