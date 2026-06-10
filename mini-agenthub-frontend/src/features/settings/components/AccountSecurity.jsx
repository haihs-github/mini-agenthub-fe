import React from "react";
import { FiKey, FiTrash2, FiUserX, FiLogOut } from "react-icons/fi";

// BKAV HaiHS: component các chức năng an toàn tài khoản và phiên đăng nhập - start
const AccountSecurity = () => {
  return (
    <div className="space-y-4 animate-fade-in select-none">
      <div className="flex items-center gap-2 text-white font-bold text-sm">
        <span className="text-gray-400 text-lg">🛡️</span>
        <h4>Account & Security</h4>
      </div>

      <div className="bg-[#161b26] border border-[#232d42] rounded-2xl p-5 divide-y divide-[#232d42]/60 shadow-xl">
        {/* ROW 1: PASSWORD & SECURITY */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <FiKey size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs font-bold text-white">
                Password & Security
              </h5>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                Last updated 14 days ago. Enable 2FA for better security.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-1.5 bg-[#1e2533] border border-[#232d42] hover:bg-gray-800 text-[11px] font-bold text-blue-400 rounded-full transition-all shrink-0 shadow-md cursor-pointer"
          >
            Update
          </button>
        </div>

        {/* ROW 2: CLEAR CHAT HISTORY */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-orange-400 shrink-0 shadow-inner">
              <FiTrash2 size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs font-bold text-white">
                Clear Chat History
              </h5>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                Permanently delete all your conversation data across the system.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-5 py-1.5 bg-transparent border border-orange-500/30 text-orange-400 text-[11px] font-bold rounded-full hover:bg-orange-500/5 transition-all shrink-0 shadow-md cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* ROW 3: DELETE ACCOUNT */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-red-400 shrink-0 shadow-inner">
              <FiUserX size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs font-bold text-white">Delete Account</h5>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                Permanently remove your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-5 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-[11px] font-bold rounded-full transition-all shrink-0 shadow-md cursor-pointer"
          >
            Delete
          </button>
        </div>

        {/* ROW 4: SIGN OUT */}
        <div className="flex items-center justify-between py-4 first:pt-1 last:pb-1 group">
          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b0f19] border border-[#232d42] flex items-center justify-center text-gray-400 shrink-0 shadow-inner">
              <FiLogOut size={16} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs font-bold text-white">Sign Out</h5>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                End your current session and securely log out of the interface.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-1.5 bg-[#1a202c] border border-[#232d42] text-gray-400 hover:text-white text-[11px] font-bold rounded-full transition-all shrink-0 shadow-md cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
// BKAV HaiHS: component các chức năng an toàn tài khoản và phiên đăng nhập - start

export default AccountSecurity;
