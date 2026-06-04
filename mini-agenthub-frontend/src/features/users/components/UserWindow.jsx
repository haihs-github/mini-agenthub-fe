import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getUsersApi, deleteUserApi } from "../userApi";
import { useToast } from "../../../components/Toast";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import UserPagination from "./UserPagination";
import UserFormModal from "./UserFormModal";
import ConfirmModal from "../../../components/ConfirmModal";
import { FiLock } from "react-icons/fi";

// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - start
const UserWindow = () => {
  const { permissions } = useAuth();
  const userPermissions = permissions || [];

  // LỚP BẢO VỆ 1: Kiểm tra xem tài khoản có sở hữu ít nhất một quyền USER_ nào không
  const hasAnyUserPermission = userPermissions.some((p) =>
    p.startsWith("USER_"),
  );

  // LỚP BẢO VỆ 2: Bóc tách bộ tứ cờ quyền hạn để phân phối xuống UI con
  const canCreate = userPermissions.includes("USER_C");
  const canRead = userPermissions.includes("USER_R");
  const canUpdate = userPermissions.includes("USER_U");
  const canDelete = userPermissions.includes("USER_D");

  // Các State quản lý dữ liệu bảng
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const loadUsers = useCallback(async () => {
    // Chỉ kích hoạt gọi API mạng nếu có quyền đọc USER_R, tránh bị Backend từ chối trả về 403
    if (!canRead) return;
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
  }, [currentPage, canRead]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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

  // NẾU KHÔNG CÓ BẤT KỲ QUYỀN USER NÀO -> Khóa cửa không cho vào trang
  if (!hasAnyUserPermission) {
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
          nhân sự để truy cập module này.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0b0f19] px-8 py-8 flex flex-col justify-between">
      <div className="w-full max-w-6xl mx-auto flex-1">
        {/* Truyền cờ canCreate xuống Header để ẩn/hiện nút Add User */}
        <UserHeader onAddClick={handleOpenAddModal} canCreate={canCreate} />

        {/* Truyền bộ ba cờ quyền xuống Table để ẩn/hiện các cột hành động tương ứng */}
        <UserTable
          users={users}
          isLoading={isLoading}
          onEditClick={handleOpenEditModal}
          onViewClick={handleOpenViewModal}
          onDeleteClick={loadUsers} // Tạm thời nạp lại bảng khi trigger xóa từ bên ngoài nếu cần
          canRead={canRead}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />

        {/* Thanh điều hướng phân trang (Chỉ hiện nếu có quyền đọc danh sách) */}
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
    </div>
  );
};
// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - end

export default UserWindow;
