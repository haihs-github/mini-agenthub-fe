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

  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const userMatrix = [
    { id: "USER_C", action: "Create", desc: "New Resources" },
    { id: "USER_R", action: "Read", desc: "Resource Data" },
    { id: "USER_U", action: "Update", desc: "Edit Content" },
    { id: "USER_D", action: "Delete", desc: "Remove Assets" },
  ];

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

  const handleRemoveMember = (userId) => {
    if (isViewMode) return;
    setMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  const handleTogglePermission = (permId) => {
    if (isViewMode) return;
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId],
    );
  };

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
        .cyber-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .cyber-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
        .dark .cyber-scrollbar::-webkit-scrollbar-thumb { background: #232d42; }
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fade-in">
        <div className="w-full max-w-xl bg-white border border-gray-200 dark:bg-[#161b26] dark:border-[#232d42] rounded-2xl shadow-2xl flex flex-col relative overflow-visible transition-colors">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-[#232d42] flex justify-between items-start bg-gray-50 dark:bg-[#111622]/30 rounded-t-2xl relative transition-colors">
            <div className="space-y-1">
              <h3 className="text-md font-bold text-gray-900 dark:text-white tracking-wide">
                {modalTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {modalSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancelWithCheck}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/60 transition-all cursor-pointer absolute right-5 top-5"
            >
              <FiX size={18} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6 flex-1 overflow-visible"
          >
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400/90 uppercase">
                Identity
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Group Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isViewMode}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Quantum Research Team"
                    className="w-full bg-gray-50 dark:bg-[#0b0f19] border border-gray-200 dark:border-[#232d42] focus:border-blue-500/40 text-sm text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Entity Type
                  </label>
                  <div className="flex bg-gray-50 dark:bg-[#0b0f19] border border-gray-200 dark:border-[#232d42] p-1 rounded-xl h-[44px] items-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab("user")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${activeTab === "user" ? "bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      Users
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("group")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${activeTab === "group" ? "bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      Groups
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400/90 uppercase">
                  RBAC Permissions Matrix
                </label>
              </div>
              <div className="w-full bg-gray-50 dark:bg-[#0b0f19] border border-gray-200 dark:border-[#232d42] rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-[#232d42] text-[10px] font-bold text-gray-500 bg-gray-100/50 dark:bg-[#111622]/40">
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-center">Grant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-[#232d42]/40 text-xs text-gray-700 dark:text-gray-300">
                    {currentMatrix.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-100 dark:hover:bg-[#1e2533]/20"
                      >
                        <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-gray-200">
                          {row.action}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                          {row.desc}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            disabled={isViewMode}
                            checked={selectedPermissions.includes(row.id)}
                            onChange={() => handleTogglePermission(row.id)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer mx-auto"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {!isEditMode && (
              <div className="space-y-2.5 relative" ref={searchRef}>
                <label className="text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400/90 uppercase">
                  Initial Members
                </label>
                {!isViewMode && (
                  <div className="w-full relative">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Search..."
                      className="w-full bg-gray-50 dark:bg-[#0b0f19] border border-gray-200 dark:border-[#232d42] text-sm text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                )}
                {isDropdownOpen && (
                  <div
                    onScroll={handleSearchScroll}
                    className="cyber-scrollbar absolute left-0 right-0 mt-1 max-h-[150px] overflow-y-auto bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-[#232d42] rounded-xl shadow-xl z-50"
                  >
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="px-4 py-2 text-xs cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {user.fullname}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-[#1c2333] text-xs px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#2d3952]"
                    >
                      {member.fullname}{" "}
                      {!isViewMode && (
                        <FiX
                          size={12}
                          onClick={() => handleRemoveMember(member.id)}
                          className="cursor-pointer"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-5 mt-6 border-t border-gray-200 dark:border-[#232d42] flex justify-end gap-4 bg-white dark:bg-[#161b26]">
              {isViewMode ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1e2533] rounded-full"
                >
                  Close
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-full"
                >
                  {isEditMode ? "Update" : "Initialize"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default GroupFormModal;
