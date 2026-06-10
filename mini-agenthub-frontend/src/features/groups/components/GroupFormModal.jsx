import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiX, FiLoader, FiSearch } from "react-icons/fi";
import { useToast } from "../../../components/Toast";
import { createGroupApi, updateGroupApi, searchUsersApi } from "../groupApi";
import ConfirmModal from "../../../components/ConfirmModal";

// BKAV HaiHS: Component Tạo mới, Sửa đổi và Xem chi tiết nhóm quyền - start
const GroupFormModal = ({
  isOpen,
  onClose,
  groupToEdit,
  isViewMode = false,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const { showToast } = useToast();
  const isEditMode = !!groupToEdit;

  // Khai báo các trạng thái giữ thông tin cơ bản của form ma trận phân quyền
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  // Khai báo các trạng thái phục vụ luồng tìm kiếm nhân sự phân trang vô hạn
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Mảng ánh xạ mã quyền ma trận cho phân hệ tài khoản người dùng
  const userMatrix = [
    { id: "USER_C", action: "Create", desc: "New Resources" },
    { id: "USER_R", action: "Read", desc: "Resource Data" },
    { id: "USER_U", action: "Update", desc: "Edit Content" },
    { id: "USER_D", action: "Delete", desc: "Remove Assets" },
  ];

  // Mảng ánh xạ mã quyền ma trận cho phân hệ nhóm quyền hệ thống
  const groupMatrix = [
    { id: "GROUP_C", action: "Create", desc: "New Groups / Resources" },
    { id: "GROUP_R", action: "Read", desc: "Group Configuration Data" },
    { id: "GROUP_U", action: "Update", desc: "Chỉnh sửa cấu hình nhóm" },
    { id: "GROUP_D", action: "Delete", desc: "Xóa vĩnh viễn nhóm quyền" },
    {
      id: "GROUP_ADD_USER",
      action: "Add User",
      desc: "Hành động: Thêm thành viên hàng loạt",
    },
    {
      id: "GROUP_DELETE_USER",
      action: "Delete User",
      desc: "Hành động: Loại bỏ thành viên hàng loạt",
    },
  ];

  // Đồng bộ dữ liệu cũ lên biểu mẫu form nếu đang chạy ở chế độ cập nhật hoặc xem chi tiết
  useEffect(() => {
    if ((isEditMode || isViewMode) && groupToEdit) {
      setName(groupToEdit.name || "");
      setSelectedPermissions(groupToEdit.permissions || []);
      setMembers(groupToEdit.users || groupToEdit.members || []);
    } else {
      setName("");
      setSelectedPermissions([]);
      setMembers([]);
    }
    setActiveTab("user");
    setSearchKeyword("");
    setSearchResults([]);
  }, [groupToEdit, isEditMode, isViewMode, isOpen]);

  // Tự động khép lại menu thả xuống khi người dùng click chuột ra vùng ngoài
  useEffect(() => {
    if (isViewMode) return;
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isViewMode]);

  // Thực hiện truy vấn luồng dữ liệu tìm kiếm nhân sự từ miền api máy chủ
  const executeSearch = useCallback(
    async (keyword, pageNum = 1, isLoadMore = false) => {
      if (!keyword.trim() || isViewMode) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await searchUsersApi(keyword, pageNum, 10);
        const fetchedUsers = res?.data || [];
        const pagination = res?.pagination || {};

        if (isLoadMore) {
          setSearchResults((prev) => [...prev, ...fetchedUsers]);
        } else {
          setSearchResults(fetchedUsers);
          setIsDropdownOpen(true);
        }

        setSearchPage(pageNum);
        setSearchHasMore(pageNum < (pagination.totalPages || 1));
      } catch (err) {
        console.error("Lỗi kết nối đầu api tìm kiếm thành viên:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [isViewMode],
  );

  // Trễ debounce tự động bật cuộc gọi api khi dừng gõ chữ 500ms
  useEffect(() => {
    if (isViewMode) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchHasMore(true);
      executeSearch(searchKeyword, 1, false);
    }, 500);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchKeyword, executeSearch, isViewMode]);

  // Cuộn xuống đáy để tải thông tin trang nhân sự tiếp theo trong dropdown
  const handleSearchScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 5 &&
      searchHasMore &&
      !isSearching
    ) {
      executeSearch(searchKeyword, searchPage + 1, true);
    }
  };

  // Đưa thông tin người dùng vào mảng thành viên và làm sạch thanh tìm kiếm
  const handleSelectUser = (user) => {
    if (isViewMode) return;
    if (members.some((m) => m.id === user.id)) {
      showToast(
        "Nhân sự này đã tồn tại trong danh sách thành viên nhóm",
        "warning",
      );
    } else {
      setMembers((prev) => [
        ...prev,
        { id: user.id, fullname: user.fullname, email: user.email },
      ]);
    }
    setSearchKeyword("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  // Gỡ bỏ một chip tag thành viên ra khỏi bộ khung lưu trữ
  const handleRemoveMember = (userId) => {
    if (isViewMode) return;
    setMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  // Tích chọn hoặc hủy tích mã quyền ma trận mà không gây ảnh hưởng tab đối diện
  const handleTogglePermission = (permId) => {
    if (isViewMode) return;
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId],
    );
  };

  // Kiểm tra dữ liệu nhập dở để cảnh báo xác nhận khi click nút hủy hoặc đóng popup
  const handleCancelWithCheck = () => {
    if (isViewMode) {
      onClose();
      return;
    }
    const hasData =
      name.trim() || selectedPermissions.length > 0 || members.length > 0;
    if (hasData) {
      setIsConfirmCancelOpen(true);
    } else {
      onClose();
    }
  };

  // Gửi payload đặc trưng lên hệ thống kiểm soát an ninh đầu API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode || !name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      permissions: selectedPermissions,
      userIds: members.map((m) => m.id),
    };

    try {
      if (isEditMode) {
        await updateGroupApi(groupToEdit.id, payload);
        showToast("Cập nhật thông tin cấu hình nhóm thành công", "success");
      } else {
        await createGroupApi(payload);
        showToast(
          "Khởi tạo cấu trúc nhóm phân quyền mới thành công",
          "success",
        );
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        "Tên nhóm đã tồn tại hoặc có lỗi API xảy ra";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentMatrix = activeTab === "user" ? userMatrix : groupMatrix;

  // BKAV HaiHS: Tính toán động tiêu đề và mô tả phụ dựa vào trạng thái truyền vào của cờ isViewMode
  const modalTitle = isViewMode
    ? "Group Details"
    : isEditMode
      ? "Update Group Details"
      : "Create New Group";
  const modalSubtitle = isViewMode
    ? "View configuration and integrated permissions matrix for this group."
    : isEditMode
      ? "Modify identity and access control for this group."
      : "Define identity and access control for your new workspace.";

  return (
    <>
      <style>{`
        .cyber-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .cyber-scrollbar::-webkit-scrollbar-track { background: #0b0f19; }
        .cyber-scrollbar::-webkit-scrollbar-thumb { background: #232d42; border-radius: 99px; }
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fade-in">
        <div className="w-full max-w-xl bg-[#161b26] border border-[#232d42] rounded-2xl shadow-2xl flex flex-col relative overflow-visible">
          {/* Đầu popup tiêu đề và mô tả chi tiết */}
          <div className="px-6 py-5 border-b border-[#232d42] flex justify-between items-start bg-[#111622]/30 rounded-t-2xl relative">
            <div className="space-y-1">
              <h3 className="text-md font-bold text-white tracking-wide">
                {modalTitle}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {modalSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancelWithCheck}
              className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800/60 transition-all cursor-pointer absolute right-5 top-5"
            >
              <FiX size={18} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6 flex-1 overflow-visible"
          >
            {/* KHỐI 1: IDENTITY */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono font-bold tracking-widest text-blue-400/90 uppercase">
                Identity
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400">
                    Group Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isViewMode}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Quantum Research Team"
                    className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/40 text-sm text-gray-100 rounded-xl px-4 py-2.5 focus:outline-none transition-all placeholder-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400">
                    Entity Type
                  </label>
                  <div className="flex bg-[#0b0f19] border border-[#232d42] p-1 rounded-xl h-[44px] items-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab("user")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${activeTab === "user" ? "bg-[#1e293b] text-white shadow-md" : "text-gray-500 hover:text-gray-300"}`}
                    >
                      Users
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("group")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${activeTab === "group" ? "bg-[#1e293b] text-white shadow-md" : "text-gray-500 hover:text-gray-300"}`}
                    >
                      Groups
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* KHỐI 2: PERMISSIONS MATRIX */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center select-none">
                <label className="text-[10px] font-mono font-bold tracking-widest text-blue-400/90 uppercase">
                  RBAC Permissions Matrix
                </label>
                <span className="text-[10px] font-mono tracking-wider text-gray-500 italic">
                  Role-Based Access Control
                </span>
              </div>

              <div className="w-full bg-[#0b0f19] border border-[#232d42] rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#232d42] text-[10px] font-bold tracking-wider text-gray-500 uppercase bg-[#111622]/40 select-none">
                      <th className="py-3 px-4 w-1/4">Action</th>
                      <th className="py-3 px-4 w-3/5">Description</th>
                      <th className="py-3 px-4 text-center w-16">Grant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232d42]/40 text-xs text-gray-300">
                    {currentMatrix.map((row) => {
                      const isGranted = selectedPermissions.includes(row.id);
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-[#1e2533]/20 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-sans font-bold text-gray-200">
                            {row.action}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 font-sans">
                            {row.desc}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {/* Khóa khả năng tương tác của ô tích nếu ở chế độ xem thông tin */}
                            <input
                              type="checkbox"
                              disabled={isViewMode}
                              checked={isGranted}
                              onChange={() => handleTogglePermission(row.id)}
                              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mx-auto"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KHỐI 3: INITIAL MEMBERS */}
            {!isEditMode && (
              <div
                className="space-y-2.5 relative overflow-visible"
                ref={searchRef}
              >
                <label className="text-[10px] font-mono font-bold tracking-widest text-blue-400/90 uppercase">
                  Initial Members
                </label>

                {/* Ẩn hoàn toàn thanh tìm kiếm nhân sự mới nếu đang ở kịch bản Xem chi tiết */}
                {!isViewMode && (
                  <div className="w-full relative">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/40 text-sm text-gray-100 rounded-xl pl-11 pr-10 py-3 focus:outline-none transition-all placeholder-gray-600"
                    />
                    <FiSearch
                      size={16}
                      className="absolute left-4 top-3.5 text-gray-500"
                    />
                    {isSearching && (
                      <FiLoader
                        size={15}
                        className="absolute right-4 top-3.5 text-blue-500 animate-spin"
                      />
                    )}
                  </div>
                )}

                {isDropdownOpen && searchResults.length > 0 && !isViewMode && (
                  <div
                    onScroll={handleSearchScroll}
                    className="cyber-scrollbar absolute left-0 right-0 mt-1.5 max-h-[180px] overflow-y-auto bg-[#1a202c] border border-[#232d42] rounded-xl shadow-2xl z-[100] divide-y divide-[#232d42]/60 animate-fade-in"
                  >
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="px-4 py-2.5 text-xs cursor-pointer flex flex-col gap-0.5 text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        <span className="font-bold text-white text-sm capitalize">
                          {user.fullname || "Unknown"}
                        </span>
                        <span className="text-gray-500 font-mono">
                          {user.email}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {members.length === 0 ? (
                    <span className="text-xs text-gray-600 pl-1 italic">
                      Nhóm quyền này hiện chưa cấu hình thành viên nào
                    </span>
                  ) : (
                    members.map((member) => {
                      const displayChipName =
                        member.fullname ||
                        member.email?.split("@")[0] ||
                        "User";
                      const avatarCode = displayChipName
                        .substring(0, 2)
                        .toUpperCase();
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 bg-[#1c2333] border border-[#2d3952] text-xs font-semibold text-gray-300 px-2.5 py-1.5 rounded-xl animate-fade-in"
                        >
                          <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[9px] flex items-center justify-center shrink-0">
                            {avatarCode}
                          </div>
                          <span className="capitalize">{displayChipName}</span>

                          {/* Ẩn hoàn toàn nút xóa dấu X trên kén chip thành viên nếu ở chế độ Xem chi tiết */}
                          {!isViewMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer ml-1"
                            >
                              <FiX size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* KHỐI CHÂN TRANG */}
            <div className="pt-5 mt-6 border-t border-[#232d42] flex justify-end items-center gap-4 bg-[#161b26]">
              {/* BKAV HaiHS: Kết xuất nút đóng duy nhất nếu ở chế độ xem thông tin cấu hình thuần túy */}
              {isViewMode ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#1e2533] border border-[#232d42] hover:bg-gray-800 rounded-full transition-all cursor-pointer shadow-md"
                >
                  Close Details
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancelWithCheck}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-white text-xs font-bold px-4 py-2.5 transition-all disabled:opacity-30 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="px-6 py-2.5 text-xs font-bold text-[#0f172a] bg-[#93c5fd] hover:bg-[#7dd3fc] rounded-full transition-all shadow-xl shadow-blue-500/5 disabled:bg-gray-800 disabled:text-gray-600 cursor-pointer flex items-center gap-2 justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader size={14} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>
                        {isEditMode ? "Update Group" : "Initialize Group"}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={() => setIsConfirmCancelOpen(false)}
        onConfirm={onClose}
        title="Xác nhận hủy tác vụ"
        message="Hệ thống phát hiện bạn đang nhập dở. Bạn có chắc muốn hủy bỏ tiến trình này không?"
        confirmText="Đồng ý hủy"
        cancelText="Tiếp tục nhập"
        type="warning"
      />
    </>
  );
};
// BKAV HaiHS: Component Tạo mới, Sửa đổi và Xem chi tiết nhóm quyền - end

export default GroupFormModal;
