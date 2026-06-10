import React, { useState, useEffect } from "react";
import { FiPhone, FiMapPin, FiCheck, FiX, FiLoader } from "react-icons/fi";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../../components/Toast";
import { updateProfileApi } from "../settingsApi";
import ConfirmModal from "../../../components/ConfirmModal";

// BKAV HaiHS: component chỉnh sửa thông tin liên lạc - start
const PersonalInfo = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Khai báo các trạng thái quản lý hộp thoại xác nhận
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    targetValue: "",
  });

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  // Kiểm tra biểu thức chính quy số điện thoại phải chứa đúng 10 ký tự số thuần túy
  const validatePhoneNumber = (num) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(num);
  };

  // Kích hoạt bẫy xác nhận trước khi lưu thông tin thay đổi
  const handleOpenSaveConfirm = (type, value) => {
    if (type === "phone" && !validatePhoneNumber(value)) {
      showToast(
        "Số điện thoại không được chứa ký tự đặc biệt và phải đủ 10 chữ số!",
        "warning",
      );
      return;
    }
    setConfirmModal({ isOpen: true, type: `save_${type}`, targetValue: value });
  };

  // Kích hoạt bẫy xác nhận trước khi hủy bỏ tiến trình nhập liệu dở dang
  const handleOpenCancelConfirm = (type) => {
    const isDataChanged =
      type === "phone"
        ? phone !== (user?.phone || "")
        : address !== (user?.address || "");
    if (isDataChanged) {
      setConfirmModal({
        isOpen: true,
        type: `cancel_${type}`,
        targetValue: "",
      });
    } else {
      type === "phone" ? setIsEditingPhone(false) : setIsEditingAddress(false);
    }
  };

  // Thực thi gọi API cập nhật dữ liệu cấu trúc lên máy chủ hệ thống
  const executeUpdateProfile = async (targetType, value) => {
    setIsSubmitting(true);
    const payload = {
      phone: targetType === "phone" ? value : phone,
      address: targetType === "address" ? value : address,
    };

    try {
      const res = await updateProfileApi(payload);
      showToast("Cập nhật thông tin hồ sơ tài khoản thành công!", "success");

      // Đồng bộ lại trạng thái User Context cục bộ sau khi lưu thành công
      if (login && res?.data) {
        login(res.data);
      }

      targetType === "phone"
        ? setIsEditingPhone(false)
        : setIsEditingAddress(false);
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Không thể cập nhật hồ sơ do lỗi kết nối hệ thống",
        "error",
      );
      // Trả lại giá trị cũ nếu API bị lỗi thất bại
      if (targetType === "phone") setPhone(user?.phone || "");
      else setAddress(user?.address || "");
    } finally {
      setIsSubmitting(false);
      setConfirmModal({ isOpen: false, type: "", targetValue: "" });
    }
  };

  const handleConfirmAction = () => {
    const { type, targetValue } = confirmModal;
    if (type === "save_phone") executeUpdateProfile("phone", targetValue);
    if (type === "save_address") executeUpdateProfile("address", targetValue);
    if (type === "cancel_phone") {
      setPhone(user?.phone || "");
      setIsEditingPhone(false);
      setConfirmModal({ isOpen: false, type: "", targetValue: "" });
    }
    if (type === "cancel_address") {
      setAddress(user?.address || "");
      setIsEditingAddress(false);
      setConfirmModal({ isOpen: false, type: "", targetValue: "" });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-white font-bold text-sm select-none">
        <span className="text-gray-400 text-lg">👤</span>
        <h4>Personal Information</h4>
      </div>

      <div className="bg-[#161b26] border border-[#232d42] rounded-2xl p-5 divide-y divide-[#232d42]/60 shadow-xl">
        {/* ROW 1: PHONE NUMBER */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <FiPhone size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                Phone Number
              </p>
              {isEditingPhone ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full max-w-sm bg-[#0b0f19] border border-blue-500/40 text-xs text-gray-100 rounded-lg px-3 py-1.5 focus:outline-none font-mono"
                  placeholder="e.g. 0912345678"
                  autoFocus
                />
              ) : (
                <p className="text-xs font-semibold text-gray-200 font-mono tracking-wide truncate">
                  {phone || "Not configured yet"}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isEditingPhone ? (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenCancelConfirm("phone")}
                  disabled={isSubmitting}
                  className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <FiX size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSaveConfirm("phone", phone)}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-[11px] font-bold text-white rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <FiLoader size={12} className="animate-spin" />
                  ) : (
                    <FiCheck size={12} />
                  )}
                  Done
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingPhone(true)}
                className="px-4 py-1.5 bg-[#1e2533] border border-[#232d42] hover:bg-gray-800 text-[11px] font-bold text-blue-400 rounded-full transition-all cursor-pointer shadow-md"
              >
                Update
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: ADDRESS */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <FiMapPin size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                Address
              </p>
              {isEditingAddress ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full max-w-xl bg-[#0b0f19] border border-blue-500/40 text-xs text-gray-100 rounded-lg px-3 py-1.5 focus:outline-none"
                  placeholder="e.g. Hà Đông, Hà Nội"
                  autoFocus
                />
              ) : (
                <p className="text-xs font-semibold text-gray-200 truncate">
                  {address || "Not configured yet"}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isEditingAddress ? (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenCancelConfirm("address")}
                  disabled={isSubmitting}
                  className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <FiX size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSaveConfirm("address", address)}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-[11px] font-bold text-white rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <FiLoader size={12} className="animate-spin" />
                  ) : (
                    <FiCheck size={12} />
                  )}
                  Done
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingAddress(true)}
                className="px-4 py-1.5 bg-[#1e2533] border border-[#232d42] hover:bg-gray-800 text-[11px] font-bold text-blue-400 rounded-full transition-all cursor-pointer shadow-md"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hộp thoại bẫy xác nhận hành vi */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, type: "", targetValue: "" })
        }
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type.startsWith("save")
            ? "Xác nhận lưu thay đổi"
            : "Xác nhận hủy nhập liệu"
        }
        message={
          confirmModal.type.startsWith("save")
            ? "Bạn có chắc chắn muốn ghi đè thông tin mới này vào hồ sơ hệ thống không?"
            : "Hệ thống phát hiện dữ liệu ô nhập đã thay đổi. Bạn có chắc chắn muốn hủy bỏ toàn bộ tiến trình không?"
        }
        confirmText={
          confirmModal.type.startsWith("save")
            ? "Đồng ý cập nhật"
            : "Đồng ý hủy"
        }
        cancelText="Quay lại"
        type={confirmModal.type.startsWith("save") ? "info" : "warning"}
      />
    </div>
  );
};
// BKAV HaiHS: component chỉnh sửa thông tin liên lạc - end

export default PersonalInfo;
