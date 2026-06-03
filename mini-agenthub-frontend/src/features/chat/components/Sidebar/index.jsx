import React from "react";
import NavigationLinks from "./NavigationLinks";
import ConversationHistoryList from "./ConversationHistoryList";
import UserProfileWidget from "./UserProfileWidget";

// BKAV HaiHS : Component chính của thanh sidebar, chứa logo, navigation, lịch sử hội thoại và thông tin user - start
const SidebarIndex = ({
  conversations,
  setConversations,
  activeId,
  selectConversation,
  hasMore,
  isLoadingHistory,
  fetchConversations,
  page,
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
      <NavigationLinks />

      {/* Danh sách phòng chat cuộn vô hạn */}
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

      {/* Thông tin User & Đăng xuất */}
      <UserProfileWidget />
    </div>
  );
};
// BKAV HaiHS : Component chính của thanh sidebar, chứa logo, navigation, lịch sử hội thoại và thông tin user - end

export default SidebarIndex;
