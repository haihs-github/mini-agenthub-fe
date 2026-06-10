import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getGroupsListApi } from "../groupApi";
import GroupHeader from "./GroupHeader";
import GroupTable from "./GroupTable";
import GroupPagination from "./GroupPagination";
import GroupFormModal from "./GroupFormModal";
import { FiLock } from "react-icons/fi";

// BKAV HaiHS: Component chính quản lý cả trang group - start
const GroupWindow = () => {
  const { permissions } = useAuth();
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

  // Khai bao cac state dieu phoi luong hanh vi tao moi hoac cap nhat thong tin nhom quyen
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);

  const loadGroups = useCallback(async () => {
    if (!canRead) return;
    setIsLoading(true);
    try {
      const res = await getGroupsListApi(currentPage, 10);
      setGroups(res?.data || []);
      setTotalPages(res?.pagination?.totalPages || 1);
      setTotalItems(res?.pagination?.totalItems || 0);
    } catch (err) {
      console.error("Loi he thong khi tai danh sach nhom quyen:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, canRead]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Kich hoat mo bieu mau trang thai tao moi nhom trong tran phẳng du lieu
  const handleOpenCreateModal = () => {
    setGroupToEdit(null);
    setIsModalOpen(true);
  };

  // Kich hoat mo bieu mau trang thai cap nhat nap doi tuong nhom gán tu o banh rang
  const handleOpenEditModal = (group) => {
    setGroupToEdit(group);
    setIsModalOpen(true);
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
          onViewClick={() => {}}
          onMembersClick={() => {}}
          onEditClick={handleOpenEditModal}
          onDeleteClick={() => {}}
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

      {/* Khoi component modal da nang don nhan dong thoi trang thai tao moi hoac chinh sua */}
      <GroupFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupToEdit={groupToEdit}
        onSuccess={loadGroups}
      />
    </div>
  );
};
// BKAV HaiHS: Component chính quản lý cả trang group - end

export default GroupWindow;
