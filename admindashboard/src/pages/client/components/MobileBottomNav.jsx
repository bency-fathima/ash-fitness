import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MessageCircle, TrendingUp, FileText } from "lucide-react";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/client",
    },
    {
      name: "Daily Plan",
      icon: Calendar,
      path: "/client/daily-plan",
    },
    {
      name: "Message",
      icon: MessageCircle,
      path: "/client/chats",
    },
    {
      name: "Progress",
      icon: TrendingUp,
      path: "/client/progress",
    },
    {
      name: "Feedback",
      icon: FileText,
      path: "/client/feedback",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <Icon
                className={`w-6 h-6 ${
                  active ? "text-[#9e5608]" : "text-gray-400"
                }`}
                strokeWidth={2}
              />
              <span
                className={`text-[11px] font-medium ${
                  active ? "text-[#9e5608]" : "text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
