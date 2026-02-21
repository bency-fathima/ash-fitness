import React from "react";
import {
  Home,
  Calendar,
  MessageSquare,
  BarChart2,
  FileText,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/client" },
    { icon: Calendar, label: "Daily Plan", path: "/client/daily-plan" },
    { icon: MessageSquare, label: "Message", path: "/client/chats" },
    { icon: BarChart2, label: "Progress", path: "/client/progress" },
    { icon: FileText, label: "Feedback", path: "/client/feedback" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-5 lg:hidden z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/client" && location.pathname === "/client/");
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <item.icon
                size={24}
                className={`${isActive ? "text-[#9e5608]" : "text-gray-400"}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-[#9e5608]" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
