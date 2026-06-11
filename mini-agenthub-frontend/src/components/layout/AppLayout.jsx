import React from "react";

// BKAV HaiHS : Component chia layout chính của ứng dụng - start
const AppLayout = ({ sidebar, children }) => {
  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-white flex overflow-hidden font-sans transition-colors duration-300">
      {/* Cột Sidebar Trái - Cố định kích thước */}
      <aside className="w-[300px] h-full bg-white dark:bg-[#0d121f] border-r border-gray-200 dark:border-[#1e293b] flex flex-col shrink-0 transition-colors duration-300">
        {sidebar}
      </aside>

      {/* Vùng không gian làm việc bên phải */}
      <main className="flex-1 h-full flex flex-col overflow-hidden relative bg-gray-50 dark:bg-[#0b0f19] transition-colors duration-300">
        {children}
      </main>
    </div>
  );
};
// BKAV HaiHS : Component chia layout chính của ứng dụng - end

export default AppLayout;
