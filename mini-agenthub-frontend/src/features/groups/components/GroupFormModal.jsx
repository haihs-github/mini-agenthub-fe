import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiX, FiLoader, FiSearch } from "react-icons/fi";
import { useToast } from "../../../components/Toast";
import { createGroupApi, updateGroupApi, searchUsersApi } from "../groupApi";
import ConfirmModal from "../../../components/ConfirmModal";

// BKAV HaiHS: Linh kien modal da nang dung chung cho ca tao moi va cap nhat nhom quyen he thong
const GroupFormModal = ({ isOpen, onClose, groupToEdit, onSuccess }) => {
  if (!isOpen) return null;

  const { showToast } = useToast();
  const isEditMode = !!groupToEdit;

  // Khai bao cac trang thai co ban cua bieu mau nhom quyen
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  // Khai bao cac trang thai phuc vu tim kiem thanh vien cuon vo han
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Dinh nghia mang ma quyen phan tap ro rang cho tung khoi chuc nang
  const userPermissions = ["USER_C", "USER_R", "USER_U", "USER_D"];
  const groupPermissions = [
    "GROUP_C",
    "GROUP_R",
    "GROUP_U",
    "GROUP_D",
    "GROUP_ADD_USER",
    "GROUP_DELETE_USER",
  ];

  // Do du lieu cu cua nhom len bieu mau neu he thong dang o che do cap nhat
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

  // Lang nghe su kien click ra ngoai de dong khay ket qua tim kiem nhan su
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Thuc thi goi API tim kiem nhan su phan trang tu backend he thong
  const executeSearch = useCallback(
    async (keyword, pageNum = 1, isLoadMore = false) => {
      if (!keyword.trim()) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await searchUsersApi(keyword, pageNum, 2);
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
        console.error("Loi khi quet danh sach nhan su tim kiem:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [],
  );

  // Co che tre debounce tu dong kich hoat tim kiem khi nguoi dung dung go chu 500ms
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

  // Bay hanh vi cuon chuot cham day o ket qua de tai tiep trang nhan su cu hon
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

  // Nap nhan su duoc chon vao mien luu tru thanh vien va reset o tim kiem
  const handleSelectUser = (user) => {
    if (members.some((m) => m.id === user.id)) {
      showToast(
        "Nhan su nay da ton tai trong danh sach thanh vien cua nhom",
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

  // Xoa bo nhanh mot nhan su ra khoi khoi danh sach chip luu tru o duoi
  const handleRemoveMember = (userId) => {
    setMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  // Thay doi trang thai tich chon ma quyen he thong khong lam mat du lieu tab doi dien
  const handleTogglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  // Kiem tra du lieu nhap do va bat canh bao xac nhan khi nguoi dung dong popup
  const handleCancelWithCheck = () => {
    const hasData =
      name.trim() || selectedPermissions.length > 0 || members.length > 0;
    if (hasData) {
      setIsConfirmCancelOpen(true);
    } else {
      onClose();
    }
  };

  // Gui payload len backend kem co che chan bieu mau neu trung lap ten nhom
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
        showToast("Cap nhat thong tin nhom quyen thanh cong", "success");
      } else {
        await createGroupApi(payload);
        showToast("Khoi tao nhom quyen mang luoi moi thanh cong", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        "Ten nhom da ton tai trong he thong hoac xay ra loi API";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .cyber-scrollbar::-webkit-scrollbar { width: 5px; }
        .cyber-scrollbar::-webkit-scrollbar-track { background: #0b0f19; }
        .cyber-scrollbar::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 99px; }
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-fade-in">
        <div className="w-full max-w-xl bg-[#161b26] border border-[#232d42] rounded-2xl shadow-2xl flex flex-col relative overflow-visible">
          {/* Thanh dau trang chua tieu de modal */}
          <div className="px-6 py-4 border-b border-[#232d42] flex justify-between items-center bg-[#111622]/50 rounded-t-2xl">
            <h3 className="text-sm font-bold text-white tracking-wide">
              {isEditMode ? "Update Group Settings" : "Create New Group"}
            </h3>
            <button
              type="button"
              onClick={handleCancelWithCheck}
              className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Khoi form nhap thong tin nhom quyen va tim kiem thanh vien */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 flex-1 overflow-visible"
          >
            {/* O nhap ten nhom */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Group Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/50 text-sm text-gray-100 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder-gray-600"
              />
            </div>

            {/* Khong gian thanh tab lua chon phan bo ma quyen nhan su */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Group Permissions
              </label>
              <div className="flex border-b border-[#232d42] gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("user")}
                  className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === "user" ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                >
                  User Permissions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("group")}
                  className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === "group" ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                >
                  Group Permissions
                </button>
              </div>

              {/* Luoi render cac o check quyen thuoc tab nguoi dung */}
              {activeTab === "user" && (
                <div className="bg-[#0b0f19] border border-[#232d42] rounded-xl p-4 grid grid-cols-2 gap-2.5 animate-fade-in">
                  {userPermissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${isChecked ? "bg-blue-600/10 border-blue-500/40 text-blue-400" : "bg-[#111622]/40 border-gray-800/80 text-gray-500 hover:bg-gray-800"}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm)}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <span>{perm}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Luoi render cac o check quyen thuoc tab nhom co kem bo đôi hang hanh dong dac biet */}
              {activeTab === "group" && (
                <div className="bg-[#0b0f19] border border-[#232d42] rounded-xl p-4 space-y-3 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2.5">
                    {groupPermissions.slice(0, 4).map((perm) => {
                      const isChecked = selectedPermissions.includes(perm);
                      return (
                        <label
                          key={perm}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${isChecked ? "bg-blue-600/10 border-blue-500/40 text-blue-400" : "bg-[#111622]/40 border-gray-800/80 text-gray-500 hover:bg-gray-800"}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(perm)}
                            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span>{perm}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Bo sung doc lap rieng biet hang hanh dong cho ma quyen GROUP_ADD_USER */}
                  <div className="border-t border-[#232d42]/60 pt-2.5">
                    <label
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${selectedPermissions.includes("GROUP_ADD_USER") ? "bg-blue-600/10 border-blue-500/40 text-blue-400" : "bg-[#111622]/40 border-gray-800/80 text-gray-500 hover:bg-gray-800"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(
                            "GROUP_ADD_USER",
                          )}
                          onChange={() =>
                            handleTogglePermission("GROUP_ADD_USER")
                          }
                          className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <span>GROUP_ADD_USER</span>
                      </div>
                      <span className="text-[10px] font-sans text-gray-500 normal-case font-normal">
                        Hành động: Thêm thành viên hàng loạt
                      </span>
                    </label>
                  </div>

                  {/* Bo sung doc lap rieng biet hang hanh dong cho ma quyen GROUP_DELETE_USER */}
                  <div className="pt-0.5">
                    <label
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${selectedPermissions.includes("GROUP_DELETE_USER") ? "bg-blue-600/10 border-blue-500/40 text-blue-400" : "bg-[#111622]/40 border-gray-800/80 text-gray-500 hover:bg-gray-800"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(
                            "GROUP_DELETE_USER",
                          )}
                          onChange={() =>
                            handleTogglePermission("GROUP_DELETE_USER")
                          }
                          className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <span>GROUP_DELETE_USER</span>
                      </div>
                      <span className="text-[10px] font-sans text-gray-500 normal-case font-normal">
                        Hành động: Loại bỏ thành viên hàng loạt
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Truong nhap lua chon va cuon vo han tim kiem thanh vien he thong */}
            <div
              className="space-y-2 relative overflow-visible"
              ref={searchRef}
            >
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Search and Assign Members
              </label>
              <div className="w-full relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/50 text-sm text-gray-100 rounded-xl pl-11 pr-10 py-3 focus:outline-none transition-all placeholder-gray-600"
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

              {/* Menu tha xuong do ra ket qua nhan su dang ho tro cuon vo han */}
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
            </div>

            {/* Khay chips danh sach thanh vien hien tai cua nhom quyen */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Members ({members.length})
              </label>
              <div className="cyber-scrollbar w-full bg-[#0b0f19] border border-[#232d42] rounded-xl px-3 py-3 flex flex-wrap gap-2 min-h-[46px] max-h-28 overflow-y-auto">
                {members.length === 0 ? (
                  <span className="text-xs text-gray-600 pl-1 italic">
                    Chưa cấu hình thành viên nào cho nhóm quyền này
                  </span>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg animate-fade-in"
                    >
                      <span className="capitalize">
                        {member.fullname || member.email?.split("@")[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-blue-400/50 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Khong gian chua bộ đôi nut bam chan trang */}
            <div className="pt-6 mt-8 border-t border-[#232d42] flex justify-end items-center gap-3 bg-[#161b26]">
              <button
                type="button"
                onClick={handleCancelWithCheck}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white border border-[#232d42] bg-[#111622] hover:bg-gray-800 rounded-xl transition-all disabled:opacity-30 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/10 disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none cursor-pointer flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isEditMode ? "Update Group" : "Add to Group"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hop thoai xac nhan custom de bao ve trai nghiem form khi bam dong huy */}
      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={() => setIsConfirmCancelOpen(false)}
        onConfirm={onClose}
        title="Xác nhận hủy tác vụ"
        message="Hệ thống phát hiện bạn đang nhập dở thông tin cấu hình nhóm. Bạn có chắc muốn hủy bỏ tiến trình này không?"
        confirmText="Đồng ý hủy"
        cancelText="Tiếp tục nhập"
        type="warning"
      />
    </>
  );
};

export default GroupFormModal;
