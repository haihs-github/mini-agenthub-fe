import React, { useState, useEffect, useRef } from "react";
import { FiX, FiChevronDown, FiLoader } from "react-icons/fi";
import { useToast } from "../../../components/Toast";
import { createUserApi, updateUserApi, getGroupsApi } from "../userApi";

// BKAV HaiHS : Component Form Thêm/sửa User - start
const UserFormModal = ({ isOpen, onClose, userToEdit, onSuccess }) => {
  if (!isOpen) return null;

  const { showToast } = useToast();
  const isEditMode = !!userToEdit;

  // State quản lý Form nhập liệu
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]); // Mảng các Object { id, name }
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State quản lý Dropdown nhóm (Infinite Scroll)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupPage, setGroupPage] = useState(1);
  const [groupHasMore, setGroupHasMore] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Đổ dữ liệu cũ vào form nếu đang ở chế độ Update User
  useEffect(() => {
    if (isEditMode && userToEdit) {
      setFullname(userToEdit.fullname || "");
      setEmail(userToEdit.email || "");
      setSelectedGroups(userToEdit.groups || []);
    } else {
      // Reset form sạch sẽ nếu ở chế độ Add User
      setFullname("");
      setEmail("");
      setSelectedGroups([]);
    }
  }, [userToEdit, isEditMode, isOpen]);

  // Đóng dropdown khi click chuột ra rìa ngoài không gian
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Hàm gọi API tải danh sách nhóm cuộn vô hạn
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
      console.error("Không thể lấy danh sách nhóm quyền:", err);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Kích hoạt nạp trang nhóm đầu tiên khi mở ô dropdown
  const toggleDropdown = () => {
    if (!isDropdownOpen && groups.length === 0) {
      setGroupHasMore(true);
      fetchGroups(1, false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // BẪY SỰ KIỆN CUỘN ĐÁY DROPDOWN: Kéo xuống cuối danh sách menu thì tự nạp tiếp trang cũ hơn
  const handleDropdownScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchGroups(groupPage + 1, true);
    }
  };

  // Nghiệp vụ thêm / xóa thẻ tag nhóm (Chips)
  const handleSelectGroup = (group) => {
    if (selectedGroups.some((g) => g.id === group.id)) {
      // Nếu nhóm đã được chọn rồi -> Bấm vào thì gỡ bỏ tích tích
      setSelectedGroups((prev) => prev.filter((g) => g.id !== group.id));
    } else {
      // Nếu chưa chọn -> Nạp thêm chip mới vào khay dữ liệu
      setSelectedGroups((prev) => [
        ...prev,
        { id: group.id, name: group.name },
      ]);
    }
  };

  const removeGroupChip = (groupId, e) => {
    e.stopPropagation(); // Ngăn hành vi mở ngược dropdown lên diện rộng
    setSelectedGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  // CHỐT CHẶN HỦY BỎ (Cancel Confirmation Flow)
  const handleCancelWithCheck = () => {
    const hasData =
      fullname.trim() || email.trim() || selectedGroups.length > 0;
    if (hasData) {
      const confirmCancel = window.confirm(
        "Bạn có chắc chắn muốn hủy bỏ tác vụ này không?",
      );
      if (!confirmCancel) return; // Người dùng bấm Không -> Giữ lại giao diện form
    }
    onClose(); // Người dùng đồng ý hủy -> Đóng sập popup an toàn
  };

  // GỬI DỮ LIỆU LÊN API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      fullname: fullname.trim(),
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
      onSuccess(); // Tải lại danh sách tươi mới ở ngoài màn hình chính
      onClose(); // Đóng popup
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Đường truyền xử lý API thất bại";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none animate-fade-in">
      <div className="w-full max-w-lg bg-[#161b26] border border-[#232d42] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* ĐẦU POPUP: Tiêu đề động kèm nút X đóng nhanh */}
        <div className="px-6 py-4 border-b border-[#232d42] flex justify-between items-center bg-[#111622]/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{isEditMode ? "Update User" : "Add New User"}</span>
          </h3>
          <button
            onClick={handleCancelWithCheck}
            className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* THÂN POPUP: Form nhập liệu Tailwind chuyên nghiệp */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {/* Trường 1: Họ và tên */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wide text-gray-400 uppercase">
              Full Name
            </label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter full name"
              className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/50 text-sm text-gray-100 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder-gray-600"
            />
          </div>

          {/* Trường 2: Hòm thư Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wide text-gray-400 uppercase">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-[#0b0f19] border border-[#232d42] focus:border-blue-500/50 text-sm text-gray-100 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder-gray-600 font-mono disabled:opacity-50"
              disabled={isEditMode} // Chế độ sửa không cho phép đổi email cấu trúc tài khoản gốc
            />
          </div>

          {/* Trường 3: Khai thác Dropdown nhóm quyền (Chips + Infinite Scroll) */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="text-xs font-bold tracking-wide text-gray-400 uppercase">
              {isEditMode
                ? "Groups (Multi-select)"
                : "Assign to Group (Optional)"}
            </label>

            {/* Hộp bấm mở kén chọn */}
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
                      className="flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg animate-fade-in group/chip"
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

            {/* KHU VỰC MENU THẢ XUỐNG: Chứa đường truyền cuộn vô hạn */}
            {isDropdownOpen && (
              <div
                ref={menuRef}
                onScroll={handleDropdownScroll}
                className="absolute left-0 right-0 mt-1.5 max-h-48 overflow-y-auto bg-[#161b26] border border-[#232d42] rounded-xl shadow-2xl z-50 divide-y divide-[#232d42]/60 animate-fade-in"
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
                            ? "bg-blue-600/5 text-blue-400 font-bold"
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

                {/* Biểu tượng Loader khi kéo đáy nạp trang tiếp theo */}
                {isLoadingGroups && (
                  <div className="py-3 flex justify-center items-center text-blue-500 bg-[#0b0f19]/40">
                    <FiLoader size={14} className="animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CHÂN POPUP: NÚT CANCEL VÀ NÚT SUBMIT CÓ HOẠT ẢNH LOADING */}
          <div className="pt-4 border-t border-[#232d42] flex justify-end items-center gap-3 bg-[#111622]/20 -mx-6 -mb-6 px-6 py-4">
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
              disabled={isSubmitting || (!isEditMode && !email.trim())}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/10 disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none cursor-pointer flex items-center gap-2 min-w-[110px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <FiLoader size={14} className="animate-spin" />
                  <span>Xử lý...</span>
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
  );
};

export default UserFormModal;
// BKAV HaiHS : Component Form Thêm/sửa User - end
