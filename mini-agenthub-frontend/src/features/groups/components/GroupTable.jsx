import React from "react";
import { FiInfo, FiUsers, FiSettings, FiTrash2 } from "react-icons/fi";

// BKAV HaiHS: Component bảng hiển thị danh sách nhóm - start
const GroupTable = ({
  groups,
  isLoading,
  onViewClick,
  onMembersClick,
  onEditClick,
  onDeleteClick,
  canRead,
  canUpdate,
  canDelete,
}) => {
  return (
    <div className="w-full bg-[#161b26]/60 border border-[#232d42] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      <div className="px-6 py-4 bg-[#111622]/90 border-b border-[#232d42] flex items-center justify-between text-xs font-semibold tracking-wider text-gray-400 select-none">
        <span>Active Groups</span>
        {canRead && groups.length > 0 && (
          <span className="bg-[#1e2533] px-2.5 py-1 border border-[#232d42] text-[10px] font-bold text-gray-400 rounded-lg uppercase tracking-widest">
            {groups.length} Total
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#232d42] text-[11px] font-bold tracking-widest text-gray-500 uppercase select-none">
              <th className="py-4 px-6">Group Name</th>
              <th className="py-4 px-6">Member Count</th>
              {(canRead || canUpdate || canDelete) && (
                <th className="py-4 px-6 text-right pr-8">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#232d42]/40 text-sm text-gray-300">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-5 px-6">
                    <div className="h-4 bg-gray-800 rounded w-44"></div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="h-4 bg-gray-800 rounded w-24"></div>
                  </td>
                  <td className="py-5 px-6 text-right pr-8">
                    <div className="h-4 bg-gray-800 rounded w-24 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : !canRead ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-amber-500/80 italic font-medium bg-[#111622]/20"
                >
                  Tài khoản của bạn không có quyền GROUP_R để xem danh sách nhóm
                  quyền.
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-gray-500 italic"
                >
                  Không tìm thấy nhóm quyền nào.
                </td>
              </tr>
            ) : (
              groups.map((group) => {
                const memberCount =
                  group.memberCount || group._count?.users || 0;
                return (
                  <tr
                    key={group.id}
                    className="transition-colors hover:bg-[#1e2533]/40"
                  >
                    <td className="py-4 px-6 font-semibold text-blue-400 cursor-pointer hover:underline">
                      {group.name}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {memberCount} members
                    </td>

                    {/* // Check mask quyen tong toan bang truoc khi render cot hanh dong */}
                    {(canRead || canUpdate || canDelete) && (
                      <td className="py-4 px-6 text-right pr-8">
                        <div className="flex items-center justify-end gap-1">
                          {canRead && (
                            <button
                              title="View Details"
                              onClick={() => onViewClick(group)}
                              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
                            >
                              <FiInfo size={15} />
                            </button>
                          )}
                          {canUpdate && (
                            <button
                              title="Manage Members"
                              onClick={() => onMembersClick(group)}
                              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
                            >
                              <FiUsers size={15} />
                            </button>
                          )}
                          {canUpdate && (
                            <button
                              title="Edit Settings"
                              onClick={() => onEditClick(group)}
                              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
                            >
                              <FiSettings size={14} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              title="Delete Group"
                              onClick={() => onDeleteClick(group)}
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
// BKAV HaiHS: Component bảng hiển thị danh sách nhóm - end

export default GroupTable;
