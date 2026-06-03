import React from "react";

// BKAV HaiHS : Component chia layout chính của ứng dụng - start
const AppLayout = ({ sidebar, children }) => {
  return (
    <div className="w-full h-screen bg-[#0b0f19] text-white flex overflow-hidden font-sans">
      {/* Cột Sidebar Trái - Cố định kích thước */}
      <aside className="w-[300px] h-full bg-[#0d121f] border-r border-[#1e293b] flex flex-col shrink-0">
        {sidebar}
      </aside>

      {/* Vùng không gian làm việc bên phải */}
      <main className="flex-1 h-full flex flex-col overflow-hidden relative bg-[#0b0f19]">
        {children}
      </main>
    </div>
  );
};
// BKAV HaiHS : Component chia layout chính của ứng dụng - end

export default AppLayout;
