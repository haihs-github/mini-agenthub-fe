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
import GroupWindow from "./features/groups/components/GroupWindow";
import Sidebar from "./components/Sidebar/SidebarIndex.jsx";
import ChatWindow from "./features/chat/components/ChatWindow.jsx";
import { useChatStream } from "./features/chat/hooks/useChatStream.js";
import SettingsWindow from "./features/settings/components/SettingsWindow.jsx";

function MainAppContent() {
  const chatProps = useChatStream("new-chat");
  const navigate = useNavigate();
  const location = useLocation();

  // BKAV HaiHS: Cập nhật điều kiện lọc nhận diện trạng thái active cho cả phân hệ cài đặt settings
  const currentView =
    location.pathname === "/dashboard/users"
      ? "users"
      : location.pathname === "/dashboard/groups"
        ? "groups"
        : location.pathname === "/dashboard/settings"
          ? "settings"
          : "chat";

  // BKAV HaiHS: Thực hiện bẻ hướng url phù hợp khi người dùng click vào các mục trên sidebar
  const handleViewChange = (targetView) => {
    if (targetView === "chat") navigate("/dashboard");
    if (targetView === "users") navigate("/dashboard/users");
    if (targetView === "groups") navigate("/dashboard/groups");
    if (targetView === "settings") navigate("/dashboard/settings");
  };

  return (
    <AppLayout
      sidebar={
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
          onViewChange={handleViewChange}
        />
      }
    >
      <Routes>
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
        <Route path="/dashboard/users" element={<UserWindow />} />
        <Route path="/dashboard/groups" element={<GroupWindow />} />

        {/* BKAV HaiHS: Khai báo đường dẫn Route riêng biệt dành cho giao diện cấu hình cài đặt tài khoản */}
        <Route path="/dashboard/settings" element={<SettingsWindow />} />

        {/* BKAV HaiHS: Chuyển tuyến đường nhảy phòng hờ wildcard xuống vị trí cuối cùng trong danh sách */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

function AppContentSwitcher() {
  const { token } = useAuth();
  if (!token) {
    return <LoginForm />;
  }
  return <MainAppContent />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContentSwitcher />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
