import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

// BKAV HaiHS : cấu hình các ngôn ngữ - start
export const translations = {
  en: {
    // --- SIDEBAR NAV ---
    nav_chat: "Workspace Chat",
    nav_users: "User Management",
    nav_groups: "Group Management",
    nav_settings: "System Settings",

    // --- CHAT WORKSPACE ---
    chat_welcome_title: "Mini Agent Hub Workspace",
    chat_welcome_desc:
      "Choose an AI model and send your first question to start a breakthrough conversation.",
    chat_skeleton: "AI is thinking...",

    // --- USER MANAGEMENT ---
    user_title: "User Management",
    user_desc:
      "Coordinate your intelligence network. Manage system permissions, roles, and collaborative groups across the Mini AgentHub ecosystem.",
    user_filter: "Filter",
    user_add: "Add User",
    user_selected: "Users selected",
    user_no_permission:
      "Your account does not have USER_R permission to view the user list.",
    user_empty: "No personnel found.",

    // --- GROUP MANAGEMENT ---
    group_title: "Group Management",
    group_desc:
      "Monitor and coordinate high-performance intelligence teams. View active groups, manage permissions, and inspect nested member hierarchies.",
    group_add: "Create New Group",
    group_total: "Total",
    group_no_permission:
      "Your account does not have GROUP_R permission to view the group list.",
    group_empty: "No groups found.",

    // --- PERSONALIZATION & SETTINGS (Giữ lại của cũ) ---
    visualStyle: "Visual Style",
    interfaceTheme: "Interface Theme",
    themeDesc:
      "Adjust the workspace appearance to reduce eye strain or match your lighting environment.",
    dark: "Dark",
    light: "Light",
    global: "Global",
    language: "Language",
    languageDesc: "Set your preferred communication language.",
    workspaceSettings: "Workspace Settings",
    settingsDesc:
      "Manage your personal profiles, interface preferences, and system security credentials.",
    accountSecurity: "Account & Security",
    passwordSecurity: "Password & Security",
    updateBtn: "Update",
    signOut: "Sign Out",
    personalInfo: "Personal Information",
    phoneNumber: "Phone Number",
    address: "Address",
    notConfigured: "Not configured yet",
  },
  vi: {
    // --- SIDEBAR NAV ---
    nav_chat: "Không gian Chat",
    nav_users: "Quản lý Thành viên",
    nav_groups: "Quản lý Nhóm quyền",
    nav_settings: "Cài đặt Hệ thống",

    // --- CHAT WORKSPACE ---
    chat_welcome_title: "Mini Agent Hub Workspace",
    chat_welcome_desc:
      "Hãy chọn một mô hình AI và gửi câu hỏi đầu tiên để bắt đầu cuộc trò chuyện bứt phá.",
    chat_skeleton: "AI đang suy nghĩ...",

    // --- USER MANAGEMENT ---
    user_title: "Quản lý Người dùng",
    user_desc:
      "Điều phối mạng lưới tình báo của bạn. Quản lý quyền hạn hệ thống, vai trò và các nhóm cộng tác trên toàn bộ hệ sinh thái Mini AgentHub.",
    user_filter: "Bộ lọc",
    user_add: "Thêm thành viên",
    user_selected: "Thành viên được chọn",
    user_no_permission:
      "Tài khoản của bạn không có quyền USER_R để đọc dữ liệu danh sách thành viên.",
    user_empty: "Không tìm thấy nhân sự nào phù hợp.",

    // --- GROUP MANAGEMENT ---
    group_title: "Quản lý Nhóm quyền",
    group_desc:
      "Giám sát và điều phối các đội nhóm tình báo hiệu suất cao. Xem các nhóm đang hoạt động, quản lý phân quyền ma trận và kiểm tra thành viên.",
    group_add: "Tạo nhóm mới",
    group_total: "Tổng số",
    group_no_permission:
      "Tài khoản của bạn không có quyền GROUP_R để xem danh sách nhóm quyền.",
    group_empty: "Không tìm thấy nhóm quyền nào.",

    // --- PERSONALIZATION & SETTINGS (Giữ lại của cũ) ---
    visualStyle: "Phong cách trực quan",
    interfaceTheme: "Giao diện nền",
    themeDesc:
      "Điều chỉnh giao diện không gian làm việc để giảm mỏi mắt hoặc phù hợp với môi trường ánh sáng của bạn.",
    dark: "Tối",
    light: "Sáng",
    global: "Hệ thống",
    language: "Ngôn ngữ",
    languageDesc: "Thiết lập ngôn ngữ giao tiếp ưu tiên của bạn trên hệ thống.",
    workspaceSettings: "Cài đặt không gian làm việc",
    settingsDesc:
      "Quản lý hồ sơ cá nhân, tùy chọn giao diện trực quan và thông tin bảo mật tài khoản.",
    accountSecurity: "Tài khoản & Bảo mật",
    passwordSecurity: "Mật khẩu & Định danh",
    updateBtn: "Cập nhật",
    signOut: "Đăng xuất",
    personalInfo: "Thông tin liên lạc cá nhân",
    phoneNumber: "Số điện thoại",
    address: "Địa chỉ cư trú",
    notConfigured: "Chưa được cấu hình",
  },
};
// BKAV HaiHS : cấu hình các ngôn ngữ - end

// BKAV HaiHS : privider chuyển ngôn ngữ - start
export const LanguageProvider = ({ children }) => {
  // Tự động kiểm tra trạng thái ngôn ngữ cũ trong máy, mặc định ban đầu là tiếng Anh 'en'
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang); // Ghi nhớ lựa chọn vào bộ nhớ trình duyệt
  };

  // Hàm helper t() chịu trách nhiệm bóc tách text động dựa theo key truyền vào
  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
// BKAV HaiHS : privider chuyển ngôn ngữ - start

export const useLanguage = () => useContext(LanguageContext);
