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
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

function MainAppContent() {
  const chatProps = useChatStream("new-chat");
  const navigate = useNavigate();
  const location = useLocation();

  // BKAV HaiHS: Cập nhật điều kiện lọc nhận diện trạng thái active cho cả phân hệ cài đặt settings
  const currentView =
    location.pathname === "/users"
      ? "users"
      : location.pathname === "/groups"
        ? "groups"
        : location.pathname === "/settings"
          ? "settings"
          : "chat";

  // BKAV HaiHS: Thực hiện bẻ hướng url phù hợp khi người dùng click vào các mục trên sidebar
  const handleViewChange = (targetView) => {
    if (targetView === "chat") navigate("/chat");
    if (targetView === "users") navigate("/users");
    if (targetView === "groups") navigate("/groups");
    if (targetView === "settings") navigate("/settings");
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
          path="/chat"
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
        <Route path="/users" element={<UserWindow />} />
        <Route path="/groups" element={<GroupWindow />} />

        {/* BKAV HaiHS: Khai báo đường dẫn Route riêng biệt dành cho giao diện cấu hình cài đặt tài khoản */}
        <Route
          path="/settings"
          element={
            <SettingsWindow setConversations={chatProps.setConversations} />
          }
        />

        {/* BKAV HaiHS: Chuyển tuyến đường nhảy phòng hờ wildcard xuống vị trí cuối cùng trong danh sách */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="" replace />} />
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
      <LanguageProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppContentSwitcher />
          </ToastProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
