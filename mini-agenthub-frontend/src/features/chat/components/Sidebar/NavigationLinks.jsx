import React from "react";
import { FiMessageSquare, FiUsers, FiShield, FiSettings } from "react-icons/fi";

// BKAV HaiHS : Component icon điều hướng trong thanh sidebar - start
const NavigationLinks = () => {
  const navItems = [
    {
      id: "chat",
      label: "Chat",
      icon: <FiMessageSquare size={18} />,
      active: true,
    },
    {
      id: "users",
      label: "Người dùng",
      icon: <FiUsers size={18} />,
      active: false,
    },
    {
      id: "groups",
      label: "Nhóm quyền",
      icon: <FiShield size={18} />,
      active: false,
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: <FiSettings size={18} />,
      active: false,
    },
  ];

  return (
    <nav className="px-3 py-4 border-b border-[#1e293b]/60 space-y-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          disabled={!item.active} // Hiện tại khóa các trang khác, chỉ mở trang Chat Core
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            item.active
              ? "bg-[#1e293b] text-white shadow-md"
              : "text-gray-400 hover:bg-[#161b26] hover:text-gray-200 cursor-not-allowed"
          }`}
        >
          <span className={item.active ? "text-blue-400" : "text-gray-500"}>
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </nav>
  );
};
// BKAV HaiHS : Component icon điều hướng trong thanh sidebar - start

export default NavigationLinks;
