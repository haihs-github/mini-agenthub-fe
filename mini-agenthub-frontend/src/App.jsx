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
// BKAV HaiHS: Import phan he quan ly nhom quyen vao he thong
import GroupWindow from "./features/groups/components/GroupWindow";
import Sidebar from "./components/Sidebar/SidebarIndex.jsx";
import ChatWindow from "./features/chat/components/ChatWindow.jsx";
import { useChatStream } from "./features/chat/hooks/useChatStream.js";

function MainAppContent() {
  const chatProps = useChatStream("new-chat");
  const navigate = useNavigate();
  const location = useLocation();

  // BKAV HaiHS: Thiet lap trang thai active cho menu dua tren duong dan hien tai cua trinh duyet
  const currentView =
    location.pathname === "/dashboard/users"
      ? "users"
      : location.pathname === "/dashboard/groups"
        ? "groups"
        : "chat";

  // BKAV HaiHS: Thuc hien be huong url phu hop khi nguoi dung click vao cac muc tren sidebar
  const handleViewChange = (targetView) => {
    if (targetView === "chat") navigate("/dashboard");
    if (targetView === "users") navigate("/dashboard/users");
    if (targetView === "groups") navigate("/dashboard/groups");
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
        {/* BKAV HaiHS: Dau noi va mo khoa tuyen duong cho phan he quan ly nhom quyen */}
        <Route path="/dashboard/groups" element={<GroupWindow />} />
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
