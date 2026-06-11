import React from "react";
import { FiMessageSquare, FiUsers, FiShield, FiSettings } from "react-icons/fi";
import { useAuth } from "../../features/auth/AuthContext";

// BKAV HaiHS: Component NavigationLinks trong sidebar, hiển thị các liên kết điều hướng đến các phần khác nhau của dashboard dựa trên quyền của người dùng - start
const NavigationLinks = ({ currentView, onViewChange }) => {
  const { permissions } = useAuth();
  const userPermissions = permissions || [];

  const hasChatPermission =
    userPermissions.includes("CHAT") || userPermissions.length > 0;
  const hasUserPermission = userPermissions.some((p) => p.startsWith("USER_"));
  const hasGroupPermission = userPermissions.some((p) =>
    p.startsWith("GROUP_"),
  );
  const hasSettingsPermission =
    userPermissions.includes("SETTINGS") ||
    userPermissions.includes("ADMIN") ||
    userPermissions.some((p) => p.startsWith("GROUP_"));

  const menuItems = [
    {
      id: "chat",
      label: "Chat",
      icon: FiMessageSquare,
      show: hasChatPermission,
    },
    {
      id: "users",
      label: "Người dùng",
      icon: FiUsers,
      show: hasUserPermission,
    },
    {
      id: "groups",
      label: "Nhóm quyền",
      icon: FiShield,
      show: hasGroupPermission,
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: FiSettings,
      show: true,
    },
  ];

  return (
    <nav className="space-y-1.5 px-4 select-none shrink-0">
      {menuItems.map((item) => {
        if (!item.show) return null;

        const IconComponent = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
              isActive
                ? "bg-[#161b26] text-white border border-[#232d42] shadow-lg shadow-black/10"
                : "text-gray-400 hover:text-gray-200 hover:bg-[#161b26]/40 border border-transparent"
            }`}
          >
            {/* Giu co dinh vung chua de ngan chan hien tuong dich chuyen sub-pixel cua SVG */}
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              <IconComponent
                size={18}
                className={isActive ? "text-blue-500" : "text-gray-500"}
              />
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
// BKAV HaiHS: Component NavigationLinks trong sidebar, hiển thị các liên kết điều hướng đến các phần khác nhau của dashboard dựa trên quyền của người dùng - end

export default NavigationLinks;
