import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiX, FiLoader, FiSearch, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../../components/Toast";
import {
  getGroupDetailsApi,
  searchUsersApi,
  removeUserFromGroupApi,
} from "../groupApi";
import ConfirmModal from "../../../components/ConfirmModal";
import { bulkAddUsersToGroupApi } from "../../users/userApi";

// BKAV HaiHS: Component quản lý thành viên nhóm - start
const GroupMembersModal = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  onRefreshTotal,
}) => {
  if (!isOpen) return null;

  const { permissions } = useAuth();
  const { showToast } = useToast();
  const userPermissions = permissions || [];

  const hasAddPermission = userPermissions.includes("GROUP_ADD_USER");
  const hasDeletePermission = userPermissions.includes("GROUP_DELETE_USER");

  const [members, setMembers] = useState([]);
  const [localFilter, setLocalFilter] = useState("");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const loadCurrentMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    try {
      const res = await getGroupDetailsApi(groupId);
      setMembers(res?.data?.users || res?.data?.members || []);
    } catch (err) {
      showToast(
        "Khong the tai danh sach thanh vien hien tai cua nhom",
        "error",
      );
    } finally {
      setIsLoadingMembers(false);
    }
  }, [groupId, showToast]);

  useEffect(() => {
    loadCurrentMembers();
    setPendingUsers([]);
    setSearchKeyword("");
    setLocalFilter("");
  }, [groupId, loadCurrentMembers, isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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
        console.error("Loi duong truyen tim kiem tai khoan gan nhom:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [],
  );

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

  const handleSelectUserPending = (user) => {
    if (
      members.some((m) => m.id === user.id) ||
      pendingUsers.some((p) => p.id === user.id)
    ) {
      showToast(
        "Nhan su nay da ton tai trong khay thanh vien hien tai hoac danh sach cho gan",
        "warning",
      );
    } else {
      setPendingUsers((prev) => [
        ...prev,
        { id: user.id, fullname: user.fullname, email: user.email },
      ]);
    }
    setSearchKeyword("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  const handleRemovePendingChip = (userId) => {
    setPendingUsers((prev) => prev.filter((p) => p.id !== userId));
  };

  const handleExecuteAddMembers = async () => {
    if (pendingUsers.length === 0 || isProcessingAction) return;
    setIsProcessingAction(true);
    try {
      await bulkAddUsersToGroupApi(
        groupId,
        pendingUsers.map((p) => p.id),
      );
      showToast(
        `Da bo sung thanh cong ${pendingUsers.length} nhan su vao nhom`,
        "success",
      );
      setPendingUsers([]);
      loadCurrentMembers();
      onRefreshTotal();
    } catch (err) {
      showToast(
        "Xay ra loi trong qua trinh thuc thi bo sung thanh vien",
        "error",
      );
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleOpenRemoveConfirm = (user) => {
    if (!hasDeletePermission) {
      showToast(
        "Tai khoan cua ban khong co quyen GROUP_DELETE_USER de truc xuat thanh vien",
        "warning",
      );
      return;
    }
    setUserToRemove(user);
    setIsConfirmDeleteOpen(true);
  };

  const handleExecuteRemoveMember = async () => {
    if (!userToRemove || isProcessingAction) return;
    setIsProcessingAction(true);
    try {
      await removeUserFromGroupApi(groupId, userToRemove.id);
      showToast(
        `Da truc xuat thanh cong tai khoan [${userToRemove.fullname || userToRemove.email}]`,
        "success",
      );
      setIsConfirmDeleteOpen(false);
      loadCurrentMembers();
      onRefreshTotal();
    } catch (err) {
      showToast(
        "Truc xuat thanh vien that bai do loi ket noi he thong",
        "error",
      );
    } finally {
      setIsProcessingAction(false);
      setUserToRemove(null);
    }
  };

  const filteredMembers = members.filter((m) => {
    const searchString = localFilter.toLowerCase();
    return (
      (m.fullname || "").toLowerCase().includes(searchString) ||
      (m.email || "").toLowerCase().includes(searchString)
    );
  });

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
        <div className="w-full max-w-md bg-white dark:bg-[#161b26] border border-gray-200 dark:border-[#232d42] rounded-2xl shadow-2xl flex flex-col relative overflow-visible max-h-[90vh] transition-colors duration-300">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-[#232d42] flex justify-between items-center bg-gray-50 dark:bg-[#111622]/30 rounded-t-2xl shrink-0 transition-colors duration-300">
            <div className="space-y-1">
              <h3 className="text-md font-bold text-gray-900 dark:text-white tracking-wide truncate pr-4 transition-colors duration-300">
                Manage Group Members: {groupName}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col min-h-0 space-y-5 overflow-y-auto cyber-scrollbar">
            <div className="space-y-1.5 shrink-0">
              <div className="w-full relative">
                <input
                  type="text"
                  value={localFilter}
                  onChange={(e) => setLocalFilter(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-gray-50 dark:bg-[#0b0f19] border border-gray-200 dark:border-[#232d42] focus:border-blue-500/40 text-xs text-gray-900 dark:text-gray-100 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
                />
                <FiSearch
                  size={14}
                  className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 transition-colors"
                />
              </div>
            </div>

            {hasAddPermission ? (
              <div
                className="space-y-2 shrink-0 border-t border-gray-200 dark:border-[#232d42]/40 pt-4 relative overflow-visible transition-colors"
                ref={searchRef}
              >
                <label className="text-[10px] font-mono font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase transition-colors">
                  Add New Member
                </label>
                <div className="flex gap-2 w-full relative">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Search for new members to add..."
                      className="w-full bg-gray-50 dark:bg-[#0b0f19] border border-gray-200 dark:border-[#232d42] focus:border-blue-500/40 text-xs text-gray-900 dark:text-gray-100 rounded-xl pl-11 pr-10 py-2.5 focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
                    />
                    <FiSearch
                      size={14}
                      className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 transition-colors"
                    />
                    {isSearching && (
                      <FiLoader
                        size={13}
                        className="absolute right-4 top-3.5 text-blue-500 animate-spin"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleExecuteAddMembers}
                    disabled={pendingUsers.length === 0 || isProcessingAction}
                    className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-xs font-bold text-white rounded-xl transition-all cursor-pointer shadow-md shrink-0"
                  >
                    Add
                  </button>

                  {isDropdownOpen && searchResults.length > 0 && (
                    <div
                      onScroll={handleSearchScroll}
                      className="cyber-scrollbar absolute left-0 right-0 mt-11 max-h-[140px] overflow-y-auto bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-[#232d42] rounded-xl shadow-2xl z-[110] divide-y divide-gray-100 dark:divide-[#232d42]/60 animate-fade-in transition-colors"
                    >
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleSelectUserPending(user)}
                          className="px-4 py-2 text-xs cursor-pointer flex flex-col text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="font-bold text-gray-900 dark:text-white capitalize">
                            {user.fullname || "Unknown"}
                          </span>
                          <span className="text-gray-400 dark:text-gray-500 font-mono text-[10px]">
                            {user.email}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {pendingUsers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 animate-fade-in">
                    {pendingUsers.map((pUser) => (
                      <div
                        key={pUser.id}
                        className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 text-[11px] font-semibold text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg transition-colors"
                      >
                        <span className="capitalize truncate max-w-[100px]">
                          {pUser.fullname || pUser.email?.split("@")[0]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePendingChip(pUser.id)}
                          className="text-blue-400/60 hover:text-red-500 cursor-pointer"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-gray-400 dark:text-gray-600 italic px-1 transition-colors">
                Chuc nang cap them thanh vien moi yeu cau ma quyen
                GROUP_ADD_USER
              </div>
            )}

            <div className="space-y-2 border-t border-gray-200 dark:border-[#232d42]/40 pt-4 shrink-0 transition-colors">
              <label className="text-[10px] font-mono font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase select-none transition-colors">
                Users ({filteredMembers.length})
              </label>

              <div className="h-[270px] overflow-y-auto space-y-1.5 pr-1 cyber-scrollbar">
                {isLoadingMembers ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 animate-pulse bg-gray-100 dark:bg-[#111622]/20 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                        <div className="space-y-1">
                          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredMembers.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400 dark:text-gray-600 italic select-none transition-colors">
                    Khong tim thay nhan su phu hop nao
                  </div>
                ) : (
                  filteredMembers.map((member) => {
                    const displayName =
                      member.fullname || member.email?.split("@")[0] || "User";
                    const initials = displayName.substring(0, 2).toUpperCase();
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1e2533]/30 border border-transparent hover:border-gray-200 dark:hover:border-[#232d42]/40 transition-all group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-[#1e293b] dark:to-[#0f172a] border border-gray-200 dark:border-[#232d42] flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 shrink-0 transition-colors">
                            {initials}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-gray-900 dark:text-white capitalize truncate transition-colors">
                              {displayName}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-500 truncate mt-0.5 transition-colors">
                              {member.email}
                            </span>
                          </div>
                        </div>

                        {hasDeletePermission && (
                          <button
                            type="button"
                            onClick={() => handleOpenRemoveConfirm(member)}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-[#232d42] flex justify-end items-center gap-3 bg-white dark:bg-[#161b26] shrink-0 transition-colors">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#232d42] bg-gray-50 dark:bg-[#111622] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Update Group
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleExecuteRemoveMember}
        title="Xác nhận trục xuất"
        message={`Bạn có chắc chắn muốn loại bỏ nhân sự này khỏi nhóm quyền [${groupName}] không? Tài khoản sẽ mất toàn bộ các quyền hạn kế thừa lập tức!`}
        confirmText="Đồng ý xóa"
        cancelText="Giữ lại"
        type="danger"
      />
    </>
  );
};
// BKAV HaiHS: Component quản lý thành viên nhóm - end

export default GroupMembersModal;
