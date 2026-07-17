import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiTriangle,
} from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ

// 1. Khởi tạo Context để quản lý trạng thái đóng mở Toast toàn hệ thống
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const { t } = useLanguage(); // BKAV HaiHS: Sử dụng hàm t() để dịch thuật tiêu đề
  const [toasts, setToasts] = useState([]);

  // Hàm kích hoạt hiển thị Toast dùng chung cho toàn bộ ứng dụng - bọc useCallback để tránh re-create tham chiếu gây vòng lặp vô hạn
  const showToast = useCallback((message, type = "info") => {
    if (!message) return;
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500); // 2.5 giây để người dùng kịp đọc khi có nhiều thông báo
  }, []);

  // BKAV HaiHS : Đăng ký sự kiện lắng nghe để kích hoạt toast từ các file JS thuần - start
  useEffect(() => {
    const handleShowToast = (e) => {
      const { message, type } = e.detail || {};
      showToast(message, type);
    };
    window.addEventListener("show-toast", handleShowToast);
    return () => window.removeEventListener("show-toast", handleShowToast);
  }, []);
  // BKAV HaiHS : Đăng ký sự kiện lắng nghe để kích hoạt toast từ các file JS thuần - end

  // Cấu hình Icon và Màu sắc tương ứng với từng trạng thái nghiệp vụ
  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-500 text-xl shrink-0" />;
      case "error":
        return <FiAlertCircle className="text-red-500 text-xl shrink-0" />;
      case "warning":
        return <FiTriangle className="text-yellow-500 text-xl shrink-0" />;
      default:
        return <FiInfo className="text-blue-500 text-xl shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      case "warning":
        return "border-yellow-500";
      default:
        return "border-blue-500";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-toast-slide-in {
          animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* GIAO DIỆN DANH SÁCH TOAST XẾP CHỒNG */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 bg-white border border-gray-100 dark:border-0 dark:bg-[#1c2436] border-l-4 ${getBorderColor(
              toast.type,
            )} text-gray-600 dark:text-gray-200 px-5 py-4 rounded-r-lg shadow-2xl animate-toast-slide-in`}
          >
            {renderIcon(toast.type)}
            <div className="flex flex-col text-sm pr-4">
              <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {toast.type === "success"
                  ? t("toast_success") || "Thành công"
                  : toast.type === "error"
                    ? t("toast_error") || "Thất bại"
                    : toast.type === "warning"
                      ? t("toast_warning") || "Cảnh báo"
                      : t("toast_info") || "Thông báo"}
              </span>
              <span className="mt-0.5 text-gray-500 dark:text-gray-300 transition-colors duration-300">
                {t(toast.message)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// BKAV HaiHS : Custom Hook dùng chung - start
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast phải được đặt bên trong một ToastProvider!");
  }
  return context;
};
