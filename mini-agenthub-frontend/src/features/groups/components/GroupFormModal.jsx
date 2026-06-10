import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiX, FiLoader, FiSearch } from "react-icons/fi";
import { useToast } from "../../../components/Toast";
import { createGroupApi, updateGroupApi, searchUsersApi } from "../groupApi";
import ConfirmModal from "../../../components/ConfirmModal";

// BKAV HaiHS: Component form tạo mới và chỉnh sủa nhóm - start
const GroupFormModal = ({ isOpen, onClose, groupToEdit, onSuccess }) => {
  if (!isOpen) return null;

  const { showToast } = useToast();
  const isEditMode = !!groupToEdit;

  // Khai bao cac trang thai giu thong tin co ban cua form ma tran phan quyen
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  // Khai bao cac trang thai phuc vu luong tim kiem nhan su phan trang vo han
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Mang anh xa ma quyen ma tran cho phan he tai khoan nguoi dung
  const userMatrix = [
    { id: "USER_C", action: "Create", desc: "New Resources" },
    { id: "USER_R", action: "Read", desc: "Resource Data" },
    { id: "USER_U", action: "Update", desc: "Edit Content" },
    { id: "USER_D", action: "Delete", desc: "Remove Assets" },
  ];

  // Mang anh xa ma quyen ma tran cho phan he nhom quyen he thong
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

  // Dong bo du lieu cu len bieu mau form neu dang chay o che do cap nhat thong tin
  useEffect(() => {
    if (isEditMode && groupToEdit) {
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
  }, [groupToEdit, isEditMode, isOpen]);

  // Tu dong khep lai menu tha xuong khi nguoi dung click chuot ra vung ngoai
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Thuc hien truy van luong du lieu tim kiem nhan su tu mien api may chu
  const executeSearch = useCallback(
    async (keyword, pageNum = 1, isLoadMore = false) => {
      if (!keyword.trim()) {
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
    [],
  );

  // Tre debounce tu dong bat bat cuoc goi api khi dung gop chu 500ms
  useEffect(() => {
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
  }, [searchKeyword, executeSearch]);

  // Cuon xuong day de tai thong tin trang nhan su tiep theo trong dropdown
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

  // Dua thong tin nguoi dung vao mang thanh vien va lam sach thanh tim kiem
  const handleSelectUser = (user) => {
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

  // Go bo mot chip tag thanh vien ra khoi bo khung luu tru
  const handleRemoveMember = (userId) => {
    setMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  // Tich chon hoac hủy tich ma quyen ma tran ma khong gay anh huong tab doi dien
  const handleTogglePermission = (permId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId],
    );
  };

  // Kiem tra du lieu nhap do de canh bao xac nhan khi click nut huy hoac close
  const handleCancelWithCheck = () => {
    const hasData =
      name.trim() || selectedPermissions.length > 0 || members.length > 0;
    if (hasData) {
      setIsConfirmCancelOpen(true);
    } else {
      onClose();
    }
  };

  // Gui payload dact trung len he thong kem co che khong xoa form neu trung ten nhom
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

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
  const modalTitle = isEditMode ? "Update Group" : "Create New Group";
  const modalSubtitle = isEditMode
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
          {/* Dau popup tieu de va mo ta chi tiet */}
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
            {/* KHỐI 1: IDENTITY - Thiet ke hang ngang dong phang Grid an khop 100% anh mau */}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Quantum Research Team"
                    className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/40 text-sm text-gray-100 rounded-xl px-4 py-2.5 focus:outline-none transition-all placeholder-gray-600"
                  />
                </div>

                {/* Bo chon Entity Type dang ken nén lien khoi dung chuan anh 1 */}
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

            {/* KHỐI 2: PERMISSIONS MATRIX - Khung ma tran bang hang doc phẳng dung chuan */}
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
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => handleTogglePermission(row.id)}
                              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer mx-auto"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KHỐI 3: INITIAL MEMBERS - Chi render phan khung chon va chips neu o che do tao moi */}
            {!isEditMode && (
              <div
                className="space-y-2.5 relative overflow-visible"
                ref={searchRef}
              >
                <label className="text-[10px] font-mono font-bold tracking-widest text-blue-400/90 uppercase">
                  Initial Members
                </label>
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

                {isDropdownOpen && searchResults.length > 0 && (
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
                    {isSearching && (
                      <div className="py-2 flex justify-center items-center text-blue-500 bg-[#0b0f19]/10">
                        <FiLoader size={12} className="animate-spin" />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {members.map((member) => {
                    const displayChipName =
                      member.fullname || member.email?.split("@")[0] || "User";
                    const avatarCode = displayChipName
                      .substring(0, 2)
                      .toUpperCase();
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 bg-[#1c2333] border border-[#232d42] text-xs font-semibold text-gray-300 px-2.5 py-1.5 rounded-xl animate-fade-in"
                      >
                        <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[9px] flex items-center justify-center shrink-0">
                          {avatarCode}
                        </div>
                        <span className="capitalize">{displayChipName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer ml-1"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* KHỐI CHÂN TRANG: Nut cam ket hanh dong dang vien nhộng Periwinkle sang trong */}
            <div className="pt-5 mt-6 border-t border-[#232d42] flex justify-end items-center gap-4 bg-[#161b26]">
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
// BKAV HaiHS: Component form tạo mới và chỉnh sủa nhóm - end

export default GroupFormModal;
