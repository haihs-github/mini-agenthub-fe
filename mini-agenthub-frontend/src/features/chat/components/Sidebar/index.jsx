import React from "react";
import NavigationLinks from "./NavigationLinks";
import ConversationHistoryList from "./ConversationHistoryList";
import UserProfileWidget from "./UserProfileWidget";

const SidebarIndex = ({
  conversations,
  setConversations,
  activeId,
  selectConversation,
  hasMore,
  isLoadingHistory,
  fetchConversations,
  page,
  currentView,
  onViewChange, // <-- NHẬN THÊM PROPS ĐIỀU PHỐI TABS
}) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Khối Logo thương hiệu */}
      <div className="px-6 py-5 shrink-0 select-none">
        <h1 className="text-xl font-bold tracking-wider text-white">
          Agent Hub
        </h1>
      </div>

      {/* 4 Nút điều hướng chính */}
      <NavigationLinks currentView={currentView} onViewChange={onViewChange} />

      {/* 💡 CHIẾN THUẬT THÔNG MINH: Chỉ vẽ danh sách hội thoại khi đang ở tab chat */}
      {currentView === "chat" ? (
        <ConversationHistoryList
          conversations={conversations}
          setConversations={setConversations}
          activeId={activeId}
          selectConversation={selectConversation}
          hasMore={hasMore}
          isLoadingHistory={isLoadingHistory}
          fetchConversations={fetchConversations}
          page={page}
        />
      ) : (
        <div className="flex-1 p-6 text-xs text-gray-600 italic text-center select-none pt-16">
          Hệ thống quản trị nhân sự...
        </div>
      )}

      {/* Thông tin User & Đăng xuất */}
      <UserProfileWidget />
    </div>
  );
};

export default SidebarIndex;
