import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

// BKAV HaiHS : cấu hình các ngôn ngữ - start
export const translations = {
  en: {
    // --- TOAST ---
    toast_success: "Success",
    toast_error: "An error occurred",
    toast_info: "Information",
    toast_image_only: "The system only supports image files!",
    toast_user_exist: "This user already exists in the group",
    toast_update_success: "Updated successfully",
    toast_create_success: "Created successfully",
    toast_load_members_fail: "Failed to load group members",
    toast_user_already_in_group: "User already in group or pending list",
    toast_add_success: "Added members successfully",
    toast_action_fail: "Action failed",
    toast_no_delete_perm: "No permission to delete members",
    toast_remove_success: "Removed member successfully",
    toast_remove_fail: "Failed to remove member",
    toast_clear_success: "Chat history cleared successfully",
    toast_delete_acc_success: "Account deleted permanently",
    toast_phone_invalid: "Invalid phone number!",
    toast_profile_success: "Profile updated successfully",
    toast_no_read_perm: "No permission to view details",
    toast_no_update_perm: "No permission to update",
    toast_no_delete_perm_generic: "No permission to delete",
    toast_delete_success: "Deleted successfully",
    toast_bulk_delete_success: "Successfully deleted",
    toast_bulk_delete_fail: "Bulk delete failed",
    toast_no_add_group_perm: "No permission to add to group",

    // --- SIDEBAR NAV ---
    nav_chat: "Chat",
    nav_users: "User Management",
    nav_groups: "Group Management",
    nav_settings: "System Settings",

    // --- CHAT WORKSPACE ---
    chat_welcome_title: "Mini Agent Hub Workspace",
    chat_welcome_desc:
      "Choose an AI model and send your first question to start a breakthrough conversation.",
    ai_status_ready: "AI Assistant System Ready",
    model_desc_llama: "High speed, optimized conversation",
    model_desc_flowise: "Drag & drop AI workflow system",
    select_model: "Select AI Model",
    attach_image: "Attach Image",
    chat_placeholder: "Enter your question here...",
    ai_disclaimer:
      "AI can provide inaccurate answers, please verify the source.",
    user_image_alt: "User attachment",

    // --- USER MANAGEMENT ---
    user_title: "User Management",
    user_desc:
      "Coordinate your intelligence network. Manage permissions, roles, and groups across the Mini AgentHub ecosystem.",
    user_filter: "Filter",
    user_add: "Add User",
    users_selected: "Users selected",
    user_no_permission: "Your account does not have USER_R permission.",
    user_empty: "No users found.",
    name: "Name",
    email: "Email",
    actions: "Actions",
    view_details: "View Details",
    edit_info: "Edit Info",
    delete_account: "Delete Account",
    modal_title_view: "User Details",
    modal_title_edit: "Update User",
    modal_title_create: "Add New User",
    full_name: "Full Name",
    email_address: "Email Address",
    groups_assignment: "Groups Assignment",
    no_group_assigned: "No groups assigned",
    select_group: "Select group",
    no_group_found: "No groups found",
    system_permissions: "System Permissions",
    no_perms_assigned: "No permissions assigned",
    cancel_btn: "Cancel",
    update_user: "Update User",
    create_user: "Create User",
    processing: "Processing...",
    confirm_cancel: "Confirm Cancellation",
    confirm_cancel_msg:
      "System detected changes. Are you sure you want to cancel?",
    agree_cancel: "Yes, cancel",
    keep_editing: "Keep editing",
    access_denied: "Access Denied",
    access_denied_user_desc:
      "Your account does not have permissions to access this module.",
    confirm_delete_title: "Confirm Deletion",
    confirm_delete_msg: "Are you sure you want to delete this user?",
    agree_delete: "Delete",
    keep_user: "Keep",
    confirm_bulk_delete_title: "Confirm Bulk Deletion",
    confirm_bulk_delete_msg:
      "Are you sure you want to delete selected members?",
    delete_all: "Delete All",

    // --- GROUP MANAGEMENT ---
    group_title: "Group Management",
    group_desc:
      "Monitor and coordinate intelligence teams. Manage permissions and members.",
    group_add: "Create New Group",
    group_total: "Total",
    group_no_permission: "No permission to view groups.",
    group_empty: "No groups found.",
    active_groups: "Active Groups",
    member_count: "Member Count",
    members: "members",
    manage_members: "Manage Members",
    edit_settings: "Edit Settings",
    delete_group: "Delete Group",
    group_modal_title: "Group Configuration",
    group_modal_subtitle: "Define group access and members.",
    identity: "Identity",
    group_name: "Group Name",
    entity_type: "Entity Type",
    users: "Users",
    groups: "Groups",
    rbac_matrix: "RBAC Permissions Matrix",
    action: "Action",
    desc: "Description",
    grant: "Grant",
    act_create: "Create",
    act_read: "Read",
    act_update: "Update",
    act_delete: "Delete",
    act_add_user: "Add User",
    act_del_user: "Delete User",
    desc_new_res: "New Resources",
    desc_res_data: "Resource Data",
    desc_edit_content: "Edit Content",
    desc_remove_assets: "Remove Assets",
    desc_new_groups: "New Groups/Resources",
    desc_group_data: "Group Data",
    desc_edit_group: "Edit Configuration",
    desc_delete_group: "Permanently Delete",
    desc_add_bulk: "Bulk Add Users",
    desc_del_bulk: "Bulk Remove Users",
    close: "Close",
    initialize: "Initialize",
    confirm_cancel_msg: "Are you sure you want to cancel?",
    agree_cancel: "Yes",
    keep_editing: "No",
    group_members_title: "Group Members",
    add_new_member: "Add Member",
    search_placeholder: "Search...",
    search_add_placeholder: "Search for new members...",
    add_btn: "Add",
    users_label: "Users",
    no_members_found: "No members found",
    confirm_remove_title: "Confirm Removal",
    confirm_remove_msg: "Remove member from group?",
    agree_remove: "Confirm",
    keep_member: "Cancel",

    // --- PAGINATION ---
    showing_page: "Showing page",
    of_total: "of",
    pages: "pages",
    nodes: "nodes",

    // --- ACCOUNT SECURITY ---
    accountSecurity: "Account & Security",
    passwordSecurity: "Password & Security",
    twoFactor: "Enable 2FA for better security.",
    updateBtn: "Update",
    clearChat: "Clear Chat History",
    clearChatDesc: "Permanently delete all conversation data.",
    clearBtn: "Clear",
    deleteAccount: "Delete Account",
    deleteAccountDesc: "Permanently remove all data.",
    deleteBtn: "Delete",
    signOut: "Sign Out",
    signOutDesc: "End your current session.",
    doneBtn: "Done",

    // --- PERSONAL INFO ---
    personalInfo: "Personal Information",
    phoneNumber: "Phone Number",
    address: "Address",
    notConfigured: "Not configured yet",
    address_placeholder: "e.g. Hanoi, Vietnam",
    confirm_save_title: "Confirm Save",
    confirm_save_msg: "Are you sure you want to update your profile?",
    confirm_btn: "Confirm",
    back_btn: "Back",
    workspaceSettings: "Workspace Settings",
    settingsDesc: "Manage your profiles and security.",

    // --- 🟢 NEW: PERSONALIZATION & PREFERENCES ---
    personalization: "Personalization",
    interfaceTheme: "Interface Theme",
    themeDesc:
      "Adjust the workspace appearance to reduce eye strain or match your lighting environment.",
    visualStyle: "Visual Style",
    dark: "Dark",
    light: "Light",
    global: "Global Preferences",
    language: "Language",
    languageDesc: "Set your preferred communication language.",

    // --- LOGIN & REGISTER ---
    login_title: "Sign in", // hoặc "Login"
    login_desc: "Welcome back to Mini AgentHub, please sign in first",
    secure_access: "Secure access", // hoặc "Access request" tùy ngữ cảnh
    email_label: "Email",
    password_label: "Password",
    pwd_placeholder: "Enter password",
    login_submit_btn: "login",
    back_to_home: "back to home",
  },
  vi: {
    // --- TOAST ---
    toast_success: "Thành công",
    toast_error: "Đã xảy ra lỗi",
    toast_info: "Thông tin",
    toast_image_only: "Hệ thống chỉ hỗ trợ các tệp hình ảnh!",
    toast_user_exist: "Người dùng này đã tồn tại trong nhóm",
    toast_update_success: "Cập nhật thành công",
    toast_create_success: "Tạo thành công",
    toast_load_members_fail: "Không thể tải danh sách thành viên nhóm",
    toast_user_already_in_group: "Người dùng đã trong nhóm hoặc danh sách chờ",
    toast_add_success: "Thêm thành viên thành công",
    toast_action_fail: "Hành động thất bại",
    toast_no_delete_perm: "Không có quyền xóa thành viên",
    toast_remove_success: "Xóa thành viên thành công",
    toast_remove_fail: "Xóa thành viên thất bại",
    toast_clear_success: "Đã xóa lịch sử trò chuyện thành công",
    toast_delete_acc_success: "Tài khoản đã bị xóa vĩnh viễn",
    toast_phone_invalid: "Số điện thoại không hợp lệ!",
    toast_profile_success: "Hồ sơ đã được cập nhật thành công",
    toast_no_read_perm: "Không có quyền xem chi tiết",
    toast_no_update_perm: "Không có quyền cập nhật",
    toast_no_delete_perm_generic: "Không có quyền xóa",
    toast_delete_success: "Xóa thành công",
    toast_bulk_delete_success: "Đã xóa thành công",
    toast_bulk_delete_fail: "Xóa hàng loạt thất bại",
    toast_no_add_group_perm: "Không có quyền thêm vào nhóm",

    // --- SIDEBAR NAV ---
    nav_chat: "Trò chuyện",
    nav_users: "Quản lý người dùng",
    nav_groups: "Quản lý nhóm",
    nav_settings: "Cài đặt hệ thống",

    // --- CHAT WORKSPACE ---
    chat_welcome_title: "Không gian làm việc Mini Agent Hub",
    chat_welcome_desc:
      "Chọn một mô hình AI và gửi câu hỏi đầu tiên của bạn để bắt đầu một cuộc trò chuyện đột phá.",
    ai_status_ready: "Hệ thống trợ lý AI đã sẵn sàng",
    model_desc_llama: "Tốc độ cao, tối ưu hóa cuộc trò chuyện",
    model_desc_flowise: "Hệ thống quy trình công việc AI kéo & thả",
    select_model: "Chọn mô hình AI",
    attach_image: "Đính kèm hình ảnh",
    chat_placeholder: "Nhập câu hỏi của bạn tại đây...",
    ai_disclaimer:
      "AI có thể cung cấp câu trả lời không chính xác, vui lòng xác minh nguồn.",
    user_image_alt: "Hình ảnh người dùng đính kèm",

    // --- USER MANAGEMENT ---
    user_title: "Quản lý người dùng",
    user_desc:
      "Điều phối mạng lưới trí tuệ của bạn. Quản lý quyền, vai trò và nhóm trên hệ sinh thái Mini AgentHub.",
    user_filter: "Bộ lọc",
    user_add: "Thêm người dùng",
    users_selected: "Người dùng đã chọn",
    user_no_permission: "Tài khoản của bạn không có quyền USER_R.",
    user_empty: "Không tìm thấy người dùng.",
    name: "Tên",
    email: "Email",
    actions: "Hành động",
    view_details: "Xem chi tiết",
    edit_info: "Sửa thông tin",
    delete_account: "Xóa tài khoản",
    modal_title_view: "Chi tiết người dùng",
    modal_title_edit: "Cập nhật người dùng",
    modal_title_create: "Thêm người dùng mới",
    full_name: "Họ và tên",
    email_address: "Địa chỉ Email",
    groups_assignment: "Gán nhóm",
    no_group_assigned: "Chưa gán nhóm",
    select_group: "Chọn nhóm",
    no_group_found: "Không tìm thấy nhóm",
    system_permissions: "Quyền hệ thống",
    no_perms_assigned: "Chưa gán quyền",
    cancel_btn: "Hủy",
    update_user: "Cập nhật người dùng",
    create_user: "Tạo người dùng",
    processing: "Đang xử lý...",
    confirm_cancel: "Xác nhận hủy",
    confirm_cancel_msg:
      "Hệ thống phát hiện các thay đổi. Bạn có chắc chắn muốn hủy?",
    agree_cancel: "Có, hủy",
    keep_editing: "Tiếp tục chỉnh sửa",
    access_denied: "Truy cập bị từ chối",
    access_denied_user_desc:
      "Tài khoản của bạn không có quyền truy cập vào mô-đun này.",
    confirm_delete_title: "Xác nhận xóa",
    confirm_delete_msg: "Bạn có chắc chắn muốn xóa người dùng này?",
    agree_delete: "Xóa",
    keep_user: "Giữ lại",
    confirm_bulk_delete_title: "Xác nhận xóa hàng loạt",
    confirm_bulk_delete_msg:
      "Bạn có chắc chắn muốn xóa các thành viên đã chọn?",
    delete_all: "Xóa tất cả",

    // --- GROUP MANAGEMENT ---
    group_title: "Quản lý nhóm",
    group_desc:
      "Giám sát và điều phối các đội ngũ trí tuệ. Quản lý quyền và thành viên.",
    group_add: "Tạo nhóm mới",
    group_total: "Tổng cộng",
    group_no_permission: "Không có quyền xem các nhóm.",
    group_empty: "Không tìm thấy nhóm.",
    active_groups: "Nhóm đang hoạt động",
    member_count: "Số lượng thành viên",
    members: "thành viên",
    manage_members: "Quản lý thành viên",
    edit_settings: "Chỉnh sửa cài đặt",
    delete_group: "Xóa nhóm",
    group_modal_title: "Cấu hình nhóm",
    group_modal_subtitle: "Định nghĩa quyền truy cập nhóm và thành viên.",
    identity: "Danh tính",
    group_name: "Tên nhóm",
    entity_type: "Loại thực thể",
    users: "Người dùng",
    groups: "Nhóm",
    rbac_matrix: "Ma trận quyền RBAC",
    action: "Hành động",
    desc: "Mô tả",
    grant: "Cấp quyền",
    act_create: "Tạo",
    act_read: "Đọc",
    act_update: "Cập nhật",
    act_delete: "Xóa",
    act_add_user: "Thêm người dùng",
    act_del_user: "Xóa người dùng",
    desc_new_res: "Tài nguyên mới",
    desc_res_data: "Dữ liệu tài nguyên",
    desc_edit_content: "Chỉnh sửa nội dung",
    desc_remove_assets: "Xóa tài sản",
    desc_new_groups: "Nhóm/Tài nguyên mới",
    desc_group_data: "Dữ liệu nhóm",
    desc_edit_group: "Chỉnh sửa cấu hình",
    desc_delete_group: "Xóa vĩnh viễn",
    desc_add_bulk: "Thêm người dùng hàng loạt",
    desc_del_bulk: "Xóa người dùng hàng loạt",
    close: "Đóng",
    initialize: "Khởi tạo",
    confirm_cancel_msg: "Bạn có chắc chắn muốn hủy?",
    agree_cancel: "Có",
    keep_editing: "Không",
    group_members_title: "Thành viên nhóm",
    add_new_member: "Thêm thành viên",
    search_placeholder: "Tìm kiếm...",
    search_add_placeholder: "Tìm thành viên mới...",
    add_btn: "Thêm",
    users_label: "Người dùng",
    no_members_found: "Không tìm thấy thành viên nào",
    confirm_remove_title: "Xác nhận xóa bỏ",
    confirm_remove_msg: "Xóa thành viên khỏi nhóm?",
    agree_remove: "Xác nhận",
    keep_member: "Hủy",

    // --- PAGINATION ---
    showing_page: "Đang hiển thị trang",
    of_total: "trên",
    pages: "trang",
    nodes: "nút",

    // --- ACCOUNT SECURITY ---
    accountSecurity: "Tài khoản & Bảo mật",
    passwordSecurity: "Mật khẩu & Bảo mật",
    twoFactor: "Bật 2FA để bảo mật tốt hơn.",
    updateBtn: "Cập nhật",
    clearChat: "Xóa lịch sử trò chuyện",
    clearChatDesc: "Xóa vĩnh viễn tất cả dữ liệu hội thoại.",
    clearBtn: "Xóa",
    deleteAccount: "Xóa tài khoản",
    deleteAccountDesc: "Xóa vĩnh viễn tất cả dữ liệu.",
    deleteBtn: "Xóa",
    signOut: "Đăng xuất",
    signOutDesc: "Kết thúc phiên hiện tại của bạn.",
    doneBtn: "Hoàn tất",

    // --- PERSONAL INFO ---
    personalInfo: "Thông tin cá nhân",
    phoneNumber: "Số điện thoại",
    address: "Địa chỉ",
    notConfigured: "Chưa cấu hình",
    address_placeholder: "ví dụ: Hà Nội, Việt Nam",
    confirm_save_title: "Xác nhận lưu",
    confirm_save_msg: "Bạn có chắc chắn muốn cập nhật hồ sơ không?",
    confirm_btn: "Xác nhận",
    back_btn: "Quay lại",
    workspaceSettings: "Cài đặt không gian làm việc",
    settingsDesc: "Quản lý hồ sơ và bảo mật của bạn.",

    // --- NEW: PERSONALIZATION & PREFERENCES ---
    personalization: "Cá nhân hóa",
    interfaceTheme: "Giao diện chủ đề",
    themeDesc:
      "Điều chỉnh giao diện không gian làm việc để giảm mỏi mắt hoặc phù hợp với môi trường ánh sáng của bạn.",
    visualStyle: "Phong cách trực quan",
    dark: "Tối",
    light: "Sáng",
    global: "Tùy chọn toàn cục",
    language: "Ngôn ngữ",
    languageDesc: "Thiết lập ngôn ngữ giao tiếp ưu tiên của bạn.",

    // --- LOGIN & REGISTER ---
    login_title: "đăng nhập",
    login_desc:
      "chào mừng quay trở lại với mini agenthub, vui lòng đăng nhập trước",
    secure_access: "yêu cầu truy cập",
    email_label: "email",
    password_label: "mật khẩu",
    pwd_placeholder: "nhập mật khẩu",
    login_submit_btn: "đăng nhập",
    back_to_home: "về trang chủ",
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
// BKAV HaiHS : privider chuyển ngôn ngữ - end

export const useLanguage = () => useContext(LanguageContext);
