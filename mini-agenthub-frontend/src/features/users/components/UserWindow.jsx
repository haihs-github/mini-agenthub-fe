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
  const { showToast } = useToast();

  // Kiểm tra quyền đọc bảng
  const hasPermissionR = permissions?.includes("USER_R");

  // Các State quản lý dữ liệu bảng
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // State điều khiển Modal Add/Edit/View
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // STATE ĐIỀU KHIỂN HÀNH VI XÓA USER
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Hàm tải dữ liệu bảng
  const loadUsers = useCallback(async () => {
    if (!hasPermissionR) return;
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
  }, [currentPage, hasPermissionR]);

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

  // TRẠM KIỂM SOÁT AN NINH QUYỀN XÓA (USER_D)
  const handleOpenDeleteConfirm = (user) => {
    const hasPermissionD = permissions?.includes("USER_D");

    // Yêu cầu 1: Nếu không có quyền USER_D -> Bắn Toast cảnh báo giật mình ngay lập tức và chặn luồng!
    if (!hasPermissionD) {
      showToast(
        "Bạn không có quyền USER_D để thực hiện hành động xóa thành viên này!",
        "warning",
      );
      return;
    }

    // Nếu có đủ quyền hạn -> Lưu vết đối tượng và mở hộp thoại xác nhận xịn xò lên
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  // LỆNH THỰC THI XÓA KHỎI ĐƯỜNG ỐNG DATABASE CỦA BE
  const handleExecuteDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserApi(userToDelete.id);

      // Yêu cầu 2: Xóa xong nổ Toast thành công rực rỡ
      showToast(
        `Đã xóa thành viên [${userToDelete.fullname || userToDelete.email}] ra khỏi mạng lưới!`,
        "success",
      );

      // Yêu cầu 3: Ép bảng cập nhật làm tươi số liệu ngay lập tức mà không cần F5
      loadUsers();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        "Không thể xóa người dùng do lỗi kết nối hệ thống";
      showToast(errorMsg, "error");
    } finally {
      setUserToDelete(null);
    }
  };

  if (!hasPermissionR) {
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
          onViewClick={handleOpenViewModal}
          onDeleteClick={handleOpenDeleteConfirm} // BẮN SỰ KIỆN XÓA XUỐNG BẢNG
        />

        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={(targetPage) => setCurrentPage(targetPage)}
        />
      </div>

      {/* POPUP THÊM / SỬA / XEM CHI TIẾT */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
        isViewMode={isViewMode}
        onSuccess={loadUsers}
      />

      {/* BỘ ĐỊNH VỊ POPUP XÁC NHẬN XÓA DÙNG CHUNG SIÊU TIỆN LỢI */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete} // Bấm đồng ý sẽ lao thẳng vào hàm gọi API xóa
        title="Cảnh báo xóa nhân sự"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản [${userToDelete?.fullname || userToDelete?.email}] khỏi cơ sở dữ liệu hệ thống? Hành động này không thể hoàn tác!`}
        confirmText="Đồng ý xóa"
        cancelText="Giữ lại"
        type="danger" // Hiện màu đỏ rực rỡ cảnh báo nguy hiểm tối cao
      />
    </div>
  );
};
// BKAV HaiHS : Component chính chứa đựng toàn bộ trang quản lý user, điều phối việc hiển thị header, bảng danh sách, phân trang và popup form - end

export default UserWindow;
