import React, { useState, useEffect, useRef } from "react";
import { FiX, FiChevronDown, FiLoader } from "react-icons/fi";
import { useToast } from "../../../components/Toast";
import { createUserApi, updateUserApi, getGroupsApi } from "../userApi";
import ConfirmModal from "../../../components/ConfirmModal";

// BKAV HaiHS: Component Modal da nang hop nhat chuc nang quan ly thanh vien
const UserFormModal = ({
  isOpen,
  onClose,
  userToEdit,
  isViewMode = false,
  onSuccess,
}) => {
  // Ngat render neu modal dang o trang thai dong
  if (!isOpen) return null;

  const { showToast } = useToast();
  const isEditMode = !!userToEdit;

  // Khai bao cac state luu tru thong tin co ban cua form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Khai bao cac state kiem soat phan trang cho dropdown nhom
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupPage, setGroupPage] = useState(1);
  const [groupHasMore, setGroupHasMore] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Vong doi dong bo hoa thong tin nguoi dung tu props vao form
  useEffect(() => {
    if ((isEditMode || isViewMode) && userToEdit) {
      console.log("Kiem tra payload backend gui ve:", userToEdit);
      setFullName(userToEdit.fullname || "");
      setEmail(userToEdit.email || "");
      setSelectedGroups(userToEdit.groups || []);

      const directPermissions = userToEdit.permissions || [];
      const inheritedPermissions =
        userToEdit.groups?.flatMap((group) => group.permissions || []) || [];
      const totalCombinedPermissions = Array.from(
        new Set([...directPermissions, ...inheritedPermissions]),
      );

      // Sua lai ten bien chuan xac de nap mang quyen tong hop vao giao dien
      setPermissions(totalCombinedPermissions);
    } else {
      setFullName("");
      setEmail("");
      setSelectedGroups([]);
      setPermissions([]);
    }
  }, [userToEdit, isEditMode, isViewMode, isOpen]);

  // Tu dong dong dropdown nhom quyen khi click ra ngoai vung o chon
  useEffect(() => {
    if (isViewMode) return;
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isViewMode]);

  // Tai danh sach cac nhom quyen he thong kem theo phan trang cuon vo han
  const fetchGroups = async (page = 1, isLoadMore = false) => {
    if (isLoadingGroups || (!groupHasMore && isLoadMore)) return;
    setIsLoadingGroups(true);
    try {
      const res = await getGroupsApi(page, 10);
      const fetchedList = res?.data || (Array.isArray(res) ? res : []);

      if (isLoadMore) {
        setGroups((prev) => [...prev, ...fetchedList]);
      } else {
        setGroups(fetchedList);
      }

      if (fetchedList.length < 10) setGroupHasMore(false);
      setGroupPage(page);
    } catch (err) {
      console.error("Khong tai duoc danh sach nhom quyen:", err);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Xu ly hanh vi dong mo va kich hoat tai du lieu trang dau cho dropdown
  const toggleDropdown = () => {
    if (isViewMode) return;
    if (!isDropdownOpen && groups.length === 0) {
      setGroupHasMore(true);
      fetchGroups(1, false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Tinh toan vi tri cuon chuot de nap trang ke tiep khi nguoi dung cuon gan day
  const handleDropdownScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchGroups(groupPage + 1, true);
    }
  };

  // Them hoac xoa mot nhom khoi danh sach lua chon o dropdown
  const handleSelectGroup = (group) => {
    if (isViewMode) return;
    if (selectedGroups.some((g) => g.id === group.id)) {
      setSelectedGroups((prev) => prev.filter((g) => g.id !== group.id));
    } else {
      setSelectedGroups((prev) => [
        ...prev,
        { id: group.id, name: group.name },
      ]);
    }
  };

  // Go nhanh nhom ra khoi o hien thi bang nut bam dau X tren chip tag
  const removeGroupChip = (groupId, e) => {
    e.stopPropagation();
    if (isViewMode) return;
    setSelectedGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  // Kiem tra du lieu nhap do de dua ra canh bao xac nhan khi thoat form
  const handleCancelWithCheck = () => {
    if (isViewMode) {
      onClose();
      return;
    }
    const hasData =
      fullName.trim() || email.trim() || selectedGroups.length > 0;
    if (hasData) {
      setIsConfirmCancelOpen(true);
    } else {
      onClose();
    }
  };

  // Thu thap du lieu form va gui len dau mien API xu ly o Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode || !email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      fullname: fullName.trim(),
      email: email.trim(),
      groupIds: selectedGroups.map((g) => g.id),
    };

    try {
      if (isEditMode) {
        await updateUserApi(userToEdit.id, payload);
        showToast("Cap nhat thong tin thanh vien thanh cong!", "success");
      } else {
        await createUserApi(payload);
        showToast("Them moi thanh vien vao mang luoi thanh cong!", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Duong truyen xu ly API that bai";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isViewMode
    ? "User Details"
    : isEditMode
      ? "Update User"
      : "Add New User";

  return (
    <>
      <style>{`
        .cyber-scrollbar::-webkit-scrollbar { width: 5px; }
        .cyber-scrollbar::-webkit-scrollbar-track { background: #0b0f19; }
        .cyber-scrollbar::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 99px; }
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-fade-in">
        <div className="w-full max-w-lg bg-[#161b26] border border-[#232d42] rounded-2xl shadow-2xl flex flex-col relative overflow-visible">
          {/* Thanh tieu de dau popup */}
          <div className="px-6 py-4 border-b border-[#232d42] flex justify-between items-center bg-[#111622]/50 rounded-t-2xl shrink-0">
            <h3 className="text-sm font-bold text-white tracking-wide">
              {modalTitle}
            </h3>
            <button
              type="button"
              onClick={handleCancelWithCheck}
              className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* O nhap thong tin nhan su */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 flex-1 overflow-visible"
          >
            {/* Truong nhap ten thanh vien */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Full Name
              </label>
              <input
                type="text"
                disabled={isViewMode}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={
                  isViewMode ? "Chua cap nhat ten" : "Enter full name"
                }
                className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/50 text-sm text-gray-100 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            {/* Truong nhap email tai khoan */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={isViewMode}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/50 text-sm text-gray-100 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder-gray-600 font-mono disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            {/* Truong hien thi chip tag danh sach nhom */}
            <div
              className="space-y-2 relative overflow-visible"
              ref={dropdownRef}
            >
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {isViewMode
                  ? "Belongs to Groups"
                  : isEditMode
                    ? "Groups (Multi-select)"
                    : "Assign to Group (Optional)"}
              </label>
              <div
                onClick={toggleDropdown}
                className={`w-full bg-[#0b0f19] border border-[#232d42] rounded-xl px-3 py-2.5 flex flex-wrap items-center justify-between gap-1.5 min-h-[46px] transition-all ${isViewMode ? "cursor-not-allowed opacity-70" : "hover:border-gray-700 cursor-pointer"}`}
              >
                <div className="flex flex-wrap gap-1.5 items-center flex-1">
                  {selectedGroups.length === 0 ? (
                    <span className="text-sm text-gray-600 pl-1">
                      {isViewMode
                        ? "Khong thuoc nhom quyen nao"
                        : isEditMode
                          ? "Add group..."
                          : "Select a group"}
                    </span>
                  ) : (
                    selectedGroups.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg"
                      >
                        <span>{g.name}</span>
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={(e) => removeGroupChip(g.id, e)}
                            className="text-blue-400/60 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <FiX size={12} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {!isViewMode && (
                  <FiChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-blue-500" : ""}`}
                  />
                )}
              </div>

              {/* Danh sach tha xuong chon nhom quyen he thong */}
              {isDropdownOpen && !isViewMode && (
                <div
                  onScroll={handleDropdownScroll}
                  className="cyber-scrollbar absolute left-0 right-0 mt-1.5 max-h-[210px] overflow-y-auto bg-[#1a202c] border border-[#232d42] rounded-xl shadow-2xl z-[100] divide-y divide-[#232d42]/60 animate-fade-in"
                >
                  {groups.length === 0 && !isLoadingGroups ? (
                    <div className="p-4 text-xs text-gray-500 italic text-center">
                      Khong tim thay nhom quyen nao.
                    </div>
                  ) : (
                    groups.map((group) => {
                      const isChecked = selectedGroups.some(
                        (g) => g.id === group.id,
                      );
                      return (
                        <div
                          key={group.id}
                          onClick={() => handleSelectGroup(group)}
                          className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${isChecked ? "bg-blue-600/10 text-blue-400 font-bold" : "text-gray-300 hover:bg-gray-800"}`}
                        >
                          <span>{group.name}</span>
                          {isChecked && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50" />
                          )}
                        </div>
                      );
                    })
                  )}
                  {isLoadingGroups && (
                    <div className="py-2.5 flex justify-center items-center text-blue-500 bg-[#0b0f19]/20">
                      <FiLoader size={14} className="animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Truong hien thi mang quyen hop nhat giua ca nhan va nhom */}
            {isViewMode && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  He thong quyen han tong hop (Permissions)
                </label>
                <div className="cyber-scrollbar w-full bg-[#0b0f19] border border-[#232d42] rounded-xl px-3 py-3 flex flex-wrap gap-2 min-h-[46px] max-h-36 overflow-y-auto cursor-not-allowed opacity-80">
                  {permissions.length === 0 ? (
                    <span className="text-sm text-gray-600 pl-1 italic">
                      Tai khoan nay chua so huu quyen han ca biet nao
                    </span>
                  ) : (
                    permissions.map((perm, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-600/10 border border-emerald-500/20 text-[11px] font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-lg shadow-sm"
                      >
                        {perm}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Khong gian chan trang chua cac nut bam hanh dong */}
            <div className="pt-6 mt-8 border-t border-[#232d42] flex justify-end items-center gap-3 bg-[#161b26] relative z-10">
              {isViewMode ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#111622] border border-[#232d42] hover:bg-gray-800 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Đong cua so
                </button>
              ) : (
                <>
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
                    disabled={isSubmitting || !email.trim()}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/10 disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none cursor-pointer flex items-center gap-2 min-w-[120px] justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader size={14} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {isEditMode ? "Update User" : "Create User"}
                        </span>
                        <span>{isEditMode ? "✓" : "→"}</span>
                      </>
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
        title="Xac nhan huy tac vu"
        message="He thong phat hien ban dang nhap do du lieu. Ban co chac chan muon huy bo tien trinh them/sua thanh vien nay khong?"
        confirmText="Đong y huy"
        cancelText="Tiep tuc nhap"
        type="warning"
      />
    </>
  );
};

export default UserFormModal;
