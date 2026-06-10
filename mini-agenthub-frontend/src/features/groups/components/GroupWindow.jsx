import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../../components/Toast";
import { getGroupsListApi, deleteGroupApi } from "../groupApi";
import GroupHeader from "./GroupHeader";
import GroupTable from "./GroupTable";
import GroupPagination from "./GroupPagination";
import GroupFormModal from "./GroupFormModal";
import GroupMembersModal from "./GroupMembersModal";
import ConfirmModal from "../../../components/ConfirmModal";
import { FiLock } from "react-icons/fi";

// BKAV HaiHS: Component đại diện toàn bộ trang quản lý quyền - start
const GroupWindow = () => {
  const { permissions } = useAuth();
  const { showToast } = useToast();
  const groupPermissions = permissions || [];

  const hasAnyGroupPermission = groupPermissions.some((p) =>
    p.startsWith("GROUP_"),
  );
  const canCreate = groupPermissions.includes("GROUP_C");
  const canRead = groupPermissions.includes("GROUP_R");
  const canUpdate = groupPermissions.includes("GROUP_U");
  const canDelete = groupPermissions.includes("GROUP_D");

  const [groups, setGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);

  // BKAV HaiHS: Khai báo biến trạng thái điều phối chế độ xem chi tiết không cho sửa
  const [isViewMode, setIsViewMode] = useState(false);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [selectedGroupForMembers, setSelectedGroupForMembers] = useState(null);

  const loadGroups = useCallback(async () => {
    if (!canRead) return;
    setIsLoading(true);
    try {
      const res = await getGroupsListApi(currentPage, 10);
      setGroups(res?.data || []);
      setTotalPages(res?.pagination?.totalPages || 1);
      setTotalItems(res?.pagination?.totalItems || 0);
    } catch (err) {
      console.error("Lỗi hệ thống khi tải danh sách nhóm quyền:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, canRead]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Khởi động mở biểu mẫu ở trạng thái tạo mới hoàn toàn
  const handleOpenCreateModal = () => {
    setGroupToEdit(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  // Khởi động mở biểu mẫu ở trạng thái chỉnh sửa thông tin nhóm quyền
  const handleOpenEditModal = (group) => {
    setGroupToEdit(group);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  // BKAV HaiHS: Hàm mở modal ở trạng thái xem chi tiết đóng băng dữ liệu nếu đạt quyền GROUP_R
  const handleOpenViewModal = (group) => {
    if (!canRead) {
      showToast(
        "Bạn không có quyền GROUP_R để xem chi tiết nhóm quyền này",
        "warning",
      );
      return;
    }
    setGroupToEdit(group);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleOpenMembersModal = (group) => {
    if (!canUpdate) {
      showToast(
        "Bạn không có quyền GROUP_U để quản trị thành viên của nhóm này",
        "warning",
      );
      return;
    }
    setSelectedGroupForMembers(group);
    setIsMembersOpen(true);
  };

  const handleOpenDeleteConfirm = (group) => {
    if (!canDelete) {
      showToast(
        "Bạn không có quyền GROUP_D để thực hiện hành động xóa nhóm này",
        "warning",
      );
      return;
    }
    setGroupToDelete(group);
    setIsConfirmDeleteOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!groupToDelete) return;
    setIsLoading(true);
    try {
      await deleteGroupApi(groupToDelete.id);
      showToast(
        `Đã xóa vĩnh viễn nhóm quyền [${groupToDelete.name}] khỏi hệ thống`,
        "success",
      );
      setIsConfirmDeleteOpen(false);
      loadGroups();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        "Không thể xóa nhóm do lỗi kết nối hệ thống";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
      setGroupToDelete(null);
    }
  };

  if (!hasAnyGroupPermission) {
    return (
      <div className="flex-1 h-full flex flex-col justify-center items-center bg-[#0b0f19] text-center px-6 select-none animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex justify-center items-center text-red-500 shadow-lg mb-4">
          <FiLock size={28} />
        </div>
        <h3 className="text-xl font-bold text-white tracking-wide">
          Truy cập bị từ chối
        </h3>
        <p className="text-sm text-gray-400 mt-2 max-w-sm leading-6">
          Tài khoản của bạn không sở hữu bất kỳ quyền hạn nào thuộc phân khu
          nhóm quyền để khai thác module này.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0b0f19] px-8 py-8 flex flex-col justify-between">
      <div className="w-full max-w-6xl mx-auto flex-1">
        <GroupHeader
          onCreateClick={handleOpenCreateModal}
          canCreate={canCreate}
        />

        <GroupTable
          groups={groups}
          isLoading={isLoading}
          onViewClick={handleOpenViewModal} // Đấu nối sự kiện click nút chữ i tròn xem chi tiết
          onMembersClick={handleOpenMembersModal}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDeleteConfirm}
          canRead={canRead}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />

        {canRead && (
          <GroupPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={(targetPage) => setCurrentPage(targetPage)}
          />
        )}
      </div>

      {/* Truyền cờ điều hướng isViewMode thông suốt vào cấu trúc biểu mẫu */}
      <GroupFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupToEdit={groupToEdit}
        isViewMode={isViewMode}
        onSuccess={loadGroups}
      />

      <GroupMembersModal
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        groupId={selectedGroupForMembers?.id}
        groupName={selectedGroupForMembers?.name}
        onRefreshTotal={loadGroups}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
        title="Cảnh báo xóa nhóm quyền"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn nhóm [${groupToDelete?.name}] không? Hành động này sẽ tước bỏ quyền của toàn bộ thành viên trong nhóm và không thể hoàn tác!`}
        confirmText="Đồng ý xóa"
        cancelText="Giữ lại"
        type="danger"
      />
    </div>
  );
};
// BKAV HaiHS: Component đại diện toàn bộ trang quản lý quyền - end

export default GroupWindow;
