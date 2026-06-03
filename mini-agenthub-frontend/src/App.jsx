import React from "react";
import { AuthProvider, useAuth } from "./features/auth/AuthContext"; // <-- Thêm useAuth ở đây
import { ToastProvider } from "./components/Toast";
import AppLayout from "./components/layout/AppLayout";
import { Sidebar, ChatWindow, useChatStream } from "./features/chat";
import LoginForm from "./features/auth/components/LoginForm"; // <-- Rước em nó quay trở lại nào!

// BKAV HaiHS : khởi tạo toàn bộ ứng dụng, kiểm tra xác thực và điều phối hiển thị giữa LoginForm và ChatWorkspace - start
function MainAppContent() {
  const { token } = useAuth(); // 🔑 Lấy token từ Context toàn cục ra để check
  const chatProps = useChatStream("new-chat");

  if (!token) {
    return <LoginForm />;
  }

  // Nếu có Token hợp lệ -> Mở khóa cho phép tận hưởng không gian Chat AI
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
        />
      }
    >
      <ChatWindow
        messages={chatProps.messages}
        isStreaming={chatProps.isStreaming}
        isWaitingSkeleton={chatProps.isWaitingSkeleton}
        sendMessage={chatProps.sendMessage}
        handleStopStream={chatProps.handleStopStream}
        attachedImages={chatProps.attachedImages}
        setAttachedImages={chatProps.setAttachedImages}
      />
    </AppLayout>
  );
}
// BKAV HaiHS : khởi tạo toàn bộ ứng dụng, kiểm tra xác thực và điều phối hiển thị giữa LoginForm và ChatWorkspace - end

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainAppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
