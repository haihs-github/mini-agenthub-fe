import React from "react";
import { FiMessageSquare, FiUsers, FiShield, FiSettings } from "react-icons/fi";

const NavigationLinks = ({ currentView, onViewChange }) => {
  const navItems = [
    {
      id: "chat",
      label: "Chat",
      icon: <FiMessageSquare size={18} />,
      enabled: true,
    },
    {
      id: "users",
      label: "Người dùng",
      icon: <FiUsers size={18} />,
      enabled: true,
    }, // Mở tab để người dùng không có quyền bấm vào sẽ hiện lock screen báo lỗi
    {
      id: "groups",
      label: "Nhóm quyền",
      icon: <FiShield size={18} />,
      enabled: false,
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: <FiSettings size={18} />,
      enabled: false,
    },
  ];

  return (
    <nav className="px-3 py-4 border-b border-[#1e293b]/60 space-y-1">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            disabled={!item.enabled}
            onClick={() => item.enabled && onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              isActive
                ? "bg-[#1e293b] text-white shadow-md font-semibold border-l-4 border-blue-500"
                : item.enabled
                  ? "text-gray-400 hover:bg-[#161b26] hover:text-gray-200 cursor-pointer"
                  : "text-gray-600 cursor-not-allowed opacity-30"
            }`}
          >
            <span className={isActive ? "text-blue-400" : "text-gray-500"}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationLinks;
