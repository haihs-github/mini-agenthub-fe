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
import { useLanguage } from "../../../context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ

// BKAV HaiHS: Component đại diện toàn bộ trang quản lý quyền - start
const GroupWindow = () => {
  const { permissions } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage(); // BKAV HaiHS: Khai báo hàm dịch thuật
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
      console.error("Lỗi:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, canRead]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleOpenCreateModal = () => {
    setGroupToEdit(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (group) => {
    setGroupToEdit(group);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (group) => {
    if (!canRead) {
      showToast(t("toast_no_read_perm"), "warning");
      return;
    }
    setGroupToEdit(group);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleOpenMembersModal = (group) => {
    if (!canUpdate) {
      showToast(t("toast_no_update_perm"), "warning");
      return;
    }
    setSelectedGroupForMembers(group);
    setIsMembersOpen(true);
  };

  const handleOpenDeleteConfirm = (group) => {
    if (!canDelete) {
      showToast(t("toast_no_delete_perm"), "warning");
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
        t("toast_delete_success") + ` [${groupToDelete.name}]`,
        "success",
      );
      setIsConfirmDeleteOpen(false);
      loadGroups();
    } catch (err) {
      showToast(err?.response?.data?.message || t("toast_error"), "error");
    } finally {
      setIsLoading(false);
      setGroupToDelete(null);
    }
  };

  if (!hasAnyGroupPermission) {
    return (
      <div className="flex-1 h-full flex flex-col justify-center items-center bg-gray-50 dark:bg-[#0b0f19] text-center px-6 select-none animate-fade-in transition-colors duration-300">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex justify-center items-center text-red-500 shadow-lg mb-4">
          <FiLock size={28} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">
          {t("access_denied")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm leading-6">
          {t("access_denied_desc")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#0b0f19] px-4 py-4 md:px-8 md:py-8 flex flex-col justify-between transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto flex-1">
        <GroupHeader
          onCreateClick={handleOpenCreateModal}
          canCreate={canCreate}
        />

        <GroupTable
          groups={groups}
          isLoading={isLoading}
          onViewClick={handleOpenViewModal}
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
        title={t("confirm_delete_title")}
        message={t("confirm_delete_msg") + ` [${groupToDelete?.name}]?`}
        confirmText={t("agree_delete")}
        cancelText={t("keep_group")}
        type="danger"
      />
    </div>
  );
};
// BKAV HaiHS: Component đại diện toàn bộ trang quản lý quyền - end

export default GroupWindow;
