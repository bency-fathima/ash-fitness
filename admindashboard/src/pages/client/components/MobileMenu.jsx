import React from "react";
import { X, Search, LogOut, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileMenu({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Home", path: "/client" },
    { label: "My Profile", path: "/client/profile" }, // Assuming profile route exists or placeholder
    { label: "Daily Plan", path: "/client/daily-plan" },
    { label: "Message", path: "/client/chats" },
    { label: "Progress", path: "/client/progress" },
    { label: "Feedback", path: "/client/feedback" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#9e5608] text-xl font-bold">Menu</h2>
        <button onClick={onClose} className="p-1">
          <X className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search anything"
          className="w-full bg-[#FAFAFA] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-0">
        {menuItems.map((item, index) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/client" && location.pathname === "/client/");

          return (
            <div
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center justify-between py-5 border-b border-gray-50 cursor-pointer active:bg-gray-50
                    ${isActive ? "text-[#9e5608]" : "text-gray-600"}
                `}
            >
              <span
                className={`font-medium text-[15px] ${isActive ? "font-bold" : ""}`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#9e5608]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mt-4">
        <button className="w-full bg-[#EBF3F2] text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-4">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
