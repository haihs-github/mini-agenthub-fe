import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getUsersApi } from "../userApi";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import UserPagination from "./UserPagination";
import UserFormModal from "./UserFormModal";
import { FiLock } from "react-icons/fi";

// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - start
const UserWindow = () => {
  const { permissions } = useAuth();
  const hasPermission = permissions?.includes("USER_R");

  // Các State quản lý dữ liệu bảng
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // State điều khiển Modal nâng cao
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false); // 🚀 STATE CHỐT CHẶN CHẾ ĐỘ XEM CHI TIẾT

  const loadUsers = useCallback(async () => {
    if (!hasPermission) return;
    setIsLoading(true);
    try {
      const res = await getUsersApi(currentPage, 10);
      setUsers(res?.data || []);
      setTotalPages(res?.pagination?.totalPages || 1);
      setTotalItems(res?.pagination?.totalItems || 0);
    } catch (err) {
      console.error("Lỗi hệ thống khi tải danh sách người dùng:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasPermission]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Luồng 1: Mở chế độ ADD USER
  const handleOpenAddModal = () => {
    setUserToEdit(null);
    setIsViewMode(false); // Reset cờ view
    setIsModalOpen(true);
  };

  // Luồng 2: Mở chế độ UPDATE USER
  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setIsViewMode(false); // Reset cờ view
    setIsModalOpen(true);
  };

  // Luồng 3: Mở chế độ VIEW USER DETAILS
  const handleOpenViewModal = (user) => {
    setUserToEdit(user);
    setIsViewMode(true); // 🚀 BẬT CỜ CHẾ ĐỘ XEM READ-ONLY
    setIsModalOpen(true);
  };

  if (!hasPermission) {
    return (
      <div className="flex-1 h-full flex flex-col justify-center items-center bg-[#0b0f19] text-center px-6 select-none animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex justify-center items-center text-red-500 shadow-lg mb-4 animate-bounce">
          <FiLock size={28} />
        </div>
        <h3 className="text-xl font-bold text-white tracking-wide">
          Truy cập bị từ chối
        </h3>
        <p className="text-sm text-gray-400 mt-2 max-w-sm leading-6">
          Tài khoản của bạn chưa được cấp phép phân khu bảo mật này. Bạn phải có
          quyền{" "}
          <span className="font-mono text-red-400 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10 font-bold text-xs">
            USER_R
          </span>{" "}
          để truy cập bảng quản lý nhân sự.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0b0f19] px-8 py-8 flex flex-col justify-between">
      <div className="w-full max-w-6xl mx-auto flex-1">
        <UserHeader onAddClick={handleOpenAddModal} />

        <UserTable
          users={users}
          isLoading={isLoading}
          onEditClick={handleOpenEditModal}
          onViewClick={handleOpenViewModal} // 🚀 GẮN SỰ KIỆN XEM CHO BẢNG
        />

        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={(targetPage) => setCurrentPage(targetPage)}
        />
      </div>

      {/* POPUP PHÂN PHỐI 3 CHẾ ĐỘ */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
        isViewMode={isViewMode} // 🚀 TRUYỀN CỜ VÀO ĐỂ FORM TỰ BIẾN ĐỔI UI
        onSuccess={loadUsers}
      />
    </div>
  );
};
// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - end

export default UserWindow;
