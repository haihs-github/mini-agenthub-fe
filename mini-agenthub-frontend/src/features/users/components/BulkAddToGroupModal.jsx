import React, { useState, useEffect, useRef } from "react";
import { FiX, FiChevronDown, FiLoader } from "react-icons/fi";
import { useToast } from "../../../components/Toast";
import { getGroupsApi, bulkAddUsersToGroupApi } from "../userApi";

// BKAV HaiHS: Component cua so dung chung de gop nhanh hang loat nhan su vao nhom quyen chi dinh - start
const BulkAddToGroupModal = ({ isOpen, onClose, selectedUsers, onSuccess }) => {
  if (!isOpen) return null;

  const { showToast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupPage, setGroupPage] = useState(1);
  const [groupHasMore, setGroupHasMore] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  const dropdownRef = useRef(null);

  // Reset cac truong chon cu moi khi hop thoai duoc kich hoat mo ra
  useEffect(() => {
    setSelectedGroup(null);
    setIsDropdownOpen(false);
  }, [isOpen]);

  // Dong hop chon tha xuong neu nguoi dung click chuot ra khu vuc trong phia ngoai
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Goi mang tai danh sach cac nhom quyen kem theo ky thuat phan trang cuon vo han
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
      console.error("Khong load duoc danh sach nhom de gop:", err);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Kich hoat nap trang dau tien khi bam mo o dropdown lan dau
  const toggleDropdown = () => {
    if (!isDropdownOpen && groups.length === 0) {
      setGroupHasMore(true);
      fetchGroups(1, false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Tu dong goi trang moi khi thanh cuon dat muc gioi han gan cuoi trang
  const handleDropdownScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchGroups(groupPage + 1, true);
    }
  };

  // Thuc thi dong goi mien du lieu va day len he thong API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroup || isSubmitting) return;

    setIsSubmitting(true);
    const userIds = selectedUsers.map((u) => u.id);

    try {
      await bulkAddUsersToGroupApi(selectedGroup.id, userIds);
      showToast(
        `Da bo sung thanh cong ${userIds.length} thanh vien vao nhom [${selectedGroup.name}]`,
        "success",
      );
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Gop thanh vien vao nhom that bai";
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
        <div className="w-full max-w-lg bg-[#161b26] border border-[#232d42] rounded-2xl shadow-2xl flex flex-col relative overflow-visible">
          {/* Header cua khoi hop thoai */}
          <div className="px-6 py-4 border-b border-[#232d42] flex justify-between items-center bg-[#111622]/50 rounded-t-2xl shrink-0">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Add Users to Group
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Khong gian form chua cac thong tin rut gon */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 flex-1 overflow-visible"
          >
            {/* Truong hien thi danh sach nguoi dung dang chip hoan toan khoa tuong tac */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Selected Users ({selectedUsers.length})
              </label>
              <div className="cyber-scrollbar w-full bg-[#0b0f19] border border-[#232d42] rounded-xl px-3 py-3 flex flex-wrap gap-2 min-h-[46px] max-h-32 overflow-y-auto cursor-not-allowed opacity-80">
                {selectedUsers.map((user) => {
                  const displayChipName = `${user.fullname} (${user.email})`;
                  return (
                    <div
                      key={user.id}
                      className="bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg"
                    >
                      {displayChipName}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Truong hop nhan dien va lua chon mot nhom quyen duy nhat */}
            <div
              className="space-y-2 relative overflow-visible"
              ref={dropdownRef}
            >
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Select Target Group
              </label>
              <div
                onClick={toggleDropdown}
                className="w-full bg-[#0b0f19] border border-[#232d42] hover:border-gray-700 rounded-xl px-3 py-2.5 flex items-center justify-between min-h-[46px] cursor-pointer transition-all"
              >
                <span
                  className={`text-sm ${selectedGroup ? "text-white font-semibold" : "text-gray-600 pl-1"}`}
                >
                  {selectedGroup ? selectedGroup.name : "Select a group"}
                </span>
                <div className="flex items-center gap-2">
                  {selectedGroup && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGroup(null);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                  <FiChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-blue-500" : ""}`}
                  />
                </div>
              </div>

              {/* Menu tha xuong do danh sach cac nhom dang co ho tro tran vien tu do */}
              {isDropdownOpen && (
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
                      const isSelected = selectedGroup?.id === group.id;
                      return (
                        <div
                          key={group.id}
                          onClick={() => {
                            setSelectedGroup(group);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected ? "bg-blue-600/10 text-blue-400 font-bold" : "text-gray-300 hover:bg-gray-800"}`}
                        >
                          <span>{group.name}</span>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
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

            {/* Thanh nut bam chan trang giong kieu dang thiet ke block flow san co */}
            <div className="pt-6 mt-8 border-t border-[#232d42] flex justify-end items-center gap-3 bg-[#161b26] relative z-10">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white border border-[#232d42] bg-[#111622] hover:bg-gray-800 rounded-xl transition-all disabled:opacity-30 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedGroup}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/10 disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none cursor-pointer flex items-center gap-2 min-w-[130px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Add to Group</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
// BKAV HaiHS: Component cua so dung chung de gop nhanh hang loat nhan su vao nhom quyen chi dinh - end

export default BulkAddToGroupModal;
