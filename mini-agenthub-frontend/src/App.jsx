// src/App.jsx
import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { ToastProvider } from "./components/Toast";
import AppLayout from "./components/layout/AppLayout";
import LoginForm from "./features/auth/components/LoginForm";
import UserWindow from "./features/users/components/UserWindow";

// 🚀 BÈ HƯỚNG IMPORT TRỰC TIẾP CHUẨN XÁC - KHỬ LỖI TUẦN HOÀN BARREL FILE
import Sidebar from "./features/chat/components/Sidebar/index.jsx";
import ChatWindow from "./features/chat/components/ChatWindow.jsx";
import { useChatStream } from "./features/chat/hooks/useChatStream.js";

// BKAV HaiHS : Component bọc không gian làm việc chính sau khi người dùng xác thực thành công - start
function MainAppContent() {
  // Bộ não điều khiển luồng stream kết nối dữ liệu chat, kích hoạt an toàn trong Functional Component
  const chatProps = useChatStream("new-chat");
  const navigate = useNavigate();
  const location = useLocation();

  // URL LÀ CHÂN LÝ: Dựa vào đường dẫn hiện tại của trình duyệt để định vị bôi sáng tab Sidebar tương ứng
  const currentView =
    location.pathname === "/dashboard/users" ? "users" : "chat";

  // Hàm tập trung xử lý chuyển màn hình bằng cách bẻ hướng URL thay vì set State thủ công
  const handleViewChange = (targetView) => {
    if (targetView === "chat") navigate("/dashboard");
    if (targetView === "users") navigate("/dashboard/users");
  };

  return (
    <AppLayout
      sidebar={
        // 🟢 ĐÃ SỬA: Đổi tên thẻ từ SidebarIndex thành Sidebar cho khớp hoàn toàn với biến import ở dòng 15
        <Sidebar
          conversations={chatProps.conversations}
          setConversations={chatProps.setConversations}
          activeId={chatProps.activeId}
          selectConversation={chatProps.selectConversation}
          hasMore={chatProps.hasMore}
          isLoadingHistory={chatProps.isLoadingHistory}
          fetchConversations={chatProps.fetchConversations}
          page={chatProps.page}
          currentView={currentView}
          onViewChange={handleViewChange} // Truyền hàm bẻ lái điều hướng URL xuống các nút bấm ở Sidebar
        />
      }
    >
      {/* BKAV HaiHS : HỆ THỐNG ĐỊNH TUYẾN WORKSPACE BẰNG REACT ROUTER DOM - start */}
      <Routes>
        {/* Kịch bản 1: Mặc định lội thẳng vào /dashboard -> Kích hoạt khung cửa sổ Chat AI */}
        <Route
          path="/dashboard"
          element={
            <ChatWindow
              messages={chatProps.messages}
              isStreaming={chatProps.isStreaming}
              isWaitingSkeleton={chatProps.isWaitingSkeleton}
              sendMessage={chatProps.sendMessage}
              handleStopStream={chatProps.handleStopStream}
              attachedImages={chatProps.attachedImages}
              setAttachedImages={chatProps.setAttachedImages}
            />
          }
        />

        {/* Kịch bản 2: Khi URL là /dashboard/users -> Trực quan hóa màn hình quản lý thành viên */}
        <Route path="/dashboard/users" element={<UserWindow />} />

        {/* Kịch bản 3: Bẫy mọi đường dẫn lạ hoặc gõ thiếu để ép đá người dùng quay về /dashboard an toàn */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      {/* BKAV HaiHS : HỆ THỐNG ĐỊNH TUYẾN WORKSPACE BẰNG REACT ROUTER DOM - end */}
    </AppLayout>
  );
}
// BKAV HaiHS : Component bọc không gian làm việc chính sau khi người dùng xác thực thành công - end

// BKAV HaiHS : Bộ kiểm soát phân tầng đóng vai trò bộ lọc Guard Router bảo mật - start
function AppContentSwitcher() {
  const { token } = useAuth();

  // Trạm gác an ninh: Nếu bộ nhớ Context báo chưa có Token đăng nhập, ép hiển thị form đăng nhập ngay lập tức
  if (!token) {
    return <LoginForm />;
  }

  // Ngược lại, nếu token ngon lành, cho phép đi sâu vào khai thác hệ thống chính
  return <MainAppContent />;
}
// BKAV HaiHS : Bộ kiểm soát phân tầng đóng vai trò bộ lọc Guard Router bảo mật - end

// BKAV HaiHS : Cấu trúc bọc Context toàn cục tầng gốc của ứng dụng - start
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        {/* 🟢 ĐÃ SỬA: Loại bỏ bọc thẻ <Routes> cồng kềnh thừa thãi ở đây để triệt tiêu tận gốc lỗi Invalid hook call */}
        <AppContentSwitcher />
      </ToastProvider>
    </AuthProvider>
  );
}
// BKAV HaiHS : Cấu trúc bọc Context toàn cục tầng gốc của ứng dụng - end

export default App;
