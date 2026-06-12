import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // Hàm kích hoạt hiển thị Toast dùng chung cho toàn bộ ứng dụng
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  // Tự động ẩn Toast sau 2 giây
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Cấu hình Icon và Màu sắc tương ứng với từng trạng thái nghiệp vụ
  const renderIcon = () => {
    switch (toast.type) {
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

  const getBorderColor = () => {
    switch (toast.type) {
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

      {/* GIAO DIỆN TOAST DÙNG CHUNG */}
      <div
        className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 bg-white border border-gray-100 dark:border-0 dark:bg-[#1c2436] border-l-4 ${getBorderColor()} text-gray-600 dark:text-gray-200 px-5 py-4 rounded-r-lg shadow-2xl transform transition-all duration-300 ease-out ${
          toast.show
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {renderIcon()}
        <div className="flex flex-col text-sm pr-4">
          {/* BKAV HaiHS: Đồng bộ màu chữ và sử dụng từ khóa dịch thuật */}
          <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {toast.type === "success"
              ? t("toast_success") || "Thành công"
              : toast.type === "error"
                ? t("toast_error") || "Thất bại"
                : t("toast_info") || "Thông báo"}
          </span>
          {/* BKAV HaiHS: Đồng bộ màu chữ nội dung thông báo */}
          <span className="mt-0.5 text-gray-500 dark:text-gray-300 transition-colors duration-300">
            {t(toast.message)}
          </span>
        </div>
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
