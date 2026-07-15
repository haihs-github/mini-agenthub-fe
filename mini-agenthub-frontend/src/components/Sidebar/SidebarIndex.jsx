import React from "react";
import NavigationLinks from "./NavigationLinks";
import ConversationHistoryList from "./ConversationHistoryList";
import UserProfileWidget from "./UserProfileWidget";

// BKAV HaiHS: component sidebar - start
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
  onViewChange,
}) => {
  return (
    /* BKAV HaiHS: Cập nhật màu nền tổng của Sidebar - Sáng: bg-white / Tối: bg-[#0b0f19] */
    <div className="w-full h-full flex flex-col overflow-hidden bg-white dark:bg-[#0b0f19] transition-colors duration-300">
      {/* Khong gian logo thuong hieu dau trang */}
      <div className="px-6 py-5 shrink-0 select-none">
        {/* BKAV HaiHS: Đổi màu chữ Logo Agent Hub theo theme */}
        <h1 className="text-xl font-bold tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
          Agent Hub
        </h1>
      </div>

      <NavigationLinks currentView={currentView} onViewChange={onViewChange} />

      {/* Bo sung tro luc scrollbar-gutter de chong dich chuyen chieu rong toan bo sidebar */}
      <div
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
        style={{ scrollbarGutter: "stable" }}
      >
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
          <></>
        )}
      </div>

      <UserProfileWidget />
    </div>
  );
};
// BKAV HaiHS: component sidebar - end

export default SidebarIndex;
