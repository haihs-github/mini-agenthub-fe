import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../../components/Toast";
import { getUsersApi, deleteUserApi } from "../userApi";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import UserPagination from "./UserPagination";
import UserFormModal from "./UserFormModal";
import ConfirmModal from "../../../components/ConfirmModal";
import BulkAddToGroupModal from "./BulkAddToGroupModal";
import { FiLock } from "react-icons/fi";
import { useLanguage } from "../../../context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ

// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - start
const UserWindow = () => {
  const { permissions } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage(); // BKAV HaiHS: Khai báo hàm dịch thuật
  const userPermissions = permissions || [];

  const hasAnyUserPermission = userPermissions.some((p) =>
    p.startsWith("USER_"),
  );
  const canCreate = userPermissions.includes("USER_C");
  const canRead = userPermissions.includes("USER_R");
  const canUpdate = userPermissions.includes("USER_U");
  const canDelete = userPermissions.includes("USER_D");
  const canAddToGroup = userPermissions.includes("GROUP_ADD_USER");

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isConfirmBulkDeleteOpen, setIsConfirmBulkDeleteOpen] = useState(false);
  const [isBulkGroupOpen, setIsBulkGroupOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!canRead) return;
    setIsLoading(true);
    try {
      const res = await getUsersApi(currentPage, 10);
      setUsers(res?.data || []);
      setTotalPages(res?.pagination?.totalPages || 1);
      setTotalItems(res?.pagination?.totalItems || 0);
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, canRead]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setSelectedIds([]);
  }, [users]);

  const handleOpenAddModal = () => {
    setUserToEdit(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (user) => {
    setUserToEdit(user);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleOpenDeleteConfirm = (user) => {
    if (!canDelete) {
      showToast(t("toast_no_delete_perm"), "warning");
      return;
    }
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserApi(userToDelete.id);
      showToast(t("toast_delete_success"), "success");
      loadUsers();
    } catch (err) {
      showToast(err?.response?.data?.message || t("toast_error"), "error");
    } finally {
      setUserToDelete(null);
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleExecuteBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteUserApi(id)));
      showToast(
        t("toast_bulk_delete_success") +
          ` ${selectedIds.length} ` +
          t("users_selected"),
        "success",
      );
      setSelectedIds([]);
      loadUsers();
    } catch (err) {
      showToast(t("toast_bulk_delete_fail"), "error");
    } finally {
      setIsLoading(false);
      setIsConfirmBulkDeleteOpen(false);
    }
  };

  const handleOpenBulkGroupModal = () => {
    if (!canAddToGroup) {
      showToast(t("toast_no_add_group_perm"), "warning");
      return;
    }
    setIsBulkGroupOpen(true);
  };

  const getSelectedUsersData = () =>
    users.filter((u) => selectedIds.includes(u.id));

  const handleBulkGroupSuccess = () => {
    setSelectedIds([]);
    loadUsers();
  };

  if (!hasAnyUserPermission) {
    return (
      <div className="flex-1 h-full flex flex-col justify-center items-center bg-gray-50 dark:bg-[#0b0f19] text-center px-6 select-none animate-fade-in transition-colors duration-300">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex justify-center items-center text-red-500 shadow-lg mb-4">
          <FiLock size={28} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide transition-colors">
          {t("access_denied")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm leading-6 transition-colors">
          {t("access_denied_user_desc")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors duration-300">
      {/* BKAV HaiHS : Thanh dau trang co dinh (sticky header) - start */}
      <div className="w-full border-b border-gray-200 dark:border-[#232d42]/60 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md shrink-0 px-4 py-4 md:px-8 md:py-5 z-10 transition-colors duration-300">
        <div className="w-full max-w-6xl mx-auto">
          <UserHeader onAddClick={handleOpenAddModal} canCreate={canCreate} />
        </div>
      </div>
      {/* BKAV HaiHS : Thanh dau trang co dinh (sticky header) - end */}

      {/* BKAV HaiHS : Vung noi dung cuon phia duoi - start */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="w-full max-w-6xl mx-auto space-y-6 flex flex-col">
          <UserTable
            users={users}
            isLoading={isLoading}
            onEditClick={handleOpenEditModal}
            onViewClick={handleOpenViewModal}
            onDeleteClick={handleOpenDeleteConfirm}
            onBulkDeleteClick={() => setIsConfirmBulkDeleteOpen(true)}
            onBulkGroupClick={handleOpenBulkGroupModal}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            canRead={canRead}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
          {canRead && (
            <UserPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={(targetPage) => setCurrentPage(targetPage)}
            />
          )}
        </div>
      </div>
      {/* BKAV HaiHS : Vung noi dung cuon phia duoi - end */}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
        isViewMode={isViewMode}
        onSuccess={loadUsers}
      />
      <BulkAddToGroupModal
        isOpen={isBulkGroupOpen}
        onClose={() => setIsBulkGroupOpen(false)}
        selectedUsers={getSelectedUsersData()}
        onSuccess={handleBulkGroupSuccess}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
        title={t("confirm_delete_title")}
        message={t("confirm_delete_msg")}
        confirmText={t("agree_delete")}
        cancelText={t("keep_user")}
        type="danger"
      />
      <ConfirmModal
        isOpen={isConfirmBulkDeleteOpen}
        onClose={() => setIsConfirmBulkDeleteOpen(false)}
        onConfirm={handleExecuteBulkDelete}
        title={t("confirm_bulk_delete_title")}
        message={
          t("confirm_bulk_delete_msg") +
          ` ${selectedIds.length} ` +
          t("users_selected") +
          "?"
        }
        confirmText={t("delete_all")}
        cancelText={t("cancel_btn")}
        type="danger"
      />
    </div>
  );
};
// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - end

export default UserWindow;
