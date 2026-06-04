import React, { useState, useEffect, useRef } from "react";
import { FiX, FiChevronDown, FiLoader } from "react-icons/fi";
import { useToast } from "../../../components/Toast";
import { createUserApi, updateUserApi, getGroupsApi } from "../userApi";
import ConfirmModal from "../../../components/ConfirmModal"; // NẠP COMPONENT XÁC NHẬN MỚI

// BKAV HaiHS : Component Popup form Thêm và sửa user - start
const UserFormModal = ({ isOpen, onClose, userToEdit, onSuccess }) => {
  if (!isOpen) return null;

  const { showToast } = useToast();
  const isEditMode = !!userToEdit;

  // State form dữ liệu
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State kiểm soát dropdown nhóm
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupPage, setGroupPage] = useState(1);
  const [groupHasMore, setGroupHasMore] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // 🚀 STATE ĐIỀU KHIỂN MODAL XÁC NHẬN HỦY
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isEditMode && userToEdit) {
      setFullName(userToEdit.fullname || "");
      setEmail(userToEdit.email || "");
      setSelectedGroups(userToEdit.groups || []);
    } else {
      setFullName("");
      setEmail("");
      setSelectedGroups([]);
    }
  }, [userToEdit, isEditMode, isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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
      console.error("Không tải được danh sách nhóm:", err);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen && groups.length === 0) {
      setGroupHasMore(true);
      fetchGroups(1, false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchGroups(groupPage + 1, true);
    }
  };

  const handleSelectGroup = (group) => {
    if (selectedGroups.some((g) => g.id === group.id)) {
      setSelectedGroups((prev) => prev.filter((g) => g.id !== group.id));
    } else {
      setSelectedGroups((prev) => [
        ...prev,
        { id: group.id, name: group.name },
      ]);
    }
  };

  const removeGroupChip = (groupId, e) => {
    e.stopPropagation();
    setSelectedGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  // 🚀 KÍCH HOẠT QUY TRÌNH KIỂM TRA ĐỂ MỞ MODAL XÁC NHẬN CUSTOM
  const handleCancelWithCheck = () => {
    const hasData =
      fullName.trim() || email.trim() || selectedGroups.length > 0;
    if (hasData) {
      setIsConfirmCancelOpen(true); // Bật popup custom thay cho window.confirm cũ kĩ
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      fullname: fullName.trim(),
      email: email.trim(),
      groupIds: selectedGroups.map((g) => g.id),
    };

    try {
      if (isEditMode) {
        await updateUserApi(userToEdit.id, payload);
        showToast("Cập nhật thông tin thành viên thành công!", "success");
      } else {
        await createUserApi(payload);
        showToast("Thêm mới thành viên vào mạng lưới thành công!", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Đường truyền xử lý API thất bại";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none animate-fade-in">
        {/* 🌟 ĐÃ SỬA: Bỏ class overflow-hidden ở thẻ div này để dropdown không bị bóp nghẹt cắt cụt */}
        <div className="w-full max-w-lg bg-[#161b26] border border-[#232d42] rounded-2xl shadow-2xl flex flex-col relative">
          {/* Đầu popup */}
          <div className="px-6 py-4 border-b border-[#232d42] flex justify-between items-center bg-[#111622]/50 rounded-t-2xl">
            <h3 className="text-md font-bold text-white tracking-wide">
              {isEditMode ? "Update User" : "Add New User"}
            </h3>
            <button
              type="button"
              onClick={handleCancelWithCheck}
              className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Thân popup */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 pb-24">
            {/* Trường 1: Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/50 text-sm text-gray-100 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder-gray-600"
              />
            </div>

            {/* Trường 2: Email Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Email Address
              </label>
              {/* 🚀 ĐÃ SỬA: Loại bỏ disabled={isEditMode}, cho phép sửa đổi email thoải mái theo mong muốn */}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/50 text-sm text-gray-100 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder-gray-600 font-mono"
              />
            </div>

            {/* Trường 3: Dropdown Groups (Hiển thị dài 5 nhóm thoải mái) */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {isEditMode
                  ? "Groups (Multi-select)"
                  : "Assign to Group (Optional)"}
              </label>

              <div
                onClick={toggleDropdown}
                className="w-full bg-[#0b0f19] border border-[#232d42] hover:border-gray-700 rounded-xl px-3 py-2.5 flex flex-wrap items-center justify-between gap-1.5 min-h-[46px] cursor-pointer transition-all"
              >
                <div className="flex flex-wrap gap-1.5 items-center flex-1">
                  {selectedGroups.length === 0 ? (
                    <span className="text-sm text-gray-600 pl-1">
                      {isEditMode ? "Add group..." : "Select a group"}
                    </span>
                  ) : (
                    selectedGroups.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg animate-fade-in"
                      >
                        <span>{g.name}</span>
                        <button
                          type="button"
                          onClick={(e) => removeGroupChip(g.id, e)}
                          className="text-blue-400/60 hover:text-red-400 transition-colors"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <FiChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-blue-500" : ""}`}
                />
              </div>

              {/* 🚀 ĐÃ NÂNG CẤP DÀI RA CHUẨN DESIGN: max-h-[220px] giúp chứa gọn 5 dòng mượt mà */}
              {isDropdownOpen && (
                <div
                  onScroll={handleDropdownScroll}
                  className="absolute left-0 right-0 mt-1 max-h-[220px] overflow-y-auto bg-[#161b26] border border-[#232d42] rounded-xl shadow-2xl z-[55] divide-y divide-[#232d42]/60 animate-fade-in"
                >
                  {groups.length === 0 && !isLoadingGroups ? (
                    <div className="p-4 text-xs text-gray-500 italic text-center">
                      Không tìm thấy nhóm quyền nào.
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
                          className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                            isChecked
                              ? "bg-blue-600/10 text-blue-400 font-bold"
                              : "text-gray-300 hover:bg-gray-800"
                          }`}
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

            {/* Chân thanh cố định nút hành động */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[#232d42] flex justify-end items-center gap-3 bg-[#111622]/90 rounded-b-2xl px-6 py-4">
              <button
                type="button"
                onClick={handleCancelWithCheck}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white border border-[#232d42] bg-[#161b26] hover:bg-gray-800 rounded-xl transition-all disabled:opacity-30 cursor-pointer"
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
                    <span>{isEditMode ? "Update User" : "Create User"}</span>
                    <span>{isEditMode ? "✓" : "→"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🚀 LẮP ĐẶT COMPONENT XÁC NHẬN CUSTOM KHI BẤM HUỶ FORM */}
      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={() => setIsConfirmCancelOpen(false)}
        onConfirm={onClose} // Người dùng đồng ý -> Đóng toàn bộ Form Modal lớn
        title="Xác nhận hủy tác vụ"
        message="Hệ thống phát hiện bạn đang nhập dở dữ liệu. Bạn có chắc chắn muốn hủy bỏ tiến trình thêm/sửa thành viên này không?"
        confirmText="Đồng ý hủy"
        cancelText="Tiếp tục nhập"
        type="warning" // Đổi màu vàng cảnh báo nhẹ nhàng thân thiện
      />
    </>
  );
};
// BKAV HaiHS : Component Popup form Thêm và sửa user - end

export default UserFormModal;
