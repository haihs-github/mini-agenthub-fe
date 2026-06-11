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

// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - start
const UserWindow = () => {
  const { permissions } = useAuth();
  const { showToast } = useToast();
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
      console.error("Loi he thong khi tai danh sach nguoi dung:", err);
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
      showToast(
        "Ban khong co quyen USER_D de thuc hien hanh dong xoa thanh vien nay!",
        "warning",
      );
      return;
    }
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserApi(userToDelete.id);
      showToast(`Da truc xuat thanh vien khoi mang luoi!`, "success");
      loadUsers();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Khong the xoa nguoi dung";
      showToast(errorMsg, "error");
    } finally {
      setUserToDelete(null);
    }
  };

  const handleExecuteBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteUserApi(id)));
      showToast(
        `Da xoa thanh cong ${selectedIds.length} thanh vien duoc chon khoi he thong!`,
        "success",
      );
      setSelectedIds([]);
      loadUsers();
    } catch (err) {
      showToast(
        "Co loi xay ra trong qua trinh thuc thi xoa hang loat",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBulkGroupModal = () => {
    if (!canAddToGroup) {
      showToast(
        "Taikhoan cua ban khong co quyen GROUP_ADD_USER de gop thanh vien vao nhom!",
        "warning",
      );
      return;
    }
    setIsBulkGroupOpen(true);
  };

  const getSelectedUsersData = () => {
    return users.filter((u) => selectedIds.includes(u.id));
  };

  const handleBulkGroupSuccess = () => {
    setSelectedIds([]);
    loadUsers();
  };

  if (!hasAnyUserPermission) {
    return (
      /* BKAV HaiHS: Màu nền khu vực lỗi truy cập */
      <div className="flex-1 h-full flex flex-col justify-center items-center bg-gray-50 dark:bg-[#0b0f19] text-center px-6 select-none animate-fade-in transition-colors duration-300">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex justify-center items-center text-red-500 shadow-lg mb-4">
          <FiLock size={28} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide transition-colors">
          Truy cap bi tu choi
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm leading-6 transition-colors">
          Tai khoan cua ban khong so huu bat ky quyen han nao thuoc phan khu
          nhan su de truy cap module nay.
        </p>
      </div>
    );
  }

  return (
    /* BKAV HaiHS: Màu nền trang UserWindow */
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#0b0f19] px-8 py-8 flex flex-col justify-between transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto flex-1">
        <UserHeader onAddClick={handleOpenAddModal} canCreate={canCreate} />

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
        title="Canh bao xoa nhan su"
        message={`Ban co chac chan muon xoa vinh vien tai khoan nay khoi co so du lieu?`}
        confirmText="Dong y xoa"
        cancelText="Giu lai"
        type="danger"
      />

      <ConfirmModal
        isOpen={isConfirmBulkDeleteOpen}
        onClose={() => setIsConfirmBulkDeleteOpen(false)}
        onConfirm={handleExecuteBulkDelete}
        title="Xac nhan xoa hang loat"
        message={`Ban co chac chan muon xoa vinh vien ${selectedIds.length} thanh vien da chon khoi he thong? Hanh dong nay khong the hoan tac!`}
        confirmText="Xoa toan bo"
        cancelText="Huy bo"
        type="danger"
      />
    </div>
  );
};
// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - end

export default UserWindow;
