import React from "react";
import { MoreHorizontal, Bell, MessageSquare, RefreshCw } from "lucide-react";
import {
  formatNotificationTime,
  getDashboardNotificationStyle,
} from "@/utils/notification";

const getIcon = (iconType, className) => {
  if (iconType === "message") return <MessageSquare size={16} className={className} />;
  if (iconType === "refresh") return <RefreshCw size={16} className={className} />;
  return <Bell size={16} className={className} />;
};

export default function RecentNotificationsCard({
  notifications = [],
  loading = false,
  emptyLabel = "No notifications yet",
  className = "",
}) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden min-h-[500px] ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#9e5608]">Recent Notifications</h3>
        <MoreHorizontal size={20} className="text-gray-400" />
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar">
        {loading ? (
          <p className="text-sm text-[#66706D]">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-[#66706D]">{emptyLabel}</p>
        ) : (
          notifications.map((notification) => {
            const style = getDashboardNotificationStyle(notification.type);
            return (
              <div key={notification._id} className="flex gap-4">
                <div className={`${style.bgClass} p-2.5 h-fit rounded-full shrink-0`}>
                  {getIcon(style.icon, style.iconClass)}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-[#9e5608] leading-tight">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-[#66706D]">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
